<?php

namespace App\Models;

use App\Models\Scopes\BranchIsolationScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Vehicle extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'branch_id',
        'vin',
        'make',
        'model',
        'year_of_manufacture',
        'engine_capacity_cc',
        'fuel_type',
        'transmission',
        'color',
        'mileage_km',
        'import_type',
        'status',
        'selling_price_tzs',
        'price_locked_by_user_id',
        'price_locked_at',
        'specifications',
        'media_gallery',
        'model_3d_asset_url',
    ];

    protected $casts = [
        'selling_price_tzs' => 'decimal:2',
        'year_of_manufacture' => 'integer',
        'engine_capacity_cc' => 'integer',
        'mileage_km' => 'integer',
        'price_locked_at' => 'datetime',
        'specifications' => 'array',
        'media_gallery' => 'array',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new BranchIsolationScope);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function priceLocker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'price_locked_by_user_id');
    }

    public function priceAuditLogs(): HasMany
    {
        return $this->hasMany(PriceAuditLog::class)->orderBy('recorded_at', 'desc');
    }

    public function foreignImport(): HasOne
    {
        return $this->hasOne(ForeignImport::class);
    }

    public function transfers(): HasMany
    {
        return $this->hasMany(InterBranchTransfer::class);
    }
}
