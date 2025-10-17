<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administration\UserController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/login', function () {
    return response()->json([
        'message' => 'Unauthenticated. Please log in to continue.'
        
    ], 401);
})->name('login');

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});