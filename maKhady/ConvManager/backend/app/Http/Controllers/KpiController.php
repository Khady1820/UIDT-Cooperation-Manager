<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kpi;

class KpiController extends Controller
{
    public function index()
    {
        // 1. Get detailed KPIs from the kpis table
        $kpis = Kpi::with('convention')->get();
        
        // 2. Get main indicators from conventions table
        $conventions = \App\Models\Convention::whereNotNull('indicator')
            ->where('indicator', '!=', '')
            ->get();

        $conventionKpis = $conventions->map(function ($convention) {
            return [
                'id' => 'conv-' . $convention->id,
                'name' => $convention->indicator,
                'valeur_reference' => '0',
                'valeur_cible' => (string)$convention->target,
                'valeur_atteinte' => (string)$convention->actual_value,
                'frequence_mesure' => 'Global Projet',
                'responsable' => $convention->user?->name ?? 'Non assigné',
                'description' => 'Indicateur principal défini dans le dossier : ' . $convention->name,
                'convention' => [
                    'id' => $convention->id,
                    'name' => $convention->name,
                    'num_dossier' => $convention->num_dossier
                ],
                'is_primary' => true
            ];
        });

        // 3. Merge and return
        return response()->json($kpis->concat($conventionKpis));
    }

    public function store(Request $request)
    {
        $request->validate([
            'convention_id' => 'required|exists:conventions,id',
            'name' => 'required|string|max:255',
            'value' => 'nullable|numeric',
            'description' => 'nullable|string',
            'valeur_reference' => 'nullable|string',
            'valeur_cible' => 'nullable|string',
            'valeur_atteinte' => 'nullable|string',
            'frequence_mesure' => 'nullable|string',
            'responsable' => 'nullable|string',
        ]);

        $kpi = Kpi::create($request->all());
        $kpi->convention->refreshCompletionRate();
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
            'value' => 'nullable|numeric',
            'description' => 'nullable|string',
            'valeur_reference' => 'nullable|string',
            'valeur_cible' => 'nullable|string',
            'valeur_atteinte' => 'nullable|string',
            'frequence_mesure' => 'nullable|string',
            'responsable' => 'nullable|string',
        ]);

        $kpi->update($request->all());
        $kpi->convention->refreshCompletionRate();
        return response()->json($kpi);
    }

    public function destroy($id)
    {
        $kpi = Kpi::findOrFail($id);
        $convention = $kpi->convention;
        $kpi->delete();
        $convention->refreshCompletionRate();
        return response()->json(['message' => 'KPI deleted successfully']);
    }
}
