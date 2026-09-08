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
Route::get('/product/{slug}',[ProductController::class,'GetProductBySlug']);
// get product by id

// 0rders routes
Route::get('/orders',[App\Http\Controllers\api\order\OrderController::class,'index']);
Route::post('/order/store',[App\Http\Controllers\api\order\OrderController::class,'StoreOrder']);
Route::delete('/order/delete/{order_id}', [App\Http\Controller\api\order\OrderController::class, 'cancel']);

// address routes
Route::get('/addresses',[App\Http\Controllers\api\address\AddressController::class,'index']);
Route::post('/address/store',[App\Http\Controllers\api\address\AddressController::class,'storeAddress']);
Route::get('/address/{address_id}', [App\Http\Controllers\api\address\AddressController::class, 'ShowAdress']);
Route::delete('/address/delete/{address_id}', [App\Http\Controllers\api\address\AddressController::class, 'Destroy']);


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