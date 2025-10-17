<?php

namespace App\Http\Controllers\Authentication;

use App\Contracts\SmsSender;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SMSController extends Controller
{
    public function __construct(protected SmsSender $sms) {}

    public function send(Request $request)
    {
        $sid = $this->sms->send('+254113951376', 'Hello from The African Hub Marketplace!');
        return response()->json(['sid' => $sid]);
    }
}
