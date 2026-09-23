<?php

namespace App\Http\Controllers\api\cms;

use App\Http\Controllers\Controller;
use App\Models\cms\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::first();

        return response()->json([
            'status' => true,
            'message' => 'Settings fetched successfully',
            'data' => $settings,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if($user->role !== 'admin'){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized',
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'site_title' => 'nullable|string|max:255',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'primary_number' => 'nullable|string|max:255',
            'other_numbers' => 'nullable|string|max:255',
            'primary_email' => 'nullable|email|max:255',
            'other_emails' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->except('site_logo');

        if ($request->hasFile('site_logo') && $request->file('site_logo')->isValid()) {
            $logo = $request->file('site_logo');
            $logoName = time() . '_' . uniqid() . '.' . $logo->getClientOriginalExtension();

            if (!file_exists(public_path('images/logo'))) {
                mkdir(public_path('images/logo'), 0755, true);
            }

            $logo->move(public_path('images/logo'), $logoName);
            $data['site_logo'] = 'images/logo/' . $logoName;
        }

        $settings = Setting::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Settings created successfully',
            'data' => $settings,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        if($user->role !== 'admin'){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized',
            ], 403);
        }
        $settings = Setting::find($id);

        if (!$settings) {
            return response()->json([
                'status' => false,
                'message' => 'Settings not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'site_title' => 'sometimes|required|string|max:255',
            'site_logo' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'primary_number' => 'sometimes|nullable|string|max:255',
            'other_numbers' => 'sometimes|nullable|string|max:255',
            'primary_email' => 'sometimes|nullable|email|max:255',
            'other_emails' => 'sometimes|nullable|string|max:255',
            'instagram' => 'sometimes|nullable|string|max:255',
            'facebook' => 'sometimes|nullable|string|max:255',
            'youtube' => 'sometimes|nullable|string|max:255',
            'tiktok' => 'sometimes|nullable|string|max:255',
            'address' => 'sometimes|nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->except('site_logo');

        if ($request->hasFile('site_logo') && $request->file('site_logo')->isValid()) {
            $logo = $request->file('site_logo');
            $logoName = time() . '_' . uniqid() . '.' . $logo->getClientOriginalExtension();

            if (!file_exists(public_path('images/logo'))) {
                mkdir(public_path('images/logo'), 0755, true);
            }

            $logo->move(public_path('images/logo'), $logoName);
            $data['site_logo'] = 'images/logo/' . $logoName;
        }

        $settings->fill($data);
        $settings->save();

        return response()->json([
            'status' => true,
            'message' => 'Settings updated successfully',
            'data' => $settings,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $settings = Setting::find($id);

        if (!$settings) {
            return response()->json([
                'status' => false,
                'message' => 'Settings not found',
            ], 404);
        }

        $settings->delete();

        return response()->json([
            'status' => true,
            'message' => 'Settings deleted successfully',
        ], 200);
    }
}
