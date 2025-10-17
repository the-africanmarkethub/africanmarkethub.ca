<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{

    public function recommendedProducts()
    {
        // check if user is authenticated, and return his preference as recommended products else, return latest products
        $user = Auth::user();
        $preference = $user->preference;
        $products = Product::where('category_id', $preference->category_id)->get();
        if ($products->isEmpty()) {
            return response()->json(['status' => 'success', 'message' => 'No recommended products found', 'data' => []], 404);
        }
        return response()->json(['status' => 'success', 'message' => 'Recommended products found', 'data' => $products], 200);
    }
}
