<?php

namespace App\Services;

use Illuminate\Support\Str;

class AvatarService
{ 
    public function createUserAvatar(string $name, string $lastName): string
    {
        $color = sprintf('#%06X', mt_rand(0, 0xFFFFFF));
        $initials = strtoupper(substr($name, 0, 1) . substr($lastName, 0, 1));
        $size = 200;

        $svg = <<<SVG
        <svg xmlns="http://www.w3.org/2000/svg" width="{$size}" height="{$size}" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="100" fill="{$color}" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="72" font-family="Arial, sans-serif">{$initials}</text>
        </svg>
        SVG;

        $avatarUrl = 'data:image/svg+xml;base64,' . base64_encode($svg);

        return $avatarUrl;
    }
}