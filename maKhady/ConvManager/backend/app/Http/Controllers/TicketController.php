<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        // Protected by middleware, but adding direct check for safety
        if ($request->user()->role->name !== 'admin') {
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
            'user_id' => $request->user()->id,
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

    public function show(Request $request, $id)
    {
        $ticket = Ticket::with('user')->findOrFail($id);
        
        $user = $request->user();
        // Un utilisateur ne peut voir que ses propres tickets, sauf s'il est admin
        if ($user->role->name !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return $ticket;
    }

    public function update(Request $request, $id)
    {
        // Protected by middleware
        if ($request->user()->role->name !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->only(['status', 'priority']));

        return response()->json([
            'message' => 'Ticket mis à jour',
            'ticket' => $ticket
        ]);
    }

    public function destroy(Request $request, $id)
    {
        // Protected by middleware
        if ($request->user()->role->name !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        Ticket::findOrFail($id)->delete();
        return response()->json(['message' => 'Ticket supprimé']);
    }

    public function myTickets(Request $request)
    {
        return Ticket::where('user_id', $request->user()->id)->latest()->get();
    }
}
