<x-mail::message>
# Hi {{ $user->name }},

Welcome to {{ config('app.name') }}! We are thrilled to have you as part of our community.

At {{ config('app.name') }}, we bring together talented artisans and creative minds, offering a platform to explore unique creations and connect with others who share your passion for creativity. Whether you're looking to create, collaborate, or find inspiration, {{ config('app.name') }} is here to help you turn your ideas into reality.

We encourage you to explore our offerings, connect with artisans, and discover the endless possibilities that await you. Your creative journey starts now, and we’re here to support you every step of the way.

Should you need any assistance or have questions, feel free to reach out to our support team at any time.

Thank you for joining {{ config('app.name') }}. We can't wait to see where your creativity takes you!

<x-mail::button :url="'https://africanmarkethub.com'">
    Continue your journey
</x-mail::button>

<br>
{{ config('app.name') }}
</x-mail::message>