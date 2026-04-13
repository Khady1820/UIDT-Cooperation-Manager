<?php

namespace App\Http\Controllers;

use App\Models\Partenaire;
use Illuminate\Http\Request;

class PartenaireController extends Controller
{
    public function index()
    {
        return response()->json(Partenaire::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string',
            'email' => 'nullable|email|unique:partenaires,email',
            'telephone' => 'nullable|string',
            'address' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $partenaire = Partenaire::create($validated);
        return response()->json($partenaire, 201);
    }

    public function update(Request $request, $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string',
            'email' => 'nullable|email|unique:partenaires,email,' . $id,
            'telephone' => 'nullable|string',
            'address' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $partenaire->update($validated);
        return response()->json($partenaire);
    }

    public function destroy($id)
    {
        Partenaire::destroy($id);
        return response()->json(null, 204);
    }
}
