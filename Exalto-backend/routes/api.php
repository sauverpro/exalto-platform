<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\authentication\AuthController;
use App\Http\Controllers\api\products\ProductController;
use App\Http\Controllers\api\address\AddressController;
use App\Http\Controllers\api\category\CategoryController;
use App\Http\Controllers\api\order\OrderController;
use App\Http\Controllers\api\orderitem\OrderItemController;  
use App\Http\Controllers\api\payment\PaymentController;

// Authentication routes
Route::post('/auth/register', [AuthController::class, 'Register']);
Route::post('/auth/login', [AuthController::class, 'Login']);

// Public ecommerce routes
Route::get('/category/all', [CategoryController::class, 'GetAllCategories']);
Route::get('/products', [ProductController::class, 'GetAllProductsActive']);
Route::get('/product/category/{category_id}', [ProductController::class, 'GetProductsByCategoryId']);
Route::get('/product/{slug}', [ProductController::class, 'GetProductBySlug']);

// Guest checkout routes: in an ecommerce flow, guests can create addresses, place orders, and pay.
Route::post('/address/store', [AddressController::class, 'storeAddress']);
Route::post('/order/store', [OrderController::class, 'StoreOrder']);
Route::get('/order/{id}', [OrderController::class, 'show']);
Route::delete('/order/delete/{id}', [OrderController::class, 'cancel']);
Route::post('/payment/store', [PaymentController::class, 'store']);

Route::get('/orderitems', [OrderItemController::class, 'index']);
Route::post('/orderitem/store', [OrderItemController::class, 'store']);
Route::get('/orderitem/{id}', [OrderItemController::class, 'show']);
Route::put('/orderitem/update/{id}', [OrderItemController::class, 'update']);
Route::delete('/orderitem/delete/{id}', [OrderItemController::class, 'destroy']);

Route::middleware('auth:api')->group(function () {
    // Client protected routes
    Route::put('/auth/reset_password/{id}', [AuthController::class, 'UpdatePassword']);
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::get('/address/{id}', [AddressController::class, 'ShowAddress']);
    Route::put('/address/update/{id}', [AddressController::class, 'Update']);
    Route::delete('/address/delete/{id}', [AddressController::class, 'Destroy']);
    Route::put('/address/default/{id}', [AddressController::class, 'setDefault']);

    Route::get('/orders', [OrderController::class, 'index']);
    
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payment/{id}', [PaymentController::class, 'show']);
    Route::put('/payment/update/{id}', [PaymentController::class, 'update']);
    Route::delete('/payment/delete/{id}', [PaymentController::class, 'destroy']);
    Route::get('/payment/verify/{id}', [PaymentController::class, 'verify']);


    // Admin protected routes
    Route::post('/admin/create-sales-manager', [AuthController::class, 'createStaffUser']);
    Route::post('/category/store', [CategoryController::class, 'StoreCategory']);
    Route::delete('/category/delete/{id}', [CategoryController::class, 'DeleteCategory']);
    Route::post('/product/store', [ProductController::class, 'StoreProduct']);
    Route::delete('/product/delete/{id}', [ProductController::class, 'DeleteProduct']);
    Route::get('/products/all', [ProductController::class, 'GetAllProducts']);
    Route::get('/payments/admin', [PaymentController::class, 'adminIndex']);
    Route::put('/payment/admin/update/{id}', [PaymentController::class, 'adminUpdate']);

    // Sales manager protected routes
    Route::put('/product/update/{id}', [ProductController::class, 'UpdateProduct']);
    Route::get('/products/manage', [ProductController::class, 'GetAllProducts']);
    Route::put('/order/status/{id}', [OrderController::class, 'updateStatus']);
    Route::put('/payment/admin/update/{id}', [PaymentController::class, 'adminUpdate']);
});