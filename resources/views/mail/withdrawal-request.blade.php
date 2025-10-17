<x-mail::message>
@if($recipientType === 'vendor')
# Withdrawal Request Received

Hello {{ $vendor->name }},

We’ve received your withdrawal request of **${{ $amount }}**.
Our finance team will review it shortly, and you’ll be notified once the payout is processed.

<x-mail::button :url="''">
    View My Wallet
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}

@else
# New Vendor Withdrawal Request

Admin,

<strong>{{ $vendor->name }}</strong> has requested a withdrawal of <strong>${{ $amount }}</strong>.

Please log in to the admin dashboard to review and take action.

<x-mail::button :url="config('app.url') . '/admin/withdrawals'">
    Review Withdrawal
</x-mail::button>

Thanks,<br>
System Notification
@endif
</x-mail::message>