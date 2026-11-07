import { NextRequest, NextResponse } from 'next/server';
import { VEHICLES_INVENTORY } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get('branch') || 'all';
  const make = searchParams.get('make') || 'ALL';
  const bodyType = searchParams.get('bodyType') || 'ALL';

  const filtered = VEHICLES_INVENTORY.filter((v) => {
    if (branch !== 'all' && v.branchId !== branch) return false;
    if (make !== 'ALL' && v.make !== make) return false;
    if (bodyType !== 'ALL' && v.bodyType !== bodyType) return false;
    return true;
  });

  return NextResponse.json({
    platform: 'Bingwa Cars Enterprise Platform (Dar es Salaam)',
    currency: 'TZS',
    priceLockPolicy: 'STRICT_OWNER_CONTROLLED_SHA256',
    count: filtered.length,
    vehicles: filtered,
  });
}

