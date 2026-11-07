<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * PHASE 7: Redis / Laravel Horizon Asynchronous Queue Worker
 * Dispatches Regional SMS (Beem Africa / NextSMS under Sender ID "BINGWA CARS")
 * and WhatsApp Business Cloud API payloads with exponential backoff retry logic.
 */
final class DispatchSmsAndWhatsAppNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 4;

    /**
     * Exponential backoff in seconds for Tanzanian mobile gateway retries.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 90, 240];

    public function __construct(
        public readonly string $recipientPhoneTz,
        public readonly string $messageSwahili,
        public readonly string $channel = 'BEEM_SMS', // BEEM_SMS, NEXTSMS, WHATSAPP_CLOUD
        public readonly array $metadata = []
    ) {
        $this->onQueue('tanzania-notifications');
    }

    /**
     * Laravel Horizon monitoring tags.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return [
            'bingwa-comms',
            'channel:' . strtolower($this->channel),
            'recipient:' . $this->recipientPhoneTz,
        ];
    }

    public function handle(): void
    {
        if ($this->channel === 'WHATSAPP_CLOUD') {
            Http::withToken((string) config('services.whatsapp.cloud_token', 'wa-cloud-token'))
                ->timeout(15)
                ->post((string) config('services.whatsapp.endpoint', 'https://graph.facebook.com/v20.0/me/messages'), [
                    'messaging_product' => 'whatsapp',
                    'to' => preg_replace('/\D+/', '', $this->recipientPhoneTz),
                    'type' => 'text',
                    'text' => ['body' => $this->messageSwahili],
                ]);
        } else {
            // Regional Tanzanian SMS Gateway (Beem Africa / NextSMS) with Sender ID: BINGWA CARS
            Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(
                    config('services.beem.api_key', 'key') . ':' . config('services.beem.secret_key', 'secret')
                ),
                'Content-Type' => 'application/json',
            ])
                ->timeout(15)
                ->post((string) config('services.beem.endpoint', 'https://apisms.beem.africa/v1/send'), [
                    'source_addr' => 'BINGWA CARS',
                    'schedule_time' => '',
                    'encoding' => 0,
                    'message' => $this->messageSwahili,
                    'recipients' => [
                        [
                            'recipient_id' => 1,
                            'dest_addr' => preg_replace('/\D+/', '', $this->recipientPhoneTz),
                        ],
                    ],
                ]);
        }

        Log::info('Dispatched Bingwa Cars Notification', [
            'channel' => $this->channel,
            'sender_id' => 'BINGWA CARS',
            'recipient' => $this->recipientPhoneTz,
            'metadata' => $this->metadata,
        ]);
    }
}

