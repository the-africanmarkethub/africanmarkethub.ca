<?php

use Illuminate\Foundation\Application;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        \App\Http\Middleware\CorsOptionsMiddleware::class;
        $middleware->statefulApi();
        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'http://localhost:3000/*', // Allow all requests from Next.js local dev
            'http://127.0.0.1:3000/*', // Sometimes Next.js uses 127.0.0.1
        ]);
        $middleware->alias([
            'vendor' => \App\Http\Middleware\CheckIfVendor::class,
            'customer' => \App\Http\Middleware\CheckIfCustomer::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom 404 page (example)
        $exceptions->render(function (NotFoundHttpException $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        });

        // Custom 403 response for API (example)
        $exceptions->render(function (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        });
        // Handle Validation Exceptions (e.g., form validation errors)
        $exceptions->render(function (ValidationException $e) {
            return response()->json($e->errors(), 422); // Return validation errors
        });
        // Handle other HTTP exceptions (404, 500, etc.)
        $exceptions->render(function (HttpException $e) {
            $statusCode = $e->getStatusCode();
            $message = $e->getMessage() ?: 'Error'; // Use default message if none provided

            return response()->json(['error' => $message], $statusCode);
        });
    })->create();
