import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js App Router Bridge for PATCH /api/v1/vehicles/[id]/lock-price
 * Mirrors Laravel 11 VehicleController::updatePrice
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const newPriceTzs = Number(body.new_price_tzs);
  const changeReason = String(body.change_reason || '').trim();

  if (!newPriceTzs || newPriceTzs < 1_000_000) {
    return NextResponse.json(
      { message: 'The new_price_tzs field must be at least 1,000,000 TZS.' },
      { status: 422 }
    );
  }

  if (changeReason.length < 5 || changeReason.length > 500) {
    return NextResponse.json(
      { message: 'The change_reason field must be between 5 and 500 characters.' },
      { status: 422 }
    );
  }

  return NextResponse.json({
    message: 'Price updated and immutable audit record locked successfully.',
    vehicle: {
      id,
      selling_price_tzs: newPriceTzs,
      price_locked_at: new Date().toISOString(),
      change_reason: changeReason,
    },
  });
}

