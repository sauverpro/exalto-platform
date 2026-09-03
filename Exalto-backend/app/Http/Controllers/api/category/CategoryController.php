<?php

namespace App\Http\Controllers\api\category;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
	/**
	 * Display a listing of categories.
	 */
	public function index(Request $request)
	{
		$perPage = (int) $request->query('per_page', 15);

		$query = Category::query()->with('children');

		if ($search = $request->query('q')) {
			$query->where('name', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%");
		}

		if ($parent = $request->query('parent_id')) {
			$query->where('parent_id', $parent);
		}

		$categories = $query->paginate(max(1, $perPage));

		return response()->json(['success' => true, 'data' => $categories]);
	}

	/**
	 * Store a newly created category.
	 */
	public function store(Request $request)
	{
		$v = Validator::make($request->all(), [
			'name' => 'required|string|max:191',
			'slug' => 'nullable|string|max:191|unique:categories,slug',
			'description' => 'nullable|string',
			'parent_id' => 'nullable|exists:categories,id',
		]);

		if ($v->fails()) {
			return response()->json(['success' => false, 'errors' => $v->errors()], 422);
		}

		$data = $v->validated();
		if (empty($data['slug'])) {
			$data['slug'] = str()->slug($data['name']);
		}

		$category = Category::create($data);

		return response()->json(['success' => true, 'data' => $category], 201);
	}

	/**
	 * Display the specified category.
	 */
	public function show(Category $category)
	{
		$category->load('children', 'allChildren', 'products');
		return response()->json(['success' => true, 'data' => $category]);
	}

	/**
	 * Update the specified category.
	 */
	public function update(Request $request, Category $category)
	{
		$v = Validator::make($request->all(), [
			'name' => 'sometimes|required|string|max:191',
			'slug' => "nullable|string|max:191|unique:categories,slug,{$category->id}",
			'description' => 'nullable|string',
			'parent_id' => 'nullable|exists:categories,id',
		]);

		if ($v->fails()) {
			return response()->json(['success' => false, 'errors' => $v->errors()], 422);
		}

		$data = $v->validated();
		if (array_key_exists('name', $data) && empty($data['slug'])) {
			$data['slug'] = str()->slug($data['name']);
		}

		$category->update($data);

		return response()->json(['success' => true, 'data' => $category]);
	}

	/**
	 * Remove the specified category.
	 */
	public function destroy(Category $category)
	{
		$category->delete();
		return response()->json(['success' => true, 'message' => 'Category deleted']);
	}

	/**
	 * List products for a category.
	 */
	public function products(Request $request, Category $category)
	{
		$perPage = (int) $request->query('per_page', 15);
		$products = $category->products()->paginate(max(1, $perPage));
		return response()->json(['success' => true, 'data' => $products]);
	}
}

