<?php

namespace App\Http\Controllers\Administration;

use Illuminate\Http\Request;
use App\Models\ItemCommission;
use App\Http\Controllers\Controller;

class CommissionController extends Controller
{
    /**
     * Display all commission settings.
     */
    public function index()
    {
        $commissions = ItemCommission::all();
        return response()->json([
            'status' => 'success',
            'data' => $commissions
        ]);
    }

    /**
     * Store a new commission setting.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:product,service,withdrawal|unique:item_commissions,type',
            'rate' => 'required|numeric|min:0|max:100',
        ]);

        $commission = ItemCommission::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Commission created successfully.',
            'data' => $commission,
        ]);
    }

    /**
     * Display a single commission setting.
     */
    public function show(string $id)
    {
        $commission = ItemCommission::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $commission,
        ]);
    }

    /**
     * Update an existing commission rate.
     */
    public function update(Request $request, string $id)
    {
        $commission = ItemCommission::findOrFail($id);

        $validated = $request->validate([
            'rate' => 'sometimes|numeric|min:0|max:100',
            'type' => 'sometimes|in:product,service,withdrawal',
        ]);

        $commission->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Commission updated successfully.',
            'data' => $commission,
        ]);
    }

    /**
     * Delete a commission setting (optional for admin).
     */
    public function destroy(string $id)
    {
        $commission = ItemCommission::findOrFail($id);
        $commission->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Commission deleted successfully.',
        ]);
    }
}
