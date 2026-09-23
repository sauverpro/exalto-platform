<?php

namespace App\Models\cms;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    //
    protected $fillable =[
        
        'site_title',
        'site_logo',
        'primary_number',
        'other_numbers',
        'primary_email',
        'other_emails',
        'instagram',
        'facebook',
        'youtube',
        'tiktok',
        'address'   
    ];
    
}
