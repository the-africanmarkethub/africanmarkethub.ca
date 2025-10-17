<?php

namespace App\Http\Controllers\Vendor;

use App\Models\Withdrawal;
use App\Models\AdminWallet;
use App\Models\Transaction;
use Illuminate\Support\Str;

use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Models\ItemCommission;
use App\Mail\WithdrawalRequest;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\WithdrawalStatusUpdated;
use App\Models\SettlementAccount;

class WithdrawalController extends Controller
{
    /**
     * Request a Withdrawal
     */

    public function requestWithdrawal(Request $request, ActivityLogger $activityLogger)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:10',
            ]);

            $vendor = Auth::user();
            $vendorId = $vendor->id;

            // Check if vendor has enough balance
            $availableBalance = $vendor->wallet->available_to_withdraw;
            if ($validated['amount'] > $availableBalance) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Insufficient balance'
                ], 400);
            }

            // Ensure settlement account exists
            $account = $vendor->settlementAccount;
            if (!$account) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No settlement account found. Please add a payout account first.'
                ], 404);
            }

            // Create withdrawal request
            $withdrawal = Withdrawal::create([
                'vendor_id' => $vendorId,
                'amount' => $validated['amount'],
                'settlement_account_id' => $account->id,
                'status' => 'pending'
            ]);

            // Send email to vendor
            Mail::to($vendor->email)->send(new WithdrawalRequest('vendor', $vendor, $validated['amount']));

            // Send email to admin (using configured admin email or fallback)
            $adminEmail = config('mail.admin_email', 'biormarcus@gmail.com');
            Mail::to($adminEmail)->send(new WithdrawalRequest('admin', $vendor, $validated['amount']));

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor requested withdrawal successfully', Auth::user(), $deviceInfo);

            return response()->json([
                'status' => 'success',
                'message' => 'Withdrawal request submitted successfully',
                'data' => $withdrawal
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while processing your request: ' . $th->getMessage()
            ], 500);
        }
    }


    /**
     * Get Withdrawal History
     */
    public function getWithdrawalHistory()
    {
        $vendorId = Auth::id();

        $withdrawals = Withdrawal::where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $withdrawals
        ]);
    }

    // Admin functions
    public function getPayoutRequests()
    {
        $limit = request()->query('limit', 15);
        $offset = request()->query('offset', 0);
        $search = request()->query('search');

        // Build base withdrawal query
        $baseQuery = Withdrawal::with('vendor', 'settlementAccount')
            ->when($search, function ($query, $search) {
                $query->whereHas('vendor', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            });

        // Get paginated data
        $withdrawals = (clone $baseQuery)
            ->orderByDesc('created_at')
            ->offset($offset)
            ->limit($limit)
            ->get();

        // Total count (with same search scope)
        $total = (clone $baseQuery)->count();

        // Stats
        $totalPaidOut = (clone $baseQuery)
            ->where('status', 'approved')
            ->sum('amount');

        $pendingPayoutTotal = (clone $baseQuery)
            ->where('status', 'pending')
            ->sum('amount');

        return response()->json([
            'status' => 'success',
            'data' => $withdrawals,
            'summary' => [
                'total_payout' => $totalPaidOut,
                'pending_payout' => $pendingPayoutTotal,
            ],
            'total' => $total,
            'offset' => (int) $offset,
            'limit' => (int) $limit,
        ]);
    }

    public function updateWithdrawalStatus($id, $status)
    {
        $allowedStatuses = ['approved', 'declined', 'pending'];

        if (!in_array($status, $allowedStatuses)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid status provided.'
            ], 400);
        }

        $withdrawal = Withdrawal::find($id);

        if (!$withdrawal) {
            return response()->json([
                'status' => 'error',
                'message' => 'Withdrawal request not found.'
            ], 404);
        }

        try {
            DB::transaction(function () use ($withdrawal, $status) {
                $user = $withdrawal->vendor;

                // Send email if approved
                if ($status === 'approved' && $user && $user->email) {
                    Mail::to($user->email)->send(new WithdrawalStatusUpdated($user, $withdrawal));
                }

                $reference = Str::upper(Str::slug("AFRMARHUB|" . $user->id . "|" . now()->format('YmdHis')));

                $originalAmount = $withdrawal->amount;
                $commissionAmount = 0;

                // Apply commission
                $commission = ItemCommission::where('type', 'withdrawal')->first();
                if ($commission) {
                    $commissionAmount = $originalAmount * ($commission->rate / 100);
                    $withdrawal->amount = $originalAmount - $commissionAmount;
                }

                // Log transaction
                $transaction = Transaction::create([
                    'reference' => $reference,
                    'sender_id' => Auth::id(),
                    'receiver_id' => $user->id,
                    'amount' => $withdrawal->amount,
                    'status' => $status,
                    'type' => 'withdrawal',
                    'description' => "{$user->name}, your withdrawal request is now " . ucfirst($status) . ".",
                    'transaction_data' => $withdrawal->toArray(),
                ]);

                // Add commission to AdminWallet
                if ($commission) {
                    AdminWallet::create([
                        'amount' => $commissionAmount,
                        'source' => 'withdrawal',
                        'transaction_id' => $transaction->id,
                        'reference' => $reference,
                    ]);
                }

                $withdrawal->status = $status;
                $withdrawal->save();
            });

            return response()->json([
                'status' => 'success',
                'message' => "Withdrawal status updated to '{$status}' and transaction recorded."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong. ' . $e->getMessage()
            ], 500);
        }
    }

    public function commissionRevenue(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);

        $query = AdminWallet::with('transaction')->orderBy('created_at', 'desc');

        $total = $query->count();

        $wallets = $query->skip($offset)
            ->take($limit)
            ->get(['id', 'amount', 'source', 'reference', 'transaction_id', 'created_at']);

        $sumAmount = $wallets->sum('amount');

        return response()->json([
            'status' => 'success',
            'total_revenue' => $sumAmount,
            'limit' => $limit,
            'offset' => $offset,
            'total' => $total,
            'data' => $wallets,
        ]);
    }

    public function getsettlementAccounts(Request $request)
    {
        $limit = $request->get('limit', 20);
        $offset = $request->get('offset', 0);
        $search = $request->get('search');

        $query = SettlementAccount::with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('account_number', 'like', "%$search%")
                    ->orWhere('account_name', 'like', "%$search%");
            });
        }

        $total = $query->count();

        $accounts = $query->latest()
            ->skip($offset)
            ->take($limit)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $accounts,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ]);
    }
}
