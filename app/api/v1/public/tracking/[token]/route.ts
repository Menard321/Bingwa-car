import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_CUSTOMS_SHIPMENTS } from '@/lib/data';

/**
 * Phase 4.4 Public Token Lookup Endpoint: GET /api/v1/public/tracking/{token}
 * Returns current shipment milestone and delivery estimates while strictly
 * excluding wholesale acquisition costs, internal margins, and broker contacts.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const normalized = decodeURIComponent(token).trim();

  const shipment = Object.values(SAMPLE_CUSTOMS_SHIPMENTS).find(
    (s) =>
      s.trackingAccessToken.toLowerCase() === normalized.toLowerCase() ||
      s.trackingCode.toLowerCase() === normalized.toLowerCase() ||
      s.vinChassis.toLowerCase() === normalized.toLowerCase()
  );

  if (!shipment) {
    return NextResponse.json(
      {
        error: 'TRACKING_TOKEN_NOT_FOUND',
        message_sw: 'Tokeni ya ufuatiliaji haijapatikana.',
        message_en: 'Shipment tracking token not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    tracking_verified: true,
    currency: 'TZS',
    sanitized_public_view: true,
    shipment: {
      tracking_code: shipment.trackingCode,
      vin_chassis: shipment.vinChassis,
      vehicle_title: shipment.vehicleTitle,
      origin_country: shipment.originCountry,
      origin_port: shipment.originPort,
      vessel_name: shipment.vesselName,
      bl_number: shipment.blNumber,
      customs_stage: shipment.customsStage,
      current_step: shipment.currentStep,
      tra_tansad_number: shipment.tansadNumber,
      tbs_inspection_code: shipment.tbsInspectionCode,
      eta_dar_port: shipment.etaDarPort,
      destination_branch: shipment.destinationBranch,
      owner_locked_landed_price_tzs: shipment.lockedCifAndTaxTzs,
      milestones: shipment.stepTimestamps,
    },
  });
}

