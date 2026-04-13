<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        );

        // URL (Project 1 is usually on different port or base url, but for local testing I'll use 3000)
        // Adjusting based on common React local port
        $resetUrl = "http://localhost:3000/reset-password?token=" . $token . "&email=" . urlencode($request->email);

        Mail::raw("Bonjour, réinitialisez votre mot de passe ici : " . $resetUrl, function ($message) use ($request) {
            $message->to($request->email)->subject('Réinitialisation de mot de passe');
        });

        return response()->json(['message' => 'Lien envoyé (vérifiez les logs du serveur)']);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed'
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Lien invalide'], 400);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Lien expiré'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe mis à jour']);
    }
}
