<?php

namespace App\Models\cms;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    //
    protected $fillable = ['name','slug','status'];

    // has many page sections

  public function sections()
{
    return $this->hasMany(PageSection::class);
}
}
