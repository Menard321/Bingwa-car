<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForeignImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomsTrackingController extends Controller
{
    /**
     * Public portal lookup: Sanitize and deliver clearance stages without revealing CIF acquisition margins.
     */
    public function publicTrack(string $code): JsonResponse
    {
        $import = ForeignImport::with(['vehicle.branch'])
            ->where('tracking_access_code', strtoupper(trim($code)))
            ->orWhere('bl_number', strtoupper(trim($code)))
            ->first();

        if (!$import) {
            return response()->json([
                'error' => 'No import consignment found matching that reference code.'
            ], 404);
        }

        return response()->json([
            'tracking_code' => $import->tracking_access_code,
            'bl_number' => $import->bl_number,
            'vehicle' => [
                'make' => $import->vehicle->make,
                'model' => $import->vehicle->model,
                'year' => $import->vehicle->year_of_manufacture,
                'destination_yard' => $import->vehicle->branch->name ?? 'Dar es Salaam Central Yard',
            ],
            'customs_stage' => $import->customs_stage,
            'country_of_origin' => $import->country_of_origin,
            'estimated_arrival_date' => $import->estimated_arrival_date,
            'actual_arrival_date' => $import->actual_arrival_date,
            'tra_assessment_issued' => !empty($import->tra_assessment_number),
            'last_updated' => $import->updated_at->toIso8601String(),
        ]);
    }

    /**
     * Update milestone progression (Customs Agent or Admin only).
     */
    public function updateStage(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'customs_stage' => 'required|in:ORDERED,SHIPPED,PORT_DAR,TRA_ASSESSMENT,TAX_PAID,TBS_CLEARED,YARD_DELIVERED',
            'tra_assessment_number' => 'nullable|string',
            'tra_duty_amount_tzs' => 'nullable|numeric',
        ]);

        $import = ForeignImport::findOrFail($id);
        $import->update($validated);

        return response()->json([
            'message' => 'TRA customs tracking stage updated successfully.',
            'import' => $import,
        ]);
    }
}

