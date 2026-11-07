<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceAuditLog extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'vehicle_id',
        'changed_by_user_id',
        'previous_price_tzs',
        'new_price_tzs',
        'change_reason',
        'recorded_at',
    ];

    protected $casts = [
        'previous_price_tzs' => 'decimal:2',
        'new_price_tzs' => 'decimal:2',
        'recorded_at' => 'datetime',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}

