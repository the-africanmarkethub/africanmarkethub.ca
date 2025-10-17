<x-mail::message>
# Notification

{{ $body }}

@if($image)
![Notification Image]({{ $image }})
@endif

@if($cta)
<x-mail::button :url="$cta">
View Notification
</x-mail::button>
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
