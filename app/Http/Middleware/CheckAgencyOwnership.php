<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAgencyOwnership
{
    /**
     * Verificar que el usuario operador tenga un perfil asociado.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado.',
            ], 401);
        }

        // Si es admin, siempre puede pasar.
        if ($user->isAdmin()) {
            return $next($request);
        }

        // Si es operador externo, verificar que tenga un perfil asociado.
        if ($user->isAgency() && !$user->agency) {
            return response()->json([
                'message' => 'Tu perfil de operador no esta completo. Por favor completa el registro.',
                'action' => 'complete_agency_profile',
            ], 403);
        }

        return $next($request);
    }
}
