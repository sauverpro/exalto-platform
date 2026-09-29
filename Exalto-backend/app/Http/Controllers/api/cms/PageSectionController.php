<?php

namespace App\Http\Controllers\api\cms;

use App\Http\Controllers\Controller;
use App\Models\cms\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PageSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    // public function store(Request $request,$id)
    // {
    //     //
    //       $user = Auth::user();
    //     if($user->role !== 'admin'){
    //     return response()->json([
    //         'status'=>false,
    //         'message'=> 'unauthorized!'
    //     ],403);
    //     }
    //     // get page on which we are creating it's sections
    //     $getpage = Page::find($id);
    //     if(! $getpage){
    //         return response()->json(['status' =>false,'message'=>'Page not found'],404);
    //     }
    //     $validator = Validator::make($request->all(),[
    //         'title'=>'required',
    //         'content' => 'required'
    //     ]);
    //     if($validator->fails()){
    //         return response()->json(['status'=>false,
    //         'errors' => $validator->errors(),],400);
    //     }
    // }
public function store(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'status' => false,
                'message' => 'Page not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'array'],
            'type'=>['required','string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $section = $page->sections()->create($validator->validated());

        return response()->json([
            'status' => true,
            'message' => 'Page section created.',
            'data' => $section,
        ], 201);
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
