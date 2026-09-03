<?php

namespace App\Http\Controllers\api\authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function Register(Request $request) {
        // validating inputs
        $validation = Validator::make($request->all(),[
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone_number' => 'required|numeric|min:10|unique:users',
        ]);

        if($validation->fails()) {
            return response()->json([
                "message" => $validation->errors()
            ],422);
        }

        // registration
        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
        ]);
        return response()->json([
            "message" => "User registered successfully"
        ]);
    }

    public function Login(Request $request) {
        // validations check
        $validation = Validator::make($request->all(),[
          'email' => 'required|string|email|max:255',
          'password' => 'required|string|min:8',  
        ]);

         if($validation->fails()) {
            return response()->json([
                "message" => $validation->errors()
            ],422);
        }

        // login 
        $credentials = $request->only('email', 'password');
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
        return response()->json([
            "message" => "login successfully",
            "token" => $token
            ]);
    }

    public function UpdatePassword($id, Request $request) {
        // validations
        $validation = Validator::make($request->all(),[
            'password' => 'required|string|min:8',
            'current_password' => 'required',
        ]);

        if($validation->fails()) {
            return response()->json([
                "message" => $validation->errors()
            ],422);
        }

        // update password
        $user = User::find($id);
        if(!$user) {
            return response()->json([
                "message" => "User not found"
            ],404);
        }
        // check current password
        if(!Hash::check($request->get("current_password"),$user->password)) {
            return response()->json([
                "message" => "Current password is incorrect"
            ],401);
        }

        // check if the new password is same as current password
         if(Hash::check($request->get("password"),$user->password)) {
            return response()->json([
                "message" => "New password can't be same as current password"
            ],401);
        }
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json([
            "message" => "Password updated successfully"
        ]);
    }
}
