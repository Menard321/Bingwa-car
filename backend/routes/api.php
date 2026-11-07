<?php

use App\Http\Controllers\Api\CustomsTrackingController;
use App\Http\Controllers\Api\FinancialEscrowController;
use App\Http\Controllers\Api\InterBranchTransferController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Bingwa Cars Enterprise API Routes (Phases 1 through 8)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public Showroom & Sanitized Customs Tracking Endpoints
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{vin}', [VehicleController::class, 'show']);
    Route::get('/tracking/{code}', [CustomsTrackingController::class, 'publicTrack']);

    // Phase 6: Public Proforma Invoice Generation & Mobile Money / Bank Escrow Webhook
    Route::post('/vehicles/{vin}/invoices', [FinancialEscrowController::class, 'generateInvoice']);
    Route::post('/webhooks/escrow-deposit', [FinancialEscrowController::class, 'handleDepositWebhook']);

    // Protected Operational & Executive Owner Endpoints (Laravel Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        // Strict Owner-Only Price Lock Override
        Route::patch('/vehicles/{id}/lock-price', [VehicleController::class, 'updatePrice']);

        // Phase 6: Executive Confidential Unit Economics Ledger (Owner-Only)
        Route::get('/vehicles/{vin}/executive-ledger', [FinancialEscrowController::class, 'executiveUnitEconomicsLedger']);

        // TRA Customs & Logistics Stage Progression
        Route::patch('/imports/{id}/stage', [CustomsTrackingController::class, 'updateStage']);

        // Inter-Branch Stock Transfers
        Route::post('/transfers', [InterBranchTransferController::class, 'store']);
        Route::patch('/transfers/{transferId}/authorize-release', [InterBranchTransferController::class, 'authorizeRelease']);
        Route::patch('/transfers/{transferId}/verify-arrival', [InterBranchTransferController::class, 'verifyArrivalAndReceive']);
    });
});
