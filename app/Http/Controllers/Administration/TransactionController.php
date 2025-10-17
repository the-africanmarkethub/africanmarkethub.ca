<?php

namespace App\Http\Controllers\Administration;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\SettlementAccount;
use App\Http\Controllers\Controller;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 20);
        $offset = $request->get('offset', 0);
        $search = $request->get('search');
        $type = $request->get('type');
        $status = $request->get('status');

        $query = Transaction::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%");
            });
        }

        if ($type) {
            $query->where('type', $type);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $total = $query->count();

        $transactions = $query->orderBy('created_at', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();

        // Attach settlement accounts and customer data
        foreach ($transactions as $transaction) {
            $transactionData = $transaction->transaction_data;

            // Attach settlement account
            $settlementAccount = null;
            if (!empty($transactionData['settlement_account_id'])) {
                $settlementAccount = SettlementAccount::find($transactionData['settlement_account_id']);
                if ($settlementAccount && isset($transactionData['vendor_id']) && $settlementAccount->user_id != $transactionData['vendor_id']) {
                    $settlementAccount = null;
                }
            }
            $transaction->settlement_account = $settlementAccount;

            // Attach customer (if product transaction)
            $customer = null;
            if ($transaction->type === 'product' && !empty($transactionData['customer_id'])) {
                $customer = User::find($transactionData['customer_id']);
            }
            $transaction->customer = $customer;
        }

        // Filtered summary (within current filters)
        $filteredQuery = clone $query;

        $statuses = ['pending', 'cancelled', 'completed', 'refunded', 'failed', 'approved', 'declined'];
        $types = ['product', 'subscription', 'withdrawal'];

        $statusSummary = [];
        foreach ($statuses as $s) {
            $statusSummary[$s] = (clone $filteredQuery)->where('status', $s)->count();
        }

        $typeSummary = [];
        foreach ($types as $t) {
            $typeSummary[$t] = (clone $filteredQuery)->where('type', $t)->count();
        }

        return response()->json([
            'message' => 'Transactions retrieved successfully.',
            'data' => $transactions,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
            'summary' => [
                'status' => $statusSummary,
                'type' => $typeSummary,
            ],
        ]);
    }
}
