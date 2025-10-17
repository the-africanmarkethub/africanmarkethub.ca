<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function webhook(Request $request)
    {
        // Grab payload from Clik2Pay
        $data = $request->all();

        // Example: identify order by your own reference
        $order = Order::find($data['orderId'] ?? null);

        if ($order) {
            $status = $data['status'] ?? null;

            if ($status === 'SUCCESS') {
                $order->update(['payment_status' => 'paid']);
            } elseif ($status === 'FAILED') {
                $order->update(['payment_status' => 'failed']);
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
