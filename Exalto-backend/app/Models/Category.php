<?php

namespace App\Http\Controllers\api\products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // store product with category id
    public function StoreProduct(Request $request)
    {
        // check if authenticated user is admin
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);
        // check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'Validation Error', 'errors' => $validator->errors()], 422);
        }
         // Check if image file exists and is valid
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Generate unique filename
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            
            // Store image in public/images/products folder
            // check if path exists, if not create it
            if (!file_exists(public_path('images/products'))) {
                mkdir(public_path('images/products'), 0755, true);
            }
            $image->move(public_path('images/products'), $imageName);
            
            // Store image path in database (with full path or just filename)
            $imagePath = 'images/products/' . $imageName; 
            
        } else {
            return response()->json([
                'status' => false, 
                'message' => 'Image upload failed. Please provide a valid image file.'
            ], 422);
        }
        

        $product = \App\Models\Product::create([
            'name' => $request->name,
            'slug' => \Str::slug($request->name, '-'),
            'price' => $request->price,
            'description' => $request->description,
            'image' => $imagePath,
            'category_id' => $request->category_id,
            'status' => $request->status ?? 'active', // default to 'active' if not provided
            'is_featured' => $request->is_featured ?? false, // default to false if not provided
        ]);
        return response()->json(['status' => true, 'message' => 'Product created successfully', 'data' => $product], 201);
    }

    // update product with category id
    public function UpdateProduct(Request $request, $id)
    {
        // check if authenticated user is admin
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }
        $product = \App\Models\Product::find($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'description' => 'sometimes|required|string',
            'image' => 'sometimes|required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);
        // check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'Validation Error', 'errors' => $validator->errors()], 422);
        }
        // check if image file is select then update product with new image
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Generate unique filename
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/products'), $imageName);
            $imagePath = 'images/products/' . $imageName;
        } else {
            // keep existing image if no new image is uploaded
            $imagePath = $product->image; 
        }
        $slug = $request->name ? \Str::slug($request->name, '-') : $product->slug;
        $product->image = $imagePath;
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;
        $product->category_id = $request->category_id;
        $product->slug = $slug;
        $product->status = $request->status ?? $product->status;
        $product->is_featured = $request->is_featured ?? $product->is_featured;
        if ($product->save()) {
            

        return response()->json(['status' => true, 'message' => 'Product updated successfully', 'data' => $product], 200);
        }
        else{
            return response()->json(['status' => false, 'message' => 'Product update failed'], 500);
        }
    
    }
// delete product with category id
    public function DeleteProduct($id)
    {
        // check if authenticated user is admin
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }
        $product = \App\Models\Product::find($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found'], 404);
        }
        if ($product->delete()) {
            return response()->json(['status' => true, 'message' => 'Product deleted successfully'], 200);
        } else {
            return response()->json(['status' => false, 'message' => 'Product delete failed'], 500);
        }
    }
    // get all products
    public function GetAllProducts()
    {
        // check if logged in user is admin
        $user = Auth::user();
        if($user->role !=="admin"){
            return response()->json(['status'=>false, 'message'=>'Unauthorized'],403);       
            
        }
        $products = \App\Models\Product::all();
        return response()->json(['status' => true, 'message' => 'All Products', 'data' => $products], 200);
    }
    // get product by category id
    public function GetProductsByCategoryId($category_id)
    {
        $products = \App\Models\Product::where('category_id', $category_id)->get();
        return response()->json(['status' => true, 'message' => 'Products by Category ID', 'data' => $products], 200);
    }
    // get product by slug
    public function GetProductBySlug($slug)
    {
        $product = \App\Models\Product::where('slug', $slug)->first();
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found'], 404);
        }
        return response()->json(['status' => true, 'message' => 'Product by Slug', 'data' => $product], 200);
    }
    // get all active products
    public function GetAllProductsActive(){
        $products = \App\Models\Product::where('status','active')->get();
        return response()->json([
            'status'=> true,
            'data'=> $products
        ]);
    }

}
