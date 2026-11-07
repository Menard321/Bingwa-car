"use client";

import React, { use } from "react";
import Navbar from "@/components/Navbar";
import VehicleDetailPage, { VehicleDetailProps } from "@/components/VehicleDetailPage";
import { useBingwaStore } from "@/lib/store";

export default function DynamicVehicleDetailRoute({
  params,
  vehicle: propVehicle,
}: {
  params?: Promise<{ vin: string }>;
  vehicle?: VehicleDetailProps["vehicle"];
}) {
  const { vehicles } = useBingwaStore();

  // If a vehicle prop was passed directly (e.g. unit test or direct component import), render VehicleDetailPage directly
  if (propVehicle) {
    return <VehicleDetailPage vehicle={propVehicle} />;
  }

  const resolvedParams = params ? use(params) : { vin: "" };
  const decodedVin = decodeURIComponent(resolvedParams.vin || "");

  const matched =
    vehicles.find(
      (v) =>
        v.vin.toLowerCase() === decodedVin.toLowerCase() ||
        v.slug.toLowerCase() === decodedVin.toLowerCase() ||
        v.id === decodedVin
    ) ?? vehicles[0];

  const mappedVehicle: VehicleDetailProps["vehicle"] = {
    vin: matched.vin,
    make: matched.make,
    model: matched.model,
    year: matched.year,
    selling_price_tzs: matched.priceTzs,
    mileage_km: matched.mileageKm,
    fuel_type: matched.fuelType,
    transmission: matched.transmission,
    color: matched.color,
    branch_name: matched.branchLabel.en,
    model_3d_url: "/models/sample_car.glb",
    images: [...matched.images],
    specifications: {
      engine_code: matched.specsJsonb.engineCode,
      engine_cc: `${matched.engineCc} CC`,
      drivetrain: matched.driveTrain,
      seats: `${matched.specsJsonb.seats} Seats`,
      origin_country: matched.specsJsonb.originCountry,
      auction_grade: matched.auctionGrade,
      tbs_certificate: matched.specsJsonb.tbsCertificateNo,
      tra_tansad_ref: matched.priceAudit.tansadRef,
    },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <VehicleDetailPage vehicle={mappedVehicle} />
    </div>
  );
}
