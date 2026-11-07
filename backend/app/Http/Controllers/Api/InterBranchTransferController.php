<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Phase 4.3: Inter-Branch Stock Transfer Controller
 * Status Progression: PENDING_AUTHORIZATION -> IN_TRANSIT -> RECEIVED_AND_VERIFIED -> CANCELLED
 * Vehicle branch_id remains at source branch until destination branch manager completes digital verification.
 */
final class InterBranchTransferController
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => ['required', 'uuid', 'exists:vehicles,id'],
            'destination_branch_id' => ['required', 'uuid', 'exists:branches,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $vehicle = DB::table('vehicles')->where('id', $validated['vehicle_id'])->firstOrFail();

        if ($vehicle->branch_id === $validated['destination_branch_id']) {
            return response()->json([
                'error' => 'SAME_BRANCH_TRANSFER_INVALID',
                'message' => 'Vehicle is already physically located at the requested branch.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $transferId = (string) Str::uuid();

        DB::table('inter_branch_transfers')->insert([
            'id' => $transferId,
            'vehicle_id' => $vehicle->id,
            'source_branch_id' => $vehicle->branch_id,
            'destination_branch_id' => $validated['destination_branch_id'],
            'initiating_user_id' => $request->user()->id,
            'status' => 'PENDING_AUTHORIZATION',
            'notes' => $validated['notes'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'id' => $transferId,
            'status' => 'PENDING_AUTHORIZATION',
            'message' => 'Inter-branch transfer requested. Awaiting source yard release authorization.',
        ], Response::HTTP_CREATED);
    }

    public function authorizeRelease(Request $request, string $transferId): JsonResponse
    {
        $transfer = DB::table('inter_branch_transfers')->where('id', $transferId)->firstOrFail();

        if ($transfer->status !== 'PENDING_AUTHORIZATION') {
            return response()->json(['error' => 'INVALID_TRANSFER_STATE'], Response::HTTP_CONFLICT);
        }

        DB::table('inter_branch_transfers')->where('id', $transferId)->update([
            'status' => 'IN_TRANSIT',
            'authorizing_user_id' => $request->user()->id,
            'updated_at' => now(),
        ]);

        return response()->json([
            'id' => $transferId,
            'status' => 'IN_TRANSIT',
            'message' => 'Source branch authorized dispatch. Vehicle is now IN_TRANSIT.',
        ]);
    }

    public function verifyArrivalAndReceive(Request $request, string $transferId): JsonResponse
    {
        $validated = $request->validate([
            'physical_condition_verified' => ['required', 'boolean', 'accepted'],
            'odometer_reading_km' => ['required', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        return DB::transaction(function () use ($transferId, $validated, $request) {
            $transfer = DB::table('inter_branch_transfers')
                ->where('id', $transferId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($transfer->status !== 'IN_TRANSIT') {
                return response()->json(['error' => 'VEHICLE_NOT_IN_TRANSIT'], Response::HTTP_CONFLICT);
            }

            // Flip active branch ownership ONLY upon destination digital verification
            DB::table('vehicles')->where('id', $transfer->vehicle_id)->update([
                'branch_id' => $transfer->destination_branch_id,
                'mileage' => $validated['odometer_reading_km'],
                'updated_at' => now(),
            ]);

            DB::table('inter_branch_transfers')->where('id', $transferId)->update([
                'status' => 'RECEIVED_AND_VERIFIED',
                'authorizing_user_id' => $request->user()->id,
                'notes' => $validated['notes'] ?? $transfer->notes,
                'updated_at' => now(),
            ]);

            return response()->json([
                'id' => $transferId,
                'status' => 'RECEIVED_AND_VERIFIED',
                'new_branch_id' => $transfer->destination_branch_id,
            ]);
        });
    }
}

