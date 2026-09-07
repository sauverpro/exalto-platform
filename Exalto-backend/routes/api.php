<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\authentication\AuthController;
use App\Http\Controllers\api\products\ProductController;

// Authentication routes
Route::post('/auth/register', [AuthController::class,"Register"]);
Route::post('/auth/login', [AuthController::class, "Login"]);

// End of authntication routes
// public routes
Route::get('/category/all',[App\Http\Controllers\api\category\CategoryController::class,'GetAllCategories']);
// get all products

Route::get('/products',[ProductController::class,'GetAllProductsActive']);
// get product by category id
Route::get('/product/category/{category_id}',[ProductController::class,'GetProductsByCategoryId']);
// get product by slug
Route::get('/product/slug/{slug}',[ProductController::class,'GetProductBySlug']);
// get product by id

// end of public routes
Route::middleware('auth:api')->group(function(){
Route::put('/auth/reset_password/{id}',[AuthController::class,'UpdatePassword']);
Route::post('/category/store',[App\Http\Controllers\api\category\CategoryController::class,'StoreCategory']);
Route::post('/product/store',[ProductController::class,'StoreProduct']);
Route::put('/product/update/{id}',[ProductController::class,'UpdateProduct']);
Route::delete('/product/delete/{id}',[ProductController::class,'DeleteProduct']);
// delete category and disable all products in that category
Route::delete('/category/delete/{id}',[App\Http\Controllers\api\category\CategoryController::class,'DeleteCategory']);
Route::get('/products/all',[ProductController::class,'GetAllProducts']);

});