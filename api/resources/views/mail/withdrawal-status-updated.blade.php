<x-mail::message>
# Dear {{ $user->name }},

Your withdrawal request of <strong>$ {{ number_format($withdrawal->amount, 2) }}</strong> 
    has been <strong>{{ ucfirst($withdrawal->status) }}</strong>.
 
Thank you for using our platform,<br>
{{ config('app.name') }}
</x-mail::message>
