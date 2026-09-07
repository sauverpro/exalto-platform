<?php

namespace App\Http\Controllers\api\category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class CategoryController extends Controller {
	public function GetAllCategories (Request $request) {
		$categories = Category::All();
		return response()->json(['status'=>true, 'message'=>'All Categories', 'data'=>$categories], 200);
	}

	// function to store category
	public function StoreCategory (Request $request) {
		// check if logged in user is admin
        $user = Auth::user();
        if($user->role !=="admin"){
            return response()->json(['status'=>false, 'message'=>'Unauthorized'],403);       
            
        }
		$validator = Validator::make($request->all(), [
			'name' => 'required|string|max:255',
		]);
		if ($validator->fails())
		{
			return response()->json(['status'=>false, 'message'=>'Validation Error', 'errors'=>$validator->errors()], 422);
		}
		$category = Category::create([
			'name' => $request->name,
			'slug' => \Str::slug($request->name, '-')
		]);
		return response()->json(['status'=>true, 'message'=>'Category created successfully', 'data'=>$category], 201);
	}
	// delete category and disable all products in that category
	public function DeleteCategory (Request $request, $id) {
		// check if logged in user is admin
        $user = Auth::user();
        if($user->role !=="admin"){
            return response()->json(['status'=>false, 'message'=>'Unauthorized'],403);       
            
        }
		$category = Category::find($id);
		if (!$category) {
			return response()->json(['status'=>false, 'message'=>'Category not found'], 404);
		}
		// disable all products in that category
		$category->products()->update(['status' => 'disabled']);
		$category->delete();
		return response()->json(['status'=>true, 'message'=>'Category deleted successfully'], 200);
	}
}

