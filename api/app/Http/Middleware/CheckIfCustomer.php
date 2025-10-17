<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfCustomer
{
    
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure the request has an Authorization header with a Bearer token
        $authorizationHeader = $request->header('Authorization');
        if (!$authorizationHeader || !preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
            return response()->json(['message' => 'Unauthorized: Bearer token missing or malformed'], 401);
        }

        if ($request->user() && $request->user()->is_status == '0') {
            return response()->json(['status' => 'error', 'message' => 'Your account is not active yet. Verify your acount to continue'], 403);
        }

        if ($request->user() && $request->user()->role != 'customer') {
            return response()->json(['status' => 'error', 'message' => 'You are not authorized to perform this action. Login as a customer to continue'], 403);
        }
        return $next($request);
    }
}
