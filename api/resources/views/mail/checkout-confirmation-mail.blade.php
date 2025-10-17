<x-mail::message>
# {{ $recipientType === 'vendor' ? 'New Order Received' : 'Order Confirmation' }}

Hello {{ $recipientType === 'vendor' 
    ? optional($order->items->first()->product->shop->vendor)->name 
    : $order->customer->name }},

Your order details are as follows:

**Order ID:** #{{ $order->id }}

**Total:** ${{ number_format($order->total, 2) }}

**Shipping Status:** {{ ucfirst($order->shipping_status) }}

@if($recipientType === 'vendor')
You have a new order to fulfill. Please prepare it for shipping as soon as possible.

@foreach($order->items as $item)
- **Product:** {{ $item->product->title }}
- **Quantity:** {{ $item->quantity }}
- **Price:** ${{ number_format($item->price, 2) }}
@endforeach

@else
Thank you for shopping with us! We'll notify you once your order is shipped.

@foreach($order->items as $item)
- **Product:** {{ $item->product->title }}
- **Quantity:** {{ $item->quantity }}
- **Price:** ${{ number_format($item->price, 2) }}
@endforeach

@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
