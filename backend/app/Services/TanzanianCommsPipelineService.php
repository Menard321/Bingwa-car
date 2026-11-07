<?php

declare(strict_types=1);

namespace App\Services;

use App\Jobs\DispatchSmsAndWhatsAppNotificationJob;

/**
 * PHASE 7: Digital Inter-Branch Gate Pass & Regional Notification Service
 */
final class TanzanianCommsPipelineService
{
    /**
     * Generate a signed QR Gate Pass verifying vehicle release from Mwenge and receipt at Mikocheni.
     *
     * @return array<string, mixed>
     */
    public function generateInterBranchGatePass(
        string $transferId,
        string $vin,
        string $sourceBranch,
        string $destinationBranch,
        string $authorizedBy
    ): array {
        $issuedAt = now()->timezone('Africa/Dar_es_Salaam')->toIso8601String();
        $payload = "{$transferId}|{$vin}|{$sourceBranch}->{$destinationBranch}|{$issuedAt}";
        $signature = hash_hmac('sha256', $payload, (string) config('app.key', 'bingwa-gatepass-key'));

        return [
            'gate_pass_code' => 'GP-DSM-' . strtoupper(substr($signature, 0, 8)),
            'transfer_id' => $transferId,
            'vin' => $vin,
            'source_yard' => $sourceBranch,
            'destination_yard' => $destinationBranch,
            'authorized_by' => $authorizedBy,
            'issued_at_eat' => $issuedAt,
            'qr_verification_payload' => base64_encode(json_encode([
                'gp' => $transferId,
                'vin' => $vin,
                'sig' => substr($signature, 0, 32),
            ])),
        ];
    }

    /**
     * Queue an automated SMS & WhatsApp alert under Sender ID "BINGWA CARS".
     */
    public function dispatchCustomerMilestoneAlert(
        string $phoneTz,
        string $vin,
        string $stageLabelSw
    ): void {
        $text = "BINGWA CARS DAR ES SALAAM: Habari! Gari lako (VIN: {$vin}) limefikia hatua ya: {$stageLabelSw}. Tupigie +255 754 889 900.";
        DispatchSmsAndWhatsAppNotificationJob::dispatch($phoneTz, $text, 'BEEM_SMS', ['vin' => $vin]);
    }
}

