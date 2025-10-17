<?php

namespace App\Http\Controllers\Administration;

use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use App\Http\Controllers\Controller;

class PaymentMethodsController extends Controller
{
    public function getPaymentMethods()
    {
        try {
            $methods = PaymentMethod::all();

            return response()->json([
                'status' => 'success',
                'payment_methods' => $methods
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve payment methods.',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
    public function createOrUpdatePaymentMethod(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'nullable|exists:payment_methods,id',
                'name' => 'required|string|max:100',
            ]);

            $method = PaymentMethod::updateOrCreate(
                isset($validated['id'])
                    ? ['id' => $validated['id']]
                    : ['name' => $validated['name']],
                [
                    'name' => $validated['name'],
                ]
            );

            return response()->json([
                'status' => 'success',
                'message' => isset($validated['id']) ? 'Payment method updated.' : 'Payment method created.',
                'data' => $method
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save payment method.',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function deletePaymentMethod($id)
    {
        try {
            PaymentMethod::where('id', $id)->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Payment method deleted successfully'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete payment method.',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
}
