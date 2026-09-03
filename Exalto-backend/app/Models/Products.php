<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'price', 'description', 'is_features'];

    protected $casts = [
        'price' => 'decimal:2',
        'is_features' => 'boolean',
    ];

    // Get all categories associated with this product
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function inventory()
    {
        return $this->hasOne('App\\Models\\Inventory');
    }

    public function reviews()
    {
        return $this->hasMany('App\\Models\\Review');
    }

    public function cartItems()
    {
        return $this->hasMany('App\\Models\\CartItem');
    }
}

