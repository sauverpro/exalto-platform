<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\authentication\AuthController;

// Authentication routes
Route::post('/auth/register', [AuthController::class,"Register"]);
Route::post('/auth/login', [AuthController::class, "Login"]);

// End of authntication routes

Route::middleware('auth:api')->group(function(){
Route::put('/auth/reset_password/{id}',[AuthController::class,'UpdatePassword']);
});