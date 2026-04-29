<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index()
    {
        // Seul l'admin ou le staff peut voir tous les tickets
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return Ticket::with('user')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'string',
        ]);

        $ticket = Ticket::create([
            'user_id' => Auth::id(),
            'type' => $request->type,
            'subject' => $request->subject,
            'message' => $request->message,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Ticket créé avec succès',
            'ticket' => $ticket
        ], 201);
    }

    public function show($id)
    {
        $ticket = Ticket::with('user')->findOrFail($id);
        
        // Un utilisateur ne peut voir que ses propres tickets, sauf s'il est admin
        if (!Auth::user()->hasRole('admin') && $ticket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return $ticket;
    }

    public function update(Request $request, $id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->only(['status', 'priority']));

        return response()->json([
            'message' => 'Ticket mis à jour',
            'ticket' => $ticket
        ]);
    }

    public function destroy($id)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        Ticket::findOrFail($id)->delete();
        return response()->json(['message' => 'Ticket supprimé']);
    }

    public function myTickets()
    {
        return Ticket::where('user_id', Auth::id())->latest()->get();
    }
}
