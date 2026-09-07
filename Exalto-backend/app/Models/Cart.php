<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'status',
    ];

    public function user()
    {
        return $this->belongsTo('App\\Models\\User');
    }

    public function items()
    {
        return $this->hasMany('App\\Models\\CartItem');
    }

    public function total()
    {
        return $this->items->sum(function ($item) {
            return ($item->price ?? 0) * $item->quantity;
        });
    }
}

