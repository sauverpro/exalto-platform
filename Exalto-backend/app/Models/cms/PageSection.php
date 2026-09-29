<?php

namespace App\Models\cms;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    //
    protected $fillable = ['title','type','page_id','content','status'];
    protected $casts = [
    'content' => 'array',
];

}
