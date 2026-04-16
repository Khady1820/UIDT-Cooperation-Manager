<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Convention;
use App\Models\User;
use App\Notifications\ConventionStatusChanged;
use Illuminate\Support\Facades\Notification;

class ConventionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Convention::with(['kpis', 'user', 'logs.user']);
        
        if (!$user->role) {
            return response()->json([]);
        }

        $role = $user->role->name;

        if ($role === 'porteur_projet' || $role === 'responsable') {
            $query->where('user_id', $user->id);
        } elseif ($role === 'chef_division') {
            // Chef sees dossiers at 'soumis' stage
            if ($request->has('pending')) {
                $query->where('status', 'soumis');
            }
        } elseif ($role === 'directeur_cooperation' || $role === 'admin') {
            // Admin and Director see pending dossiers at 'valide_chef_division' and 'valide_juridique'
            if ($request->has('pending')) {
                $query->whereIn('status', ['valide_chef_division', 'valide_juridique']);
            }
        } elseif ($role === 'service_juridique') {
            // Legal sees dossiers after initial director validation
            if ($request->has('pending')) {
                $query->where('status', 'valide_dir_initial');
            } else {
                $query->whereIn('status', ['valide_dir_initial', 'valide_juridique']);
            }
        } elseif ($role === 'recteur') {
            // Rector only sees dossiers after final validation
            if ($request->has('pending')) {
                $query->where('status', 'pret_pour_signature');
            } else {
                $query->whereIn('status', ['pret_pour_signature', 'termine']);
            }
        } elseif ($role === 'partenaire') {
            $query->where('partners', 'like', '%' . $user->name . '%')
                  ->where('status', 'termine');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:regional,national,international',
            'partner_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'objectives' => 'nullable|string',
            'partners' => 'nullable|string',
            'year' => 'nullable|integer',
            'duration' => 'nullable|string|max:255',
            'indicator' => 'nullable|string|max:255',
            'target' => 'nullable|numeric',
            'actual_value' => 'nullable|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'observations' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,jpg,png,docx|max:10240',
        ]);

        $data = $request->all();
        
        // Calculate completion rate
        if (isset($data['target']) && isset($data['actual_value']) && $data['target'] > 0) {
            $data['completion_rate'] = ($data['actual_value'] / $data['target']) * 100;
        }
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'brouillon';

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('conventions', 'public');
            $data['file_path'] = $path;
        }

        $convention = Convention::create($data);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'creation',
            'comment' => 'Convention créée en tant que brouillon'
        ]);

        return response()->json($convention, 201);
    }

    public function show($id)
    {
        $convention = Convention::with('kpis')->findOrFail($id);
        return response()->json($convention);
    }

    public function update(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:regional,national,international',
            'partner_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'objectives' => 'nullable|string',
            'partners' => 'nullable|string',
            'year' => 'nullable|integer',
            'duration' => 'nullable|string|max:255',
            'indicator' => 'nullable|string|max:255',
            'target' => 'nullable|numeric',
            'actual_value' => 'nullable|numeric',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'observations' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,jpg,png,docx|max:10240',
            'status' => 'sometimes|string|in:brouillon,soumis,valide_dir,signe_recteur,rejete,termine,archive,en cours,en attente',

        ]);

        $data = $request->all();

        // Recalculate completion rate
        $target = $data['target'] ?? $convention->target;
        $actualValue = $data['actual_value'] ?? $convention->actual_value;

        if ($target && $actualValue && $target > 0) {
            $data['completion_rate'] = ($actualValue / $target) * 100;
        }

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('conventions', 'public');
            $data['file_path'] = $path;
        }

        $oldStatus = $convention->status;
        $convention->update($data);

        // Audit Logging for status changes
        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            $action = $data['status'] === 'archive' ? 'archivage' : 'restauration';
            $comment = $data['status'] === 'archive' ? 'Dossier déplacé vers les archives' : 'Dossier restauré vers les projets actifs';
            
            $convention->logs()->create([
                'user_id' => $request->user()->id,
                'action' => $action,
                'comment' => $comment
            ]);
        }
        return response()->json($convention);
    }

    public function submit(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'soumis']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'soumission',
            'comment' => 'Convention soumise pour première validation (Direction)'
        ]);

        // Notify Chef de Division (instead of Director)
        $chefs = User::whereHas('role', function($q) {
            $q->where('name', 'chef_division');
        })->get();
        Notification::send($chefs, new ConventionStatusChanged($convention, 'soumis', $request->user()));

        return response()->json($convention);
    }

    public function preValidateByChef(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string'
        ]);

        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'valide_chef_division']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'pre_validation_chef',
            'comment' => 'Pré-validation effectuée par le Chef de Division. Avis : ' . $request->comment
        ]);

        // Notify Directors
        $directors = User::whereHas('role', function($q) {
            $q->where('name', 'directeur_cooperation');
        })->get();
        Notification::send($directors, new ConventionStatusChanged($convention, 'valide_chef_division', $request->user()));

        return response()->json($convention);
    }

    public function validateByDirector(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        
        // Ensure it has been pre-validated by Chef if coming from submitted state
        if ($convention->status !== 'valide_chef_division' && $request->user()->id !== 1) { // 1 is admin bypass
             // response()->json(['error' => 'Le dossier doit être pré-validé par le Chef de Division.'], 403);
        }

        $convention->update(['status' => 'valide_dir_initial']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'validation_directeur_initial',
            'comment' => 'Première validation effectuée. Dossier transmis au Service Juridique.'
        ]);

        // Notify Legal
        $legalUsers = User::whereHas('role', function($q) {
            $q->where('name', 'service_juridique');
        })->get();
        Notification::send($legalUsers, new ConventionStatusChanged($convention, 'valide_dir_initial', $request->user()));

        return response()->json($convention);
    }

    public function validateByLegal(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'valide_juridique']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'validation_juridique',
            'comment' => 'Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.'
        ]);

        // Notify Directors
        $directors = User::whereHas('role', function($q) {
            $q->where('name', 'directeur_cooperation');
        })->get();
        Notification::send($directors, new ConventionStatusChanged($convention, 'valide_juridique', $request->user()));

        return response()->json($convention);
    }

    public function finalizeByDirector(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'pret_pour_signature']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'finalisation_directeur',
            'comment' => 'Contrôle final effectué. Dossier transmis au Rectorat pour signature.'
        ]);

        // Notify Recteurs
        $recteurs = User::whereHas('role', function($q) {
            $q->where('name', 'recteur');
        })->get();
        Notification::send($recteurs, new ConventionStatusChanged($convention, 'pret_pour_signature', $request->user()));

        return response()->json($convention);
    }

    public function signByRector(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'termine']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'signature_recteur',
            'comment' => 'Signé par le Recteur'
        ]);

        // Notify Porteur
        $convention->user->notify(new ConventionStatusChanged($convention, 'termine', $request->user()));

        return response()->json($convention);
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string'
        ]);

        $user = $request->user();
        $convention = Convention::findOrFail($id);
        
        $newStatus = 'brouillon'; // Default: back to porteur
        $actionDescription = 'Rejeté. Motif : ' . $request->reason;

        if ($user->role->name === 'chef_division') {
            $newStatus = 'brouillon'; 
            $actionDescription = 'Examen Chef de Division : Rejeté pour modifications. Motif : ' . $request->reason;
        } elseif ($user->role->name === 'service_juridique') {
            $newStatus = 'valide_chef_division'; // Back to director for arbitration after chef's visa
            $actionDescription = 'Visa Juridique Refusé. Retour à la Direction. Motif : ' . $request->reason;
        }

        $convention->update([
            'status' => $newStatus,
            'rejection_reason' => $request->reason
        ]);

        $convention->logs()->create([
            'user_id' => $user->id,
            'action' => 'rejet',
            'comment' => $actionDescription
        ]);

        // Notify 
        if ($newStatus === 'soumis') {
            $directors = User::whereHas('role', function($q) {
                $q->where('name', 'directeur_cooperation');
            })->get();
            Notification::send($directors, new ConventionStatusChanged($convention, 'soumis', $user));
        } else {
            $convention->user->notify(new ConventionStatusChanged($convention, 'brouillon', $user));
        }

        return response()->json($convention);
    }

    public function getDashboardStats(Request $request)
    {
        $user = $request->user();
        $role = $user->role->name;
        
        $query = Convention::query();
        
        if ($role === 'porteur_projet' || $role === 'responsable') {
            $query->where('user_id', $user->id);
        } elseif ($role === 'partenaire') {
            $query->where('partners', 'like', '%' . $user->name . '%')
                  ->where('status', 'termine');
        }

        $activeCount = (clone $query)->where('status', 'termine')->count();
        $pendingStatuses = ['soumis', 'valide_dir_initial', 'valide_juridique', 'pret_pour_signature', 'en attente', 'en cours'];
        $pendingCount = (clone $query)->whereIn('status', $pendingStatuses)->count();
        $avgEfficiency = (clone $query)->avg('completion_rate') ?? 0;
        
        // Distribution by type
        $types = (clone $query)
            ->select('type', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();
 
        // Recent Activity
        $activityQuery = \App\Models\ConventionLog::with(['convention', 'user'])->latest();
        if ($role !== 'admin' && $role !== 'directeur_cooperation' && $role !== 'recteur' && $role !== 'service_juridique') {
            $activityQuery->whereHas('convention', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        $recentActivity = $activityQuery->take(4)->get();
 
        // Pending Actions for the "Urgentes" section
        $pendingActions = (clone $query)
            ->whereIn('status', $pendingStatuses)
            ->with('user')
            ->latest()
            ->take(3)
            ->get();

        return response()->json([
            'active_conventions' => $activeCount,
            'efficiency_index' => round($avgEfficiency, 1),
            'pending_validations' => $pendingCount,
            'cooperation_types' => $types,
            'recent_activity' => $recentActivity,
            'pending_actions' => $pendingActions,
            'total_conventions' => (clone $query)->count()
        ]);
    }

    public function logIndex()
    {
        $logs = \App\Models\ConventionLog::with(['convention', 'user'])
            ->latest()
            ->get();
        return response()->json($logs);
    }

    public function destroy($id)
    {
        $convention = Convention::findOrFail($id);
        $convention->delete();
        return response()->json(['message' => 'Convention deleted successfully']);
    }
}
