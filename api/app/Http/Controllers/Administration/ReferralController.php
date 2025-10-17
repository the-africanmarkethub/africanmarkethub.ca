<?php

namespace App\Http\Controllers\Administration;

use App\Models\Referral;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReferralController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Referral::with('referrer', 'referred')->get()]);
    } 

    public function destroy($id)
    {
        Referral::findOrFail($id)->delete();
        return response()->json(['status' => 'deleted']);
    }
}
