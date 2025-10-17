<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */
    'resend' => [
        'key' => env('RESEND_KEY'),
    ],


    'easypost' => [
        'key' => env('EASYPOST_API_KEY'),
    ],

    'clik2pay' => [
        'api_token'   => env('CLIK2PAY_AUTH_URL', 'https://api-auth.sandbox.clik2pay.com/oauth2/token'),
        'base_url' => env('CLIK2PAY_BASE_URL', 'https://api.sandbox.clik2pay.com/open/v1'),
        'username'    => env('CLIK2PAY_API_USERNAME', '3lo3o7j5ed40ggnni0bb6c6h19'),
        'api_key'    => env('CLIK2PAY_API_KEY', '66d2Z8tr1T7Pnmykr0dLVth9ADMkhKwassJiKH00'),
        'password'    => env('CLIK2PAY_API_PASSWORD', '18l82k4od0b5sn9bhs3vjbnmm6h4am1mi0fb557ej7cef0id1hj8'),
    ],


    'twilio' => [
        'sid' => env('TWILIO_ACCOUNT_SID'),
        'token' => env('TWILIO_AUTH_TOKEN'),
        'from' => env('TWILIO_FROM'),
    ],

    'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URL'), // e.g. https://yourapp.com/auth/google/callback
],


];
