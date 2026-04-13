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


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    // Admin Specific Routes (Users & Partners)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/users', UserController::class);
        Route::apiResource('/partners', PartenaireController::class);
    });

    // Routes for Porteur de Projet / Responsable (Project Leads)
    Route::middleware('role:admin,responsable,porteur_projet')->group(function () {
        Route::post('/conventions', [ConventionController::class, 'store']);
        Route::put('/conventions/{id}', [ConventionController::class, 'update']);
        Route::delete('/conventions/{id}', [ConventionController::class, 'destroy']);
        Route::post('/conventions/{id}/submit', [ConventionController::class, 'submit']);
        
        Route::post('/kpis', [KpiController::class, 'store']);
        Route::put('/kpis/{id}', [KpiController::class, 'update']);
        Route::delete('/kpis/{id}', [KpiController::class, 'destroy']);
    });

    // Routes for Management (Validation/Signature)
    Route::middleware('role:admin,directeur_cooperation,recteur')->group(function () {
        Route::post('/conventions/{id}/validate-director', [ConventionController::class, 'validateByDirector']);
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
});
