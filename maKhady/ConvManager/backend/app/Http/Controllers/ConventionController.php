<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Convention;

class ConventionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Convention::with('kpis');
        
        if ($user->role && $user->role->name === 'partenaire') {
            $query->where('partners', 'like', '%' . $user->name . '%');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'partners' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'in:en cours,terminé,en attente',
        ]);

        $convention = Convention::create($request->all());
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
            'partners' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'in:en cours,terminé,en attente',
        ]);

        $convention->update($request->all());
        return response()->json($convention);
    }

    public function destroy($id)
    {
        $convention = Convention::findOrFail($id);
        $convention->delete();
        return response()->json(['message' => 'Convention deleted successfully']);
    }
}
