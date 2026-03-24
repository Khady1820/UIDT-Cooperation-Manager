<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user() || !$request->user()->role) {
            return response()->json(['message' => 'Unauthorized. Please login.'], 401);
        }

        if (!in_array($request->user()->role->name, $roles)) {
            return response()->json(['message' => 'Forbidden. You do not have the required permissions.'], 403);
        }

        return $next($request);
    }
}
