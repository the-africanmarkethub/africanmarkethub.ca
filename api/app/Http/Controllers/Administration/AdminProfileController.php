<?php

namespace App\Http\Controllers\Administration;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AdminProfileController extends Controller
{
    public function updateProfile(Request $request): JsonResponse
    {
        $admin = Auth::user();

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|required|email:rfc,dns|unique:admin_users,email,' . $admin->id,
            'phone' => 'sometimes|nullable|string|max:20',
        ]);

        $admin->update($validatedData);

        return response()->json(['message' => 'Profile updated successfully', 'data' => $admin], 200);
    }
}
