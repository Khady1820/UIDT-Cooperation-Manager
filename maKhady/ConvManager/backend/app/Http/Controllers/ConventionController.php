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
        } elseif ($role === 'directeur_cooperation') {
            // For the Director, show everything in the list but we will filter in the Validation page
            if ($request->has('pending')) {
                $query->where('status', 'soumis');
            }
        } elseif ($role === 'recteur') {
            // Rector only sees dossiers after Director validation
            if ($request->has('pending')) {
                $query->where('status', 'valide_dir');
            } else {
                $query->whereIn('status', ['valide_dir', 'signe_recteur']);
            }
        } elseif ($role === 'partenaire') {
            $query->where('partners', 'like', '%' . $user->name . '%')
                  ->where('status', 'signe_recteur');
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

        $convention->update($data);
        return response()->json($convention);
    }

    public function submit(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'soumis']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'soumission',
            'comment' => 'Convention soumise pour validation'
        ]);

        // Notify Directors
        $directors = User::whereHas('role', function($q) {
            $q->where('name', 'directeur_cooperation');
        })->get();
        Notification::send($directors, new ConventionStatusChanged($convention, 'soumis', $request->user()));

        return response()->json($convention);
    }

    public function validateByDirector(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'valide_dir']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'validation_directeur',
            'comment' => 'Validé par le Directeur de la Coopération'
        ]);

        // Notify Recteurs
        $recteurs = User::whereHas('role', function($q) {
            $q->where('name', 'recteur');
        })->get();
        Notification::send($recteurs, new ConventionStatusChanged($convention, 'valide_dir', $request->user()));

        return response()->json($convention);
    }

    public function signByRector(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);
        $convention->update(['status' => 'signe_recteur']);

        $convention->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'signature_recteur',
            'comment' => 'Signé par le Recteur'
        ]);

        // Notify Porteur
        $convention->user->notify(new ConventionStatusChanged($convention, 'signe_recteur', $request->user()));

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
