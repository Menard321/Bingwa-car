<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceAuditLog;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class VehicleController extends Controller
{
    /**
     * Get paginated inventory with multifaceted filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::with(['branch'])->where('status', '!=', 'SOLD');

        if ($request->filled('make')) {
            $query->where('make', 'ILIKE', "%{$request->query('make')}%");
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->query('branch_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('selling_price_tzs', '>=', $request->query('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('selling_price_tzs', '<=', $request->query('max_price'));
        }

        if ($request->filled('fuel_type')) {
            $query->where('fuel_type', $request->query('fuel_type'));
        }

        $vehicles = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($vehicles);
    }

    /**
     * Display a specific vehicle by its VIN.
     */
    public function show(string $vin): JsonResponse
    {
        $vehicle = Vehicle::with(['branch', 'foreignImport', 'priceAuditLogs.changedBy'])
            ->where('vin', $vin)
            ->firstOrFail();

        return response()->json($vehicle);
    }

    /**
     * Update locked selling price (Owner-Only).
     */
    public function updatePrice(Request $request, string $id): JsonResponse
    {
        $vehicle = Vehicle::withoutGlobalScopes()->findOrFail($id);

        // Enforce strict owner price lock policy
        Gate::authorize('updatePrice', $vehicle);

        $validated = $request->validate([
            'new_price_tzs' => 'required|numeric|min:1000000',
            'change_reason' => 'required|string|min:5|max:500',
        ]);

        DB::transaction(function () use ($vehicle, $validated) {
            $oldPrice = $vehicle->selling_price_tzs;

            $vehicle->update([
                'selling_price_tzs' => $validated['new_price_tzs'],
                'price_locked_by_user_id' => Auth::id(),
                'price_locked_at' => now(),
            ]);

            PriceAuditLog::create([
                'vehicle_id' => $vehicle->id,
                'changed_by_user_id' => Auth::id(),
                'previous_price_tzs' => $oldPrice,
                'new_price_tzs' => $validated['new_price_tzs'],
                'change_reason' => $validated['change_reason'],
                'recorded_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Price updated and immutable audit record locked successfully.',
            'vehicle' => $vehicle->fresh(),
        ]);
    }
}

