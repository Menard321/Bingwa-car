<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Phase 4.4: TRA Customs & Foreign Import Pipeline API Controller
 * - Secure clearing agent milestone updates
 * - Public sanitized token lookup endpoint (GET /api/v1/public/tracking/{token})
 */
final class CustomsPipelineController
{
    private const ALLOWED_STAGES = [
        'ORDERED',
        'SHIPPED',
        'PORT_DAR',
        'TRA_ASSESSMENT',
        'TAX_PAID',
        'TBS_CLEARED',
        'YARD_DELIVERED',
    ];

    /**
     * Secure endpoint for Customs Clearing Agents & Executive Owner to advance shipment milestones.
     */
    public function updateMilestone(Request $request, string $importId): JsonResponse
    {
        $user = $request->user();
        if (! $user || ! in_array($user->role, ['owner', 'customs_agent', 'branch_manager'], true)) {
            return response()->json([
                'error' => 'FORBIDDEN_CUSTOMS_OPERATION',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'customs_stage' => ['required', 'string', 'in:' . implode(',', self::ALLOWED_STAGES)],
            'bl_number' => ['nullable', 'string', 'max:64'],
            'container_number' => ['nullable', 'string', 'max:64'],
            'tra_assessment_number' => ['nullable', 'string', 'max:64'],
            'tra_duty_amount' => ['nullable', 'integer', 'min:0'],
            'eta_dates' => ['nullable', 'array'],
        ]);

        DB::table('foreign_imports')->where('id', $importId)->update(array_filter([
            'customs_stage' => $validated['customs_stage'],
            'bl_number' => $validated['bl_number'] ?? null,
            'container_number' => $validated['container_number'] ?? null,
            'tra_assessment_number' => $validated['tra_assessment_number'] ?? null,
            'tra_duty_amount' => $validated['tra_duty_amount'] ?? null,
            'eta_dates' => isset($validated['eta_dates']) ? json_encode($validated['eta_dates']) : null,
            'updated_at' => now(),
        ], static fn ($v) => $v !== null));

        return response()->json([
            'status' => 'CUSTOMS_MILESTONE_UPDATED',
            'import_id' => $importId,
            'customs_stage' => $validated['customs_stage'],
        ]);
    }

    /**
     * Public Token Lookup Endpoint: GET /api/v1/public/tracking/{token}
     * Strictly sanitizes and excludes wholesale_fob_acquisition_tzs, internal margins, and broker contacts.
     */
    public function publicTrackingLookup(string $token): JsonResponse
    {
        $record = DB::table('foreign_imports')
            ->join('vehicles', 'foreign_imports.vehicle_id', '=', 'vehicles.id')
            ->join('branches', 'vehicles.branch_id', '=', 'branches.id')
            ->select([
                'foreign_imports.origin_country',
                'foreign_imports.bl_number',
                'foreign_imports.container_number',
                'foreign_imports.customs_stage',
                'foreign_imports.tra_assessment_number',
                'foreign_imports.eta_dates',
                'foreign_imports.updated_at',
                'vehicles.vin',
                'vehicles.make',
                'vehicles.model',
                'vehicles.year',
                'vehicles.selling_price_tzs',
                'branches.name as destination_branch_name',
            ])
            ->where('foreign_imports.tracking_access_token', $token)
            ->first();

        if (! $record) {
            return response()->json([
                'error' => 'TRACKING_TOKEN_NOT_FOUND',
                'message_sw' => 'Tokeni ya ufuatiliaji haijapatikana.',
                'message_en' => 'Tracking token not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'tracking_verified' => true,
            'currency' => 'TZS',
            'shipment' => [
                'vin' => $record->vin,
                'vehicle' => "{$record->year} {$record->make} {$record->model}",
                'origin_country' => $record->origin_country,
                'bl_number' => $record->bl_number,
                'container_number' => $record->container_number,
                'customs_stage' => $record->customs_stage,
                'tra_assessment_number' => $record->tra_assessment_number,
                'owner_locked_selling_price_tzs' => (int) $record->selling_price_tzs,
                'destination_branch' => $record->destination_branch_name,
                'eta_dates' => json_decode((string) $record->eta_dates, true),
                'last_updated_eat' => $record->updated_at,
            ],
        ]);
    }
}

