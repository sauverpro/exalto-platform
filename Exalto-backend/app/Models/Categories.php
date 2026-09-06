<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    // get parent category
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // get child subcategory
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // load all related subcategory
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    // get product from a specific category
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
