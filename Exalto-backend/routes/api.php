<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\authentication\AuthController;
use App\Http\Controllers\api\products\ProductController;
use App\Http\Controllers\api\address\AddressController;
use App\Http\Controllers\api\category\CategoryController;
use App\Http\Controllers\api\order\OrderController;
use App\Http\Controllers\api\orderitem\OrderItemController;  
use App\Http\Controllers\api\payment\PaymentController;
use App\Http\Controllers\api\inventrory\InventoryController;
use App\Http\Controllers\api\inventrorytransaction\InventoryTransactionController;

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
Route::get('/navigation_link',[\App\Http\Controllers\api\cms\NavLinkController::class,'index']);
Route::get('/settings', [\App\Http\Controllers\api\cms\SettingController::class, 'index']);
Route::get('/pages/{slug}',[\App\Http\Controllers\api\cms\PageController::class,'byslug']);



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

    Route::get('/inventories', [InventoryController::class, 'index']);
    Route::get('/inventory/{id}', [InventoryController::class, 'show']);
    Route::post('/inventory/store', [InventoryController::class, 'store']);
    Route::put('/inventory/update/{id}', [InventoryController::class, 'update']);
    Route::delete('/inventory/delete/{id}', [InventoryController::class, 'destroy']);

    Route::get('/inventory-transactions', [InventoryTransactionController::class, 'index']);
    Route::get('/inventory-transaction/{id}', [InventoryTransactionController::class, 'show']);
    Route::post('/inventory-transaction/store', [InventoryTransactionController::class, 'store']);

    // Sales manager protected routes
    Route::put('/product/update/{id}', [ProductController::class, 'UpdateProduct']);
    Route::get('/products/manage', [ProductController::class, 'GetAllProducts']);
    Route::put('/order/status/{id}', [OrderController::class, 'updateStatus']);
    Route::put('/payment/admin/update/{id}', [PaymentController::class, 'adminUpdate']);
    
   // cms routes
   //setting routes
     
     Route::post('/settings/store', [\App\Http\Controllers\api\cms\SettingController::class, 'store']);
     Route::put('/settings/update/{id}', [\App\Http\Controllers\api\cms\SettingController::class, 'update']);
     Route::delete('/settings/delete/{id}', [\App\Http\Controllers\api\cms\SettingController::class, 'destroy']);
      // navigation link routes
      
      Route::post('/navigation_link',[\App\Http\Controllers\api\cms\NavLinkController::class,'store']);
      Route::put('/navigation_link/{id}',[\App\Http\Controllers\api\cms\NavLinkController::class,'update']);
      Route::delete('/navigation_link/{id}',[\App\Http\Controllers\api\cms\NavLinkController::class,'destroy']);

      // create and edit page
      Route::get('/pages',[\App\Http\Controllers\api\cms\PageController::class,'index']);
      Route::post('/pages',[\App\Http\Controllers\api\cms\PageController::class,'store']);
      Route::put('/pages/{id}',[\App\Http\Controllers\api\cms\PageController::class,'update']);
      Route::delete('/pages/{id}',[\App\Http\Controllers\api\cms\PageController::class,'destroy']);
    // page section
      //Route::get('/pages',[\App\Http\Controllers\api\cms\PageSectionController::class,'index']);
      Route::post('/pages/section/{id}',[\App\Http\Controllers\api\cms\PageSectionController::class,'store']);
      //Route::put('/pages/{id}',[\App\Http\Controllers\api\cms\PageSectionController::class,'update']);
      //Route::delete('/pages/{id}',[\App\Http\Controllers\api\cms\PageSectionController::class,'destroy']);
});