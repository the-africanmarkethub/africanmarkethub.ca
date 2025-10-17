<?php

namespace App\Contracts;

interface SmsSender
{
    public function send(string $to, string $message, array $options = []): string;
}
