<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForeignImport extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'vehicle_id',
        'country_of_origin',
        'supplier_name',
        'bl_number',
        'container_number',
        'tracking_access_code',
        'customs_stage',
        'tra_assessment_number',
        'tra_duty_amount_tzs',
        'estimated_arrival_date',
        'actual_arrival_date',
    ];

    protected $casts = [
        'tra_duty_amount_tzs' => 'decimal:2',
        'estimated_arrival_date' => 'date',
        'actual_arrival_date' => 'date',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}

