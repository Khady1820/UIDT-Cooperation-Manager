<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConventionController;
use App\Http\Controllers\KpiController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    // Admin and Responsable only routes
    Route::middleware('role:admin,responsable')->group(function () {
        Route::post('/conventions', [ConventionController::class, 'store']);
        Route::put('/conventions/{id}', [ConventionController::class, 'update']);
        Route::delete('/conventions/{id}', [ConventionController::class, 'destroy']);

        Route::post('/kpis', [KpiController::class, 'store']);
        Route::put('/kpis/{id}', [KpiController::class, 'update']);
        Route::delete('/kpis/{id}', [KpiController::class, 'destroy']);
    });

    // All authenticated users (Admin, Responsable, Partenaire)
    Route::get('/conventions', [ConventionController::class, 'index']);
    Route::get('/conventions/{id}', [ConventionController::class, 'show']);
    
    Route::get('/kpis', [KpiController::class, 'index']);
    Route::get('/kpis/{id}', [KpiController::class, 'show']);
});
