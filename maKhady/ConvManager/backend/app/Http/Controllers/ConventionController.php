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
        } elseif ($role === 'directeur_cooperation' || $role === 'admin') {
            // Admin and Director see pending dossiers
            if ($request->has('pending')) {
                $query->where('status', 'en attente');
            }
        } elseif ($role === 'recteur') {
            // Rector only sees dossiers after Director validation
            if ($request->has('pending')) {
                $query->where('status', 'en cours');
            } else {
                $query->whereIn('status', ['en cours', 'termine']);
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
        $convention->update(['status' => 'en attente']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'soumission',
            'comment' => 'Convention soumise pour validation'
        ]);

        // Notify Directors
        $directors = User::whereHas('role', function($q) {
            $q->where('name', 'directeur_cooperation');
        })->get();
        Notification::send($directors, new ConventionStatusChanged($convention, 'en attente', $request->user()));

        return response()->json($convention);
    }

    public function validateByDirector(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'en cours']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'validation_directeur',
            'comment' => 'Validé par le Directeur de la Coopération'
        ]);

        // Notify Recteurs
        $recteurs = User::whereHas('role', function($q) {
            $q->where('name', 'recteur');
        })->get();
        Notification::send($recteurs, new ConventionStatusChanged($convention, 'en cours', $request->user()));

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

        $convention = Convention::findOrFail($id);
        $convention->update([
            'status' => 'brouillon', // Back to draft for correction
            'rejection_reason' => $request->reason
        ]);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'rejet',
            'comment' => 'Rejeté. Motif : ' . $request->reason
        ]);

        // Notify Porteur
        $convention->user->notify(new ConventionStatusChanged($convention, 'brouillon', $request->user()));

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
        $pendingCount = (clone $query)->whereIn('status', ['en attente', 'en cours'])->count();
        $avgEfficiency = (clone $query)->avg('completion_rate') ?? 0;
        
        // Distribution by type
        $types = (clone $query)
            ->select('type', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();

        // Recent Activity
        $activityQuery = \App\Models\ConventionLog::with(['convention', 'user'])->latest();
        if ($role !== 'admin' && $role !== 'directeur_cooperation' && $role !== 'recteur') {
            $activityQuery->whereHas('convention', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        $recentActivity = $activityQuery->take(4)->get();

        // Pending Actions for the "Urgentes" section
        $pendingActions = (clone $query)
            ->whereIn('status', ['en attente', 'en cours'])
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
