<x-mail::message>
    # Shipping Update for Order #{{ $order->id }}

    Hello {{ $order->customer->name }},

    We're happy to inform you that the shipping details for your order have been updated. Here is the latest
    information:

    @if ($order->shipping_status)
        **Shipping Status:** {{ ucfirst($order->shipping_status) }}
    @endif

    @if ($order->shipping_method)
        **Shipping Method:** {{ $order->shipping_method }}
    @endif

    @if ($order->tracking_number)
        **Tracking Number:** {{ $order->tracking_number }}
    @endif

    @if ($order->tracking_url)
        <x-mail::button :url="$order->tracking_url">
            Track Your Shipment
        </x-mail::button>
    @endif

    @if ($order->shipping_date)
        **Shipping Date:** {{ \Carbon\Carbon::parse($order->shipping_date)->toFormattedDateString() }}
    @endif

    @if ($order->delivery_date)
        **Estimated Delivery Date:** {{ \Carbon\Carbon::parse($order->delivery_date)->toFormattedDateString() }}
    @endif

    If you have any questions or concerns, feel free to reply to this email or contact our support team.

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>
