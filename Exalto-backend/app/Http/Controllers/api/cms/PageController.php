<?php

namespace App\Http\Controllers\api\cms;

use App\Http\Controllers\Controller;
use App\Models\cms\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $navs = Page::all();
        return response()->json(['status'=>true,'data'=>$navs],200);
    }
    public function byslug($slug){

        $page = Page::with('sections')->where('slug', $slug)->first();
        if (!$page) {
            return response()->json([
                'status' => false,
                'message' => 'Page not found.',
            ], 404);
        }

        return response()->json(['status'=>true,'data'=>$page],200);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
         $user = Auth::user();
        if($user->role !== 'admin'){
        return response()->json([
            'status'=>false,
            'message'=> 'unauthorized!'
        ],403);
        }
        // create link

        $validation = Validator::make($request->all(),[
            'name'=>'required|string',
            'slug'=>'required'
        ]);
        if($validation->fails()){
            return response()->json(['status'=>false,
            'errors' => $validation->errors(),],400);
        }
        $data = $request->all();
        $created = Page::create($data);
         if($created){
            return response()->json(['status'=>true, 'message'=>'created successfully','data'=>$created],200);
        }
        else{
            return response()->json(['status'=>false,'message'=>'something went wrong'],500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
          $user = Auth::user();
        if($user->role !== 'admin'){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized',
            ], 403);
        }
        $nav = Page::find($id);
        if (!$nav) {
            # code...
            return response()->json(['status'=>false, 'message'=>'Not found'],404);
        }

        $data = $request->all();
        if ($nav->update($data)) {
            # code...
            return response()->json(['status'=>true,'message'=>'updated!'],200);
        }
        else{
            return response()->json(['status'=>false,'message'=>'not updated!'],500);
        }
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
         $user = Auth::user();
        if($user->role !== 'admin'){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized',
            ], 403);
        }
        $nav = Page::find($id);
        if (!$nav) {
            # code...
            return response()->json(['status'=>false, 'message'=>'Not found'],404);
        }
        if($nav->delete($id)){
            return response()->json(['status'=>true,'message'=>'deleted'],200);
        }
        else{
            return response()->json(['status'=>false,'message'=>'something went wrong'],500);
        }
    
    }
}
