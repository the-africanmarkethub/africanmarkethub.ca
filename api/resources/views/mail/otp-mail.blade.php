<x-mail::message>
# Hello {{ $user->name }},

Please use the following confirmation code to verify your email:

<x-mail::panel>
    <p style="font-size: 1.2em; font-weight: bold; text-align: center; background-color: #007bff; color: white; padding: 0.5em 1em; border-radius: 0.25em; display: inline-block;">
        {{ $otp }}
    </p>
</x-mail::panel>

If you did not request this code, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>