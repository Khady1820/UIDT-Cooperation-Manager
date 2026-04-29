<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConventionController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PartenaireController;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [\App\Http\Controllers\PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [\App\Http\Controllers\PasswordResetController::class, 'reset']);
Route::get('/public-stats', [ConventionController::class, 'publicStats']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    // Admin Specific Routes (Users & Partners)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/users', UserController::class);
        Route::apiResource('/partners', PartenaireController::class);
        Route::get('/admin/dashboard-stats', [\App\Http\Controllers\AdminDashboardController::class, 'stats']);
        Route::get('/admin/backup', [\App\Http\Controllers\AdminController::class, 'backup']);
    });

    // Routes for Porteur de Projet (Project Leads)
    Route::middleware('role:admin,porteur_projet')->group(function () {
        Route::post('/conventions', [ConventionController::class, 'store']);
        Route::delete('/conventions/{id}', [ConventionController::class, 'destroy']);
        Route::post('/conventions/{id}/submit', [ConventionController::class, 'submit']);
        
        Route::post('/kpis', [KpiController::class, 'store']);
        Route::put('/kpis/{id}', [KpiController::class, 'update']);
        Route::delete('/kpis/{id}', [KpiController::class, 'destroy']);
    });

    // Update route allowed for Porteurs AND all supervisors AND secretariat
    Route::middleware('role:admin,porteur_projet,directeur_cooperation,recteur,service_juridique,chef_division,secretariat')->group(function () {
        Route::put('/conventions/{id}', [ConventionController::class, 'update']);
    });

    // Routes for Management (Validation/Signature)
    Route::middleware('role:admin,directeur_cooperation,recteur,service_juridique,chef_division')->group(function () {
        Route::post('/conventions/{id}/validate-chef', [ConventionController::class, 'preValidateByChef']);
        Route::post('/conventions/{id}/validate-director', [ConventionController::class, 'validateByDirector']);
        Route::post('/conventions/{id}/validate-legal', [ConventionController::class, 'validateByLegal']);
        Route::post('/conventions/{id}/finalize-director', [ConventionController::class, 'finalizeByDirector']);
        Route::post('/conventions/{id}/sign-rector', [ConventionController::class, 'signByRector']);
        Route::post('/conventions/{id}/reject', [ConventionController::class, 'reject']);
    });

    // All authenticated users (Admin, Responsable, Partenaire)
    Route::get('/conventions', [ConventionController::class, 'index']);
    Route::get('/logs', [ConventionController::class, 'logIndex']);
    Route::get('/conventions/{id}', [ConventionController::class, 'show']);
    
    Route::get('/kpis', [KpiController::class, 'index']);
    Route::get('/kpis/{id}', [KpiController::class, 'show']);

    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);

    Route::get('/dashboard/stats', [ConventionController::class, 'getDashboardStats']);

    // Support Tickets Routes
    Route::get('/my-tickets', [\App\Http\Controllers\TicketController::class, 'myTickets']);
    Route::post('/tickets', [\App\Http\Controllers\TicketController::class, 'store']);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/admin/tickets', \App\Http\Controllers\TicketController::class);
    });
});
