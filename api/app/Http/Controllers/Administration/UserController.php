<?php

namespace App\Http\Controllers\Administration;

use Carbon\Carbon;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cookie;

class UserController extends Controller
{
    public function crsf(Request $request)
    {
        return response()->json([
            'csrf_token' => csrf_token(),
        ])->withCookie(
            Cookie::make('XSRF-TOKEN', csrf_token(), 60)
        );
    }

    public function index()
    {
        $limit = min((int) request()->query('limit', 10), 100);
        $offset = (int) request()->query('offset', 0);
        $search = request()->query('search');
        $type = request()->query('type');

        $query = User::query();

        if (!empty($type)) {
            $query->where('role', $type);
        }

        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%");
        }

        $total = $query->count();
        $users = $query->skip($offset)->take($limit)->get();

        return response()->json([
            'status' => 'success',
            'data' => $users,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ], 200);
    }

    public function show($id)
    {
        try {
            $type = request()->query('type', 'customer');
            $user = User::with([
                'address',
                'wallet',
            ])->where('role', $type)->find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
            return response()->json(['status' => 'success', 'data' => $user], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'An error occurred while fetching user data', 'error' => $th->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        // $user->delete();
        $user->forceDelete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function forceDelete($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->forceDelete();
        return response()->json(['message' => 'User permanently deleted']);
    }

    public function changeUserStatus(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->is_active = $request->boolean('is_active');

        if ($user->is_active) {
            // Activate → verify email/phone if present
            if ($user->email && !$user->email_verified_at) {
                $user->email_verified_at = now();
            }

            if ($user->phone && !$user->phone_verified_at) {
                $user->phone_verified_at = now();
            }
        } else {
            $user->email_verified_at = null;
            $user->phone_verified_at = null;
        }

        $user->save();

        return response()->json([
            'message' => 'User status updated successfully',
            'data' => $user,
        ]);
    }



    public function userStats()
    {
        $type = request()->query('type');

        if (!$type) {
            return response()->json([
                'message' => 'Missing user type in query parameter.'
            ], 400);
        }

        $query = User::where('role', $type);

        return response()->json([
            'total_users' => $query->count(),
            'verified_users' => (clone $query)->whereNotNull('email_verified_at')->count(),
            'unverified_users' => (clone $query)->whereNull('email_verified_at')->count(),
        ]);
    }

    public function getUserGraphData()
    {
        $role = request()->query('role');
        $startDateInput = request()->query('start_date');
        $startDate = null;
        $endDate = null;

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Missing required query parameter: role.',
            ], 400);
        }

        try {
            // Use provided month or default to current month
            $parsedDate = $startDateInput
                ? Carbon::createFromFormat('F Y', "{$startDateInput} " . now()->year)
                : now();

            $startDate = $parsedDate->copy()->startOfMonth()->startOfDay();
            // $endDate = $parsedDate->copy()->endOfMonth()->endOfDay();
            $endDate = $parsedDate->now();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid month format. Use full month name like "June", "October".',
            ], 400);
        }

        $userData = User::where('role', $role)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $userData,
        ]);
    }
    public function getUserActivities()
    {
        $limit = min((int) request()->query('limit', 10), 100);
        $offset = (int) request()->query('offset', 0);
        $role = request()->query('role');

        if (!in_array($role, ['customer', 'vendor', 'admin'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or missing role. Valid roles are: customer, vendor, admin.',
            ], 400);
        }
        // Build base query with eager loaded user
        $query = UserActivity::with(['user:id,name,profile_photo'])
            ->whereHas('user', function ($q) use ($role) {
                $q->where('role', $role);
            })->latest();
        // Get total before pagination
        $total = $query->count();
        // Apply pagination
        $activities = $query->skip($offset)->take($limit)->get();

        return response()->json([
            'status' => 'success',
            'data' => $activities,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ]);
    }
    public function getActivityGraphData()
    {
        $role = request()->query('role');
        $startDateInput = request()->query('start_date');
        $startDate = null;
        $endDate = null;


        try {
            // Use provided month or default to current month
            $parsedDate = $startDateInput
                ? Carbon::createFromFormat('F Y', "{$startDateInput} " . now()->year)
                : now();

            $startDate = $parsedDate->copy()->startOfMonth()->startOfDay();
            $endDate = $parsedDate->now();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid month format. Use full month name like "June", "October".',
            ], 400);
        }

        $userData = UserActivity::where('role', $role)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $userData,
        ]);
    }
}
