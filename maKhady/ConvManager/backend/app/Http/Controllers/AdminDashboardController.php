<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Partenaire;
use App\Models\Convention;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalUsers = User::count();
        $totalPartners = Partenaire::count();
        $totalArchives = Convention::where('status', 'archive')->count();
        
        $recentLogins = User::with('role')
            ->whereNotNull('last_login_at')
            ->orderBy('last_login_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'total_users' => $totalUsers,
            'total_partners' => $totalPartners,
            'total_archives' => $totalArchives,
            'recent_logins' => $recentLogins
        ]);
    }
}
