<x-mail::message>
# Welcome to African Hub Marketplace 🎉

Hello {{ $admin->name }},

You’ve been invited to join **African Hub Marketplace** as a **{{ ucfirst($admin->role) }}** by **{{ $invitee }}**.

Your account has been created with a default password. For your security, please log in and change your password immediately.


Email Address: **{{ $admin->email }}**

Temporary Password: **{{ $plainPassword }}**


<x-mail::button :url="url('/login')">
Login to Admin Portal
</x-mail::button>

We’re excited to have you on board and look forward to the value you’ll bring to the team. If you have any questions, feel free to reach out.

Thanks and welcome again,<br>
{{ config('app.name') }} Team
</x-mail::message>
