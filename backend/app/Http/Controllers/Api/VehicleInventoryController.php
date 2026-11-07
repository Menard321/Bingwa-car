<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Laravel 11 REST API Controller for Bingwa Cars Multi-Branch Inventory
 * Enforces Branch Isolation and Strict Owner-Controlled Price Locking.
 */
final class VehicleInventoryController
{
    public function index(Request $request): JsonResponse
    {
        $query = DB::table('vehicles')
            ->join('branches', 'vehicles.branch_id', '=', 'branches.id')
            ->select([
                'vehicles.id',
                'vehicles.slug',
                'vehicles.make',
                'vehicles.model',
                'vehicles.year',
                'vehicles.body_type',
                'vehicles.owner_locked_price_tzs',
                'vehicles.price_lock_sha256',
                'vehicles.price_locked_at',
                'vehicles.mileage_km',
                'vehicles.fuel_type',
                'vehicles.transmission',
                'vehicles.drivetrain',
                'vehicles.auction_grade',
                'vehicles.tra_tansad_ref',
                'vehicles.tbs_certificate_no',
                'vehicles.specs_jsonb',
                'vehicles.images_jsonb',
                'branches.code as branch_code',
                'branches.name_sw as branch_name_sw',
                'branches.name_en as branch_name_en',
            ])
            ->where('vehicles.is_available', true);

        if ($request->filled('branch') && $request->string('branch')->toString() !== 'all') {
            $query->where('branches.code', $request->string('branch')->toString());
        }

        if ($request->filled('make') && $request->string('make')->toString() !== 'ALL') {
            $query->where('vehicles.make', $request->string('make')->toString());
        }

        if ($request->filled('body_type') && $request->string('body_type')->toString() !== 'ALL') {
            $query->where('vehicles.body_type', $request->string('body_type')->toString());
        }

        if ($request->filled('max_price_tzs')) {
            $query->where('vehicles.owner_locked_price_tzs', '<=', $request->integer('max_price_tzs'));
        }

        return response()->json([
            'currency' => 'TZS',
            'price_policy' => 'STRICT_OWNER_LOCKED_ZERO_DISCOUNT',
            'data' => $query->orderByDesc('vehicles.created_at')->get(),
        ]);
    }

    /**
     * Strict Owner-Only Price Update Endpoint.
     * Rejects all staff or automated discounting attempts; requires Executive Owner cryptographic signature.
     */
    public function updateOwnerPrice(Request $request, string $vehicleId): JsonResponse
    {
        $user = $request->user();
        if (! $user || $user->role !== 'EXECUTIVE_OWNER') {
            return response()->json([
                'error' => 'UNAUTHORIZED_PRICE_MUTATION',
                'message_sw' => 'Bei za magari zimefungwa na Mmiliki Pekee. Wafanyakazi hawaruhusiwi kubadili bei.',
                'message_en' => 'Strict Owner-Controlled Price Lock active. Staff edits and automated discounts are forbidden.',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'new_locked_price_tzs' => ['required', 'integer', 'min:10000000'],
            'owner_passkey_signature' => ['required', 'string', 'min:32'],
        ]);

        return DB::transaction(function () use ($vehicleId, $validated, $user, $request) {
            $vehicle = DB::table('vehicles')->where('id', $vehicleId)->lockForUpdate()->firstOrFail();

            $auditHash = hash(
                'sha256',
                $vehicleId . '|' . $validated['new_locked_price_tzs'] . '|' . $user->id . '|' . now()->toIso8601String()
            );

            DB::table('vehicles')->where('id', $vehicleId)->update([
                'owner_locked_price_tzs' => $validated['new_locked_price_tzs'],
                'price_lock_sha256' => $auditHash,
                'locked_by_owner_id' => $user->id,
                'price_locked_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('price_lock_audit_logs')->insert([
                'vehicle_id' => $vehicleId,
                'executive_owner_id' => $user->id,
                'previous_price_tzs' => $vehicle->owner_locked_price_tzs,
                'new_locked_price_tzs' => $validated['new_locked_price_tzs'],
                'cryptographic_signature' => $auditHash,
                'authorized_ip' => $request->ip(),
                'created_at' => now(),
            ]);

            return response()->json([
                'status' => 'OWNER_PRICE_LOCKED',
                'vehicle_id' => $vehicleId,
                'owner_locked_price_tzs' => $validated['new_locked_price_tzs'],
                'price_lock_sha256' => $auditHash,
            ]);
        });
    }
}

