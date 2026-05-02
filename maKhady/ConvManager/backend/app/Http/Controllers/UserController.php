<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('role')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'is_active' => $request->get('is_active', true),
        ]);

        // Send Welcome Notification
        $user->notify(new \App\Notifications\NewUserWelcome($validated['password']));

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->role_id = $validated['role_id'];
        
        if ($request->has('is_active')) {
            $user->is_active = $request->boolean('is_active');
            // Force logout by deleting all tokens if deactivated
            if (!$user->is_active) {
                $user->tokens()->delete();
            }
        }
        
        $user->save();

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if (auth()->id() == $id) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte.'], 403);
        }

        try {
            // Clear notifications before deleting user (polymorphic relationship)
            if (method_exists($user, 'notifications')) {
                $user->notifications()->delete();
            }
            
            $user->delete();
            return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la suppression : ' . $e->getMessage()], 500);
        }
    }
}
