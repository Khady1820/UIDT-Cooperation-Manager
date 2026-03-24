<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kpi;

class KpiController extends Controller
{
    public function index()
    {
        return response()->json(Kpi::with('convention')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'convention_id' => 'required|exists:conventions,id',
            'name' => 'required|string|max:255',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $kpi = Kpi::create($request->all());
        return response()->json($kpi, 201);
    }

    public function show($id)
    {
        $kpi = Kpi::with('convention')->findOrFail($id);
        return response()->json($kpi);
    }

    public function update(Request $request, $id)
    {
        $kpi = Kpi::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'value' => 'sometimes|numeric',
            'description' => 'nullable|string',
        ]);

        $kpi->update($request->all());
        return response()->json($kpi);
    }

    public function destroy($id)
    {
        $kpi = Kpi::findOrFail($id);
        $kpi->delete();
        return response()->json(['message' => 'KPI deleted successfully']);
    }
}
