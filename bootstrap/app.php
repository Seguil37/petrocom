<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\CheckAgencyOwnership;
use App\Http\Middleware\TrackActivity;
use App\Http\Middleware\CheckModulePermission;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Registrar alias de middleware personalizados
        $middleware->alias([
            'role' => CheckRole::class,
            'agency' => CheckAgencyOwnership::class,
            'track' => TrackActivity::class,
            'module' => CheckModulePermission::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            return $request->is('api/*') ? null : '/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $databaseUnavailableResponse = function (Request $request) {
            if (!$request->expectsJson() && !$request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => 'No pudimos conectarnos con el servicio en este momento. Intenta nuevamente en unos minutos.',
            ], 503);
        };

        $exceptions->render(function (QueryException $e, Request $request) use ($databaseUnavailableResponse) {
            return $databaseUnavailableResponse($request);
        });

        $exceptions->render(function (\PDOException $e, Request $request) use ($databaseUnavailableResponse) {
            return $databaseUnavailableResponse($request);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (!$request->expectsJson() && !$request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => 'No autenticado.',
            ], 401);
        });
    })->create();
