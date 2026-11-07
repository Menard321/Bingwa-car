<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code',
        'name',
        'city',
        'location_description',
        'gps_latitude',
        'gps_longitude',
        'is_active',
    ];

    protected $casts = [
        'gps_latitude' => 'decimal:8',
        'gps_longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}

