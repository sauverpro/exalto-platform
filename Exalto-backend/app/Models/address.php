<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'full_name', 'phone_number', 'district', 'sector', 'street', 'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo('App\\Models\\User');
    }

    public function orders()
    {
        return $this->hasMany('App\\Models\\Orders');
    }

    public function shipments()
    {
        return $this->hasMany('App\\Models\\Shipment');
    }
}

