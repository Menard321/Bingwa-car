<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

/**
 * PHASE 6: Financial Operations, Invoicing & Reservation Escrow Controller
 * - Multi-Currency Invoicing Engine (TZS / USD with TRA VFD QR Verification)
 * - Tanzanian Mobile Money (M-Pesa C2B, Airtel Money, Tigo Pesa) & Bank (CRDB, NMB) Escrow Webhooks (72h Reservation Lock)
 * - Executive Confidential Unit Economics Ledger (Owner-Only)
 */
final class FinancialEscrowController extends Controller
{
    private const USD_TO_TZS_EXCHANGE_RATE = 2650.00;
    private const RESERVATION_HOLD_HOURS = 72;

    /**
     * Generate TRA-compliant Proforma / Tax Invoice payload with QR verification signature.
     */
    public function generateInvoice(Request $request, string $vin): JsonResponse
    {
        $validated = $request->validate([
            'invoice_type' => ['required', 'in:PROFORMA,SALES_AGREEMENT,TRA_TAX_INVOICE'],
            'currency' => ['required', 'in:TZS,USD'],
            'buyer_name' => ['required', 'string', 'max:140'],
            'buyer_tin' => ['nullable', 'string', 'max:32'],
            'buyer_phone' => ['required', 'string', 'max:32'],
        ]);

        $vehicle = Vehicle::with(['branch'])->where('vin', $vin)->firstOrFail();
        $lockedPriceTzs = (float) $vehicle->selling_price_tzs;
        $amountInSelectedCurrency = $validated['currency'] === 'USD'
            ? round($lockedPriceTzs / self::USD_TO_TZS_EXCHANGE_RATE, 2)
            : $lockedPriceTzs;

        $invoiceNumber = 'INV-BINGWA-' . date('Ymd') . '-' . strtoupper(substr($vehicle->id, 0, 6));
        $qrVerificationHash = hash_hmac(
            'sha256',
            "{$invoiceNumber}|{$vehicle->vin}|{$lockedPriceTzs}",
            (string) config('app.key', 'bingwa-enterprise-secret')
        );

        return response()->json([
            'invoice_number' => $invoiceNumber,
            'invoice_type' => $validated['invoice_type'],
            'issued_at_eat' => now()->timezone('Africa/Dar_es_Salaam')->toIso8601String(),
            'issuer' => [
                'company' => 'Bingwa Cars Limited',
                'tin' => '142-889-301',
                'vrn' => '40-029184-Z',
                'branch' => $vehicle->branch->name ?? 'Dar es Salaam Yard',
            ],
            'buyer' => [
                'name' => $validated['buyer_name'],
                'tin' => $validated['buyer_tin'] ?? 'INDIVIDUAL-BUYER',
                'phone' => $validated['buyer_phone'],
            ],
            'vehicle' => [
                'vin' => $vehicle->vin,
                'description' => "{$vehicle->year_of_manufacture} {$vehicle->make} {$vehicle->model}",
                'color' => $vehicle->color,
                'mileage_km' => $vehicle->mileage_km,
            ],
            'financials' => [
                'currency' => $validated['currency'],
                'owner_locked_price_tzs' => $lockedPriceTzs,
                'billed_total' => $amountInSelectedCurrency,
                'exchange_rate_applied' => self::USD_TO_TZS_EXCHANGE_RATE,
                'tra_vat_inclusive' => true,
            ],
            'tra_vfd_qr_verification' => [
                'signature' => $qrVerificationHash,
                'verify_url' => url("/api/v1/invoices/verify/{$invoiceNumber}?sig={$qrVerificationHash}"),
            ],
        ]);
    }

    /**
     * Webhook Handler for Tanzanian Mobile Money (M-Pesa, Airtel Money, Tigo Pesa) & Bank Wires (CRDB, NMB).
     * Automatically places a 72-hour reservation lock on the vehicle upon deposit receipt.
     */
    public function handleDepositWebhook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'channel' => ['required', 'in:MPESA_C2B,AIRTEL_MONEY,TIGO_PESA,CRDB_WIRE,NMB_WIRE'],
            'transaction_receipt' => ['required', 'string', 'max:64'],
            'vin' => ['required', 'string', 'exists:vehicles,vin'],
            'amount_tzs' => ['required', 'numeric', 'min:1000000'],
            'payer_phone_or_account' => ['required', 'string', 'max:64'],
        ]);

        return DB::transaction(function () use ($validated) {
            $vehicle = Vehicle::withoutGlobalScopes()
                ->where('vin', $validated['vin'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($vehicle->status === 'SOLD') {
                return response()->json([
                    'error' => 'VEHICLE_ALREADY_SOLD',
                ], Response::HTTP_CONFLICT);
            }

            $reservedUntil = now()->addHours(self::RESERVATION_HOLD_HOURS);
            $specs = is_array($vehicle->specifications) ? $vehicle->specifications : [];
            $specs['escrow_reservation'] = [
                'channel' => $validated['channel'],
                'receipt' => $validated['transaction_receipt'],
                'deposit_amount_tzs' => (float) $validated['amount_tzs'],
                'payer' => $validated['payer_phone_or_account'],
                'reserved_until_eat' => $reservedUntil->timezone('Africa/Dar_es_Salaam')->toIso8601String(),
            ];

            $vehicle->update([
                'status' => 'RESERVED',
                'specifications' => $specs,
            ]);

            return response()->json([
                'status' => 'RESERVATION_ESCROW_LOCKED',
                'vin' => $vehicle->vin,
                'channel' => $validated['channel'],
                'transaction_receipt' => $validated['transaction_receipt'],
                'hold_window_hours' => self::RESERVATION_HOLD_HOURS,
                'reserved_until_eat' => $reservedUntil->timezone('Africa/Dar_es_Salaam')->toIso8601String(),
            ]);
        });
    }

    /**
     * Executive Confidential Unit Economics Ledger (Strictly Owner-Only):
     * Gross Margin = Locked Price - (CIF + TRA Duty + Wharfage + TBS + Refurbishment)
     */
    public function executiveUnitEconomicsLedger(Request $request, string $vin): JsonResponse
    {
        $vehicle = Vehicle::withoutGlobalScopes()->where('vin', $vin)->firstOrFail();

        // Enforce strict owner-only access via VehiclePricingPolicy
        Gate::authorize('updatePrice', $vehicle);

        $lockedPrice = (float) $vehicle->selling_price_tzs;
        $specs = is_array($vehicle->specifications) ? $vehicle->specifications : [];

        $cifTzs = (float) ($specs['confidential_cif_tzs'] ?? round($lockedPrice * 0.54));
        $traDutyTzs = (float) ($specs['confidential_tra_duty_tzs'] ?? round($lockedPrice * 0.26));
        $wharfageTzs = (float) ($specs['confidential_wharfage_tzs'] ?? 1450000);
        $tbsFeeTzs = (float) ($specs['confidential_tbs_tzs'] ?? 650000);
        $refurbishmentTzs = (float) ($specs['confidential_refurbishment_tzs'] ?? 1200000);

        $totalLandedCostTzs = $cifTzs + $traDutyTzs + $wharfageTzs + $tbsFeeTzs + $refurbishmentTzs;
        $grossMarginTzs = $lockedPrice - $totalLandedCostTzs;

        return response()->json([
            'vin' => $vehicle->vin,
            'confidential_classification' => 'EXECUTIVE_OWNER_EYES_ONLY',
            'currency' => 'TZS',
            'unit_economics' => [
                'locked_selling_price_tzs' => $lockedPrice,
                'cif_acquisition_tzs' => $cifTzs,
                'tra_customs_duty_tzs' => $traDutyTzs,
                'tpa_wharfage_tzs' => $wharfageTzs,
                'tbs_inspection_tzs' => $tbsFeeTzs,
                'yard_refurbishment_tzs' => $refurbishmentTzs,
                'total_landed_cost_tzs' => $totalLandedCostTzs,
                'gross_margin_tzs' => $grossMarginTzs,
                'margin_percentage' => round(($grossMarginTzs / max(1, $lockedPrice)) * 100, 2),
            ],
        ]);
    }
}

