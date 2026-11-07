export type Locale = 'sw' | 'en';
export type BranchId = 'all' | 'mwenge' | 'mikocheni' | 'transit';
export type BodyType = 'ALL' | 'SUV' | 'Sedan' | 'Pickup' | 'Hatchback' | 'Commercial';
export type ImportSource = 'ALL' | 'Japan' | 'UK' | 'Local Yard';
export type CustomsStage =
  | 'ORDERED'
  | 'SHIPPED'
  | 'PORT_DAR'
  | 'TRA_ASSESSMENT'
  | 'TAX_PAID'
  | 'TBS_CLEARED'
  | 'YARD_DELIVERED';

export type TransferStatus =
  | 'PENDING_AUTHORIZATION'
  | 'IN_TRANSIT'
  | 'RECEIVED_AND_VERIFIED'
  | 'CANCELLED';

export type UserRole = 'owner' | 'branch_manager' | 'sales_agent' | 'customs_agent';

export interface PriceLockAudit {
  hash: string;
  lockedBy: string;
  verifiedAt: string;
  tansadRef: string;
  discountAllowed: false;
}

export interface PriceAuditLogEntry {
  id: string;
  vehicleVin: string;
  vehicleTitle: string;
  oldPriceTzs: number;
  newPriceTzs: number;
  modifiedByUserId: string;
  modifiedByName: string;
  modifiedByRole: 'owner';
  reason: string;
  signatureHash: string;
  timestamp: string;
}

export interface AuctionSheetDetail {
  auctionHouse: string;
  lotNumber: string;
  overallGrade: string;
  interiorGrade: 'A' | 'B' | 'C';
  exteriorGrade: 'A' | 'B' | 'C';
  inspectorNotesSw: string;
  inspectorNotesEn: string;
  odometerVerified: boolean;
  radiationCleared: boolean;
}

export interface Vehicle {
  id: string;
  vin: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  bodyType: Exclude<BodyType, 'ALL'>;
  branchId: Exclude<BranchId, 'all'>;
  branchLabel: {
    sw: string;
    en: string;
  };
  priceTzs: number;
  mileageKm: number;
  engineSpec: string;
  engineCc: number;
  fuelType: 'Diesel' | 'Petrol' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  driveTrain: '4WD / 4x4' | 'AWD' | '2WD';
  importSource: Exclude<ImportSource, 'ALL'>;
  dateAdded: string;
  color: string;
  auctionGrade: string;
  verificationBadge: {
    sw: string;
    en: string;
  };
  registrationStatus: {
    sw: string;
    en: string;
  };
  images: [string, string, string];
  specsJsonb: {
    seats: number;
    engineCode: string;
    originCountry: 'Japan' | 'UK' | 'Germany';
    tbsCertificateNo: string;
    chassisPrefix: string;
    features: string[];
  };
  auctionSheet: AuctionSheetDetail;
  statutoryBreakdownTzs: {
    traCustomsDutyIncluded: number;
    tbsInspectionFeeIncluded: number;
    plateAndCardRegistrationIncluded: number;
  };
  priceAudit: PriceLockAudit;
}

export interface BrandItem {
  name: string;
  originFlag: string;
  originCountry: string;
  inStockCount: number;
  popularModels: string;
  accentHex: string;
}

export interface CustomsShipment {
  trackingCode: string;
  trackingAccessToken: string;
  vinChassis: string;
  customerInitials: string;
  customerPhone: string;
  vehicleTitle: string;
  originCountry: 'Japan' | 'UK' | 'UAE' | 'South Africa';
  originPort: string;
  vesselName: string;
  voyageNo: string;
  blNumber: string;
  containerNumber: string;
  etaDarPort: string;
  destinationBranch: 'Mwenge Central Yard' | 'Mikocheni Flagship Showroom';
  currentStep: number; // 1 to 6
  customsStage: CustomsStage;
  lockedCifAndTaxTzs: number;
  traDutyAmountTzs: number;
  tansadNumber: string;
  tbsInspectionCode: string;
  stepTimestamps: string[];
}

export interface InterBranchTransferRecord {
  id: string;
  vehicleId: string;
  vehicleVin: string;
  vehicleTitle: string;
  sourceBranch: 'mwenge' | 'mikocheni';
  destinationBranch: 'mwenge' | 'mikocheni';
  initiatingUser: string;
  authorizingUser: string | null;
  customerName: string;
  status: TransferStatus;
  requestedAt: string;
  updatedAt: string;
  notes: string;
  conditionChecklistPassed: boolean;
}

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branchId: 'all' | 'mwenge' | 'mikocheni' | 'transit';
  branchName: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLoginEat: string;
}

export function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export const BRAND_LIST: BrandItem[] = [
  {
    name: 'Toyota',
    originFlag: '🇯🇵',
    originCountry: 'Japan',
    inStockCount: 38,
    popularModels: 'Land Cruiser 300 • Prado TX-L • Hilux • Harrier',
    accentHex: '#EB0A1E',
  },
  {
    name: 'Nissan',
    originFlag: '🇯🇵',
    originCountry: 'Japan',
    inStockCount: 16,
    popularModels: 'Patrol Y62 • X-Trail • Dualis • Navara PRO-4X',
    accentHex: '#C3002F',
  },
  {
    name: 'Land Rover',
    originFlag: '🇬🇧',
    originCountry: 'UK',
    inStockCount: 11,
    popularModels: 'Defender 110 • Range Rover Vogue • Discovery 5',
    accentHex: '#005A2B',
  },
  {
    name: 'Mercedes-Benz',
    originFlag: '🇩🇪',
    originCountry: 'Germany',
    inStockCount: 14,
    popularModels: 'GLE 400d • G63 AMG • C200 Avantgarde • GLC 250',
    accentHex: '#00ADEF',
  },
  {
    name: 'Subaru',
    originFlag: '🇯🇵',
    originCountry: 'Japan',
    inStockCount: 19,
    popularModels: 'Forester XT Eyesight • Outback Limited • XV',
    accentHex: '#1D4ED8',
  },
  {
    name: 'BMW',
    originFlag: '🇩🇪',
    originCountry: 'Germany',
    inStockCount: 9,
    popularModels: 'X5 xDrive30d M-Sport • X3 • 523d Luxury',
    accentHex: '#1C69D4',
  },
  {
    name: 'Mitsubishi',
    originFlag: '🇯🇵',
    originCountry: 'Japan',
    inStockCount: 8,
    popularModels: 'Pajero Final Edition • Outlander PHEV • L200 Triton',
    accentHex: '#E60012',
  },
  {
    name: 'Ford',
    originFlag: '🇬🇧',
    originCountry: 'UK / SA',
    inStockCount: 7,
    popularModels: 'Ranger Wildtrak Bi-Turbo • Raptor • Everest',
    accentHex: '#003478',
  },
  {
    name: 'Isuzu',
    originFlag: '🇯🇵',
    originCountry: 'Japan',
    inStockCount: 6,
    popularModels: 'D-Max V-Cross 3.0L • MU-X Onyx Edition',
    accentHex: '#D9232A',
  },
];

export const VEHICLES_INVENTORY: Vehicle[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    vin: 'GDJ150W-0194882',
    slug: 'toyota-land-cruiser-prado-txl-2021',
    title: 'Toyota Land Cruiser Prado TX-L Package (Modellista)',
    make: 'Toyota',
    model: 'Land Cruiser Prado TX-L',
    year: 2021,
    bodyType: 'SUV',
    branchId: 'mikocheni',
    branchLabel: {
      sw: 'Mikocheni Showroom (Bagamoyo Rd)',
      en: 'Mikocheni Showroom (Bagamoyo Rd)',
    },
    priceTzs: 145000000,
    mileageKm: 32450,
    engineSpec: '2.8L 1GD-FTV Clean Turbo Diesel',
    engineCc: 2755,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    driveTrain: '4WD / 4x4',
    importSource: 'Japan',
    dateAdded: '2026-11-01',
    color: 'Pearl White',
    auctionGrade: '4.5B Japan Verified',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • TANSAD Halisi',
      en: '100% TRA Cleared • Original TANSAD',
    },
    registrationStatus: {
      sw: 'Usajili Mpya (Namba E / T-Series)',
      en: 'Clean Registration (New E-Series Plate)',
    },
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 7,
      engineCode: '1GD-FTV',
      originCountry: 'Japan',
      tbsCertificateNo: 'TBS-DAR-2026-88412',
      chassisPrefix: 'GDJ150W-0194',
      features: [
        'Sunroof',
        'Beige Leather Heated & Ventilated Seats',
        '360° Bird-Eye Camera',
        'Toyota Safety Sense Radar Cruise',
        'Modellista Factory Aero Kit',
      ],
    },
    auctionSheet: {
      auctionHouse: 'USS Tokyo Auto Auction',
      lotNumber: 'LOT-70419',
      overallGrade: '4.5',
      interiorGrade: 'B',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Bodi safi isiyo na rangi ya kurudiwa. Injini ya 1GD-FTV iko kwenye hali bora kabisa, siti za ngozi za beige ni safi kama mpya.',
      inspectorNotesEn:
        'Original factory Pearl White paintwork (070). Zero chassis rust, one-owner Tokyo executive vehicle with full dealership service book.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 38400000,
      tbsInspectionFeeIncluded: 650000,
      plateAndCardRegistrationIncluded: 950000,
    },
    priceAudit: {
      hash: 'SHA256:9f86d081884c7d659a2feaa0c55ad015',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-01 09:15 EAT',
      tansadRef: 'TZ-DAR-2026-991042',
      discountAllowed: false,
    },
  },
  {
    id: 'a19bc40e-72dc-4910-b112-8c04d2e9f102',
    vin: 'GUN126R-0082419',
    slug: 'toyota-hilux-revo-rocco-2022',
    title: 'Toyota Hilux Revo Rocco 2.8L 4x4 Double Cabin',
    make: 'Toyota',
    model: 'Hilux Rocco 4x4',
    year: 2022,
    bodyType: 'Pickup',
    branchId: 'mwenge',
    branchLabel: {
      sw: 'Mwenge Central Yard (Morogoro Rd)',
      en: 'Mwenge Central Yard (Morogoro Rd)',
    },
    priceTzs: 118500000,
    mileageKm: 28900,
    engineSpec: '2.8L 1GD-FTV Heavy-Duty Diesel',
    engineCc: 2755,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    driveTrain: '4WD / 4x4',
    importSource: 'Japan',
    dateAdded: '2026-11-02',
    color: 'Attitude Black',
    auctionGrade: '4.5A Japan Verified',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • Tayari Kuondoka',
      en: '100% TRA Cleared • Drive-Away Ready',
    },
    registrationStatus: {
      sw: 'Tayari Kusajiliwa Jina Lako (24h)',
      en: 'Direct Buyer TIN Registration (24h)',
    },
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 5,
      engineCode: '1GD-FTV',
      originCountry: 'Japan',
      tbsCertificateNo: 'TBS-DAR-2026-77319',
      chassisPrefix: 'GUN126R-0082',
      features: [
        'Factory Rocco Sports Bar',
        'Rear Differential Lock',
        'JBL Premium Sound System',
        'Heavy-Duty Bed Liner',
        'Downhill Assist Control',
      ],
    },
    auctionSheet: {
      auctionHouse: 'CAA Chubu Nagoya Auction',
      lotNumber: 'LOT-31094',
      overallGrade: '4.5',
      interiorGrade: 'A',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Pick-up imetunzwa vizuri bila kubeba mizigo mizito ya migodini. Rimu za Rocco halisi na tairi mpya za All-Terrain.',
      inspectorNotesEn:
        'Immaculate non-commercial urban use pickup. Factory Rocco fender flares, LED projector headlamps, and spotless undercarriage.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 29800000,
      tbsInspectionFeeIncluded: 650000,
      plateAndCardRegistrationIncluded: 950000,
    },
    priceAudit: {
      hash: 'SHA256:4b227777d4dd1fc61c6f884f48641d02',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-02 14:30 EAT',
      tansadRef: 'TZ-DAR-2026-883410',
      discountAllowed: false,
    },
  },
  {
    id: 'c82df91a-14ee-4201-9a34-2b19e8f0a511',
    vin: 'SALEA7BW-2091445',
    slug: 'land-rover-defender-110-d300-hse-2021',
    title: 'Land Rover Defender 110 D300 X-Dynamic HSE',
    make: 'Land Rover',
    model: 'Defender 110 D300',
    year: 2021,
    bodyType: 'SUV',
    branchId: 'mikocheni',
    branchLabel: {
      sw: 'Mikocheni Showroom (Bagamoyo Rd)',
      en: 'Mikocheni Showroom (Bagamoyo Rd)',
    },
    priceTzs: 215000000,
    mileageKm: 24100,
    engineSpec: '3.0L Ingenium Inline-6 Twin-Turbo Diesel',
    engineCc: 2996,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    driveTrain: '4WD / 4x4',
    importSource: 'UK',
    dateAdded: '2026-10-29',
    color: 'Carpathian Grey',
    auctionGrade: 'UK Approved 5.0A',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • UK Direct Import',
      en: '100% TRA Cleared • UK Direct Import',
    },
    registrationStatus: {
      sw: 'Usajili Kamili & Bima Kubwa',
      en: 'Clean Registration & Full Inspection',
    },
    images: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 7,
      engineCode: 'AJ20-D6',
      originCountry: 'UK',
      tbsCertificateNo: 'TBS-UK-2026-90125',
      chassisPrefix: 'SALEA7BW-2091',
      features: [
        'Electronic Air Suspension',
        'Meridian Surround Sound',
        'ClearSight Digital Rear View Mirror',
        'Factory Raised Air Intake Snorkel & Side Gear Carrier',
      ],
    },
    auctionSheet: {
      auctionHouse: 'Land Rover Approved Surrey UK',
      lotNumber: 'UK-LR-8821',
      overallGrade: '5.0',
      interiorGrade: 'A',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Imeagizwa moja kwa moja kutoka Uingereza ikiwa na historia kamili ya Land Rover UK na mfumo wa Electronic Air Suspension.',
      inspectorNotesEn:
        'Direct UK franchise-approved import. Full HPI clear report, Windsor Tan leather interior, and Explorer Pack accessories.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 58500000,
      tbsInspectionFeeIncluded: 750000,
      plateAndCardRegistrationIncluded: 950000,
    },
    priceAudit: {
      hash: 'SHA256:e27c2214b8d199a01f98a231c908f117',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-10-29 11:05 EAT',
      tansadRef: 'TZ-DAR-2026-779012',
      discountAllowed: false,
    },
  },
  {
    id: 'd91ef02b-31fa-4812-8b45-9d21f7c8e334',
    vin: 'SK9-0182499',
    slug: 'subaru-forester-xt-eyesight-2019',
    title: 'Subaru Forester 2.5i-S EyeSight Touring AWD',
    make: 'Subaru',
    model: 'Forester EyeSight',
    year: 2019,
    bodyType: 'SUV',
    branchId: 'mwenge',
    branchLabel: {
      sw: 'Mwenge Central Yard (Morogoro Rd)',
      en: 'Mwenge Central Yard (Morogoro Rd)',
    },
    priceTzs: 48500000,
    mileageKm: 51200,
    engineSpec: '2.5L FB25 Boxer Petrol Symmetrical AWD',
    engineCc: 2498,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    driveTrain: 'AWD',
    importSource: 'Japan',
    dateAdded: '2026-11-04',
    color: 'Jasper Metallic',
    auctionGrade: '4.0B Japan Verified',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • Kadi Halisi',
      en: '100% TRA Cleared • Original Card',
    },
    registrationStatus: {
      sw: 'Usajili Mpya wa TRA (T-Series E)',
      en: 'Fresh TRA Plate Registration',
    },
    images: [
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 5,
      engineCode: 'FB25-DI',
      originCountry: 'Japan',
      tbsCertificateNo: 'TBS-DAR-2026-66201',
      chassisPrefix: 'SK9-01824',
      features: [
        'Dual X-Mode Terrain Control',
        'EyeSight Driver Assist v3',
        'Power Rear Tailgate',
        'Saddle Brown Leather Trim',
      ],
    },
    auctionSheet: {
      auctionHouse: 'USS Yokohama Auto Auction',
      lotNumber: 'LOT-19402',
      overallGrade: '4.0',
      interiorGrade: 'B',
      exteriorGrade: 'B',
      inspectorNotesSw:
        'Mfumo wa Symmetrical AWD na EyeSight unafanya kazi kwa asilimia 100. Imekaguliwa Mwenge Yard na ipo tayari kwa safari.',
      inspectorNotesEn:
        'Clean Yokohama unit with full EyeSight calibration certificate, Dual X-Mode off-road selector, and zero oil seepage.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 13200000,
      tbsInspectionFeeIncluded: 550000,
      plateAndCardRegistrationIncluded: 850000,
    },
    priceAudit: {
      hash: 'SHA256:7d155f801a9942c64381920a11b2c991',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-04 16:40 EAT',
      tansadRef: 'TZ-DAR-2026-994120',
      discountAllowed: false,
    },
  },
  {
    id: 'e54ab11c-90cd-4123-9c56-1a32e6d7f445',
    vin: 'W1N167-3232098',
    slug: 'mercedes-benz-gle-400d-amg-line-2020',
    title: 'Mercedes-Benz GLE 400d 4MATIC AMG Line Coupe',
    make: 'Mercedes-Benz',
    model: 'GLE 400d AMG',
    year: 2020,
    bodyType: 'SUV',
    branchId: 'mikocheni',
    branchLabel: {
      sw: 'Mikocheni Showroom (Bagamoyo Rd)',
      en: 'Mikocheni Showroom (Bagamoyo Rd)',
    },
    priceTzs: 168000000,
    mileageKm: 36800,
    engineSpec: '2.9L OM656 Inline-6 Turbo Diesel (330 HP)',
    engineCc: 2925,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    driveTrain: 'AWD',
    importSource: 'UK',
    dateAdded: '2026-11-05',
    color: 'Obsidian Black',
    auctionGrade: '4.5A Executive Spec',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • Ukaguzi wa TBS',
      en: '100% TRA Cleared • TBS Verified',
    },
    registrationStatus: {
      sw: 'Namba Mpya ya Usajili (Dar es Salaam)',
      en: 'Clean Dar es Salaam Registration',
    },
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 5,
      engineCode: 'OM656',
      originCountry: 'Germany',
      tbsCertificateNo: 'TBS-DAR-2026-81209',
      chassisPrefix: 'W1N167-3232',
      features: [
        'MBUX Dual Widescreen Cockpit',
        'Burmester 3D Surround Audio',
        'Panoramic Sliding Sunroof',
        '21" AMG Multi-Spoke Alloy Wheels',
      ],
    },
    auctionSheet: {
      auctionHouse: 'BCA Blackbushe UK Executive',
      lotNumber: 'UK-MB-4402',
      overallGrade: '4.5',
      interiorGrade: 'A',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Injini ya kisasa ya OM656 yenye nguvu kubwa (330 HP) na ulaji mdogo wa dizeli. Ipo Mikocheni Flagship Showroom.',
      inspectorNotesEn:
        'Full AMG Line Night Package with AIRMATIC suspension, Burmester sound, and complete digital Mercedes-Benz service history.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 44200000,
      tbsInspectionFeeIncluded: 750000,
      plateAndCardRegistrationIncluded: 950000,
    },
    priceAudit: {
      hash: 'SHA256:1a89c44019e82f77b120d99e810c3210',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-05 10:00 EAT',
      tansadRef: 'TZ-DAR-2026-995811',
      discountAllowed: false,
    },
  },
  {
    id: 'b73cd82f-45ab-4678-8d90-3f45a1b2c667',
    vin: 'AXUH80-0041923',
    slug: 'toyota-harrier-z-leather-hybrid-2021',
    title: 'Toyota Harrier Z Leather Package (AXUH80)',
    make: 'Toyota',
    model: 'Harrier Z Leather',
    year: 2021,
    bodyType: 'SUV',
    branchId: 'transit',
    branchLabel: {
      sw: 'Bandari ya Dar / TRA Clearance (In-Transit)',
      en: 'Dar Port / TRA Clearance (In-Transit)',
    },
    priceTzs: 86000000,
    mileageKm: 29400,
    engineSpec: '2.5L A25A-FXS Hybrid E-Four',
    engineCc: 2487,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    driveTrain: 'AWD',
    importSource: 'Japan',
    dateAdded: '2026-11-06',
    color: 'Precious Black Pearl',
    auctionGrade: '4.5A Yokohama Port',
    verificationBadge: {
      sw: 'Kodi Yote Imejumuishwa • Hatua ya 4 TRA',
      en: 'All Duty Included • Step 4 TRA Clearance',
    },
    registrationStatus: {
      sw: 'Inatoka Bandari Wiki Hii (Hifadhi Sasa)',
      en: 'Clearing Dar Port This Week (Reserve Now)',
    },
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 5,
      engineCode: 'A25A-FXS',
      originCountry: 'Japan',
      tbsCertificateNo: 'TBS-JAAI-2026-55410',
      chassisPrefix: 'AXUH80-00419',
      features: [
        'Electrochromic Dimming Panorama Roof',
        'JBL 9-Speaker Audio',
        '12.3" Widescreen Touch Display',
        'Ventilated Brown Leather Seats',
      ],
    },
    auctionSheet: {
      auctionHouse: 'USS Nagoya Auto Auction',
      lotNumber: 'LOT-55208',
      overallGrade: '4.5',
      interiorGrade: 'A',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Mfumo wa Hybrid betri umepimwa na kupewa cheti cha 100% afya. Gari liko hatua ya mwisho ya kutoka Bandari ya Dar.',
      inspectorNotesEn:
        'Top-of-the-line Z Leather Package with electrochromic glass roof and verified hybrid battery health certificate.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 21500000,
      tbsInspectionFeeIncluded: 600000,
      plateAndCardRegistrationIncluded: 900000,
    },
    priceAudit: {
      hash: 'SHA256:6c912b88e0123f45a891d002c34b8712',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-06 08:20 EAT',
      tansadRef: 'TZ-DAR-2026-998004',
      discountAllowed: false,
    },
  },
  {
    id: '912fa44b-12cd-4998-a441-7e89b3c1d990',
    vin: 'LDA-GJ2FP-109482',
    slug: 'mazda-atenza-sedan-xd-l-package-2019',
    title: 'Toyota Crown RS Advance 2.5L Hybrid Executive Sedan',
    make: 'Toyota',
    model: 'Crown RS Advance',
    year: 2020,
    bodyType: 'Sedan',
    branchId: 'mwenge',
    branchLabel: {
      sw: 'Mwenge Central Yard (Morogoro Rd)',
      en: 'Mwenge Central Yard (Morogoro Rd)',
    },
    priceTzs: 64000000,
    mileageKm: 39200,
    engineSpec: '2.5L Dynamic Force Hybrid Sedan',
    engineCc: 2487,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    driveTrain: '2WD',
    importSource: 'Local Yard',
    dateAdded: '2026-11-03',
    color: 'Sonic Titanium',
    auctionGrade: '4.5B Japan Verified',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • Mwenge Yard',
      en: '100% TRA Cleared • Mwenge Yard',
    },
    registrationStatus: {
      sw: 'Namba Mpya T-Series E (Dar es Salaam)',
      en: 'Registered New E-Series Plate (DSM)',
    },
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 5,
      engineCode: 'A25A-FXS',
      originCountry: 'Japan',
      tbsCertificateNo: 'TBS-DAR-2026-71044',
      chassisPrefix: 'AZSH20-1094',
      features: [
        'RS Quad Exhaust & Aero Body',
        'Heads-Up Display (HUD)',
        'Soft-Close Executive Doors',
        'Rear Passenger Climate & Audio Control',
      ],
    },
    auctionSheet: {
      auctionHouse: 'USS Osaka Auto Auction',
      lotNumber: 'LOT-64120',
      overallGrade: '4.5',
      interiorGrade: 'B',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Saloon ya kifahari yenye uwezo mkubwa wa kuokoa mafuta (20 km/L) na mwonekano wa kisasa wa RS Advance.',
      inspectorNotesEn:
        'Flagship Japanese executive sport saloon with adaptive variable suspension and verified auction sheet.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 16500000,
      tbsInspectionFeeIncluded: 550000,
      plateAndCardRegistrationIncluded: 850000,
    },
    priceAudit: {
      hash: 'SHA256:3c90a112f87d44e90123a8841c09d321',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-03 12:10 EAT',
      tansadRef: 'TZ-DAR-2026-901245',
      discountAllowed: false,
    },
  },
  {
    id: '551bc88a-90de-4110-8f22-6b19a2e4c771',
    vin: 'WBA5V720-0918234',
    slug: 'bmw-x5-xdrive30d-msport-2020',
    title: 'BMW X5 xDrive30d M-Sport Individual (G05)',
    make: 'BMW',
    model: 'X5 xDrive30d M-Sport',
    year: 2020,
    bodyType: 'SUV',
    branchId: 'mikocheni',
    branchLabel: {
      sw: 'Mikocheni Showroom (Bagamoyo Rd)',
      en: 'Mikocheni Showroom (Bagamoyo Rd)',
    },
    priceTzs: 154000000,
    mileageKm: 34900,
    engineSpec: '3.0L B57 TwinPower Turbo Inline-6 Diesel',
    engineCc: 2993,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    driveTrain: 'AWD',
    importSource: 'UK',
    dateAdded: '2026-11-05',
    color: 'Carbon Black Metallic',
    auctionGrade: '4.5A UK Approved',
    verificationBadge: {
      sw: '100% TRA Imelipiwa • Mikocheni VIP',
      en: '100% TRA Cleared • Mikocheni VIP',
    },
    registrationStatus: {
      sw: 'Usajili Kamili wa TRA (Dar es Salaam)',
      en: 'Full TRA Registration Completed',
    },
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85',
    ],
    specsJsonb: {
      seats: 5,
      engineCode: 'B57D30',
      originCountry: 'Germany',
      tbsCertificateNo: 'TBS-UK-2026-84920',
      chassisPrefix: 'WBA5V720-0918',
      features: [
        'Swarovski Crystal CraftedClarity Gear Shifter',
        'Harman Kardon Surround Sound',
        'Sky Lounge Panoramic Glass Roof',
        'M-Sport Aerodynamics & Blue Calipers',
      ],
    },
    auctionSheet: {
      auctionHouse: 'BMW Park Lane UK Approved',
      lotNumber: 'UK-BMW-3091',
      overallGrade: '4.5',
      interiorGrade: 'A',
      exteriorGrade: 'A',
      inspectorNotesSw:
        'Imeagizwa kutoka London Uingereza ikiwa na vifaa vyote vya M-Sport na Swarovski Crystal package.',
      inspectorNotesEn:
        'Single corporate owner from London UK. Full BMW dealer history, 2-axle air suspension, and Laserlight headlamps.',
      odometerVerified: true,
      radiationCleared: true,
    },
    statutoryBreakdownTzs: {
      traCustomsDutyIncluded: 41200000,
      tbsInspectionFeeIncluded: 750000,
      plateAndCardRegistrationIncluded: 950000,
    },
    priceAudit: {
      hash: 'SHA256:8e441c092d11b774a0912e33f551b890',
      lockedBy: 'H. Mwakasege (Managing Director)',
      verifiedAt: '2026-11-05 15:45 EAT',
      tansadRef: 'TZ-DAR-2026-996401',
      discountAllowed: false,
    },
  },
];

export const SAMPLE_CUSTOMS_SHIPMENTS: Record<string, CustomsShipment> = {
  'BINGWA-IMP-7821': {
    trackingCode: 'BINGWA-IMP-7821',
    trackingAccessToken: 'tok_bingwa_7821_prado',
    vinChassis: 'GDJ150W-9041827',
    customerInitials: 'Bw. J. Mwakaleli (Dar es Salaam)',
    customerPhone: '+255 754 310 882',
    vehicleTitle: '2021 Toyota Land Cruiser Prado TX-L 2.8D (Pearl White)',
    originCountry: 'Japan',
    originPort: 'Yokohama Port, Japan 🇯🇵',
    vesselName: 'MV HOEGH TRANSPORTER',
    voyageNo: 'VY-2026-114E',
    blNumber: 'BL-YOK-DAR-884920',
    containerNumber: 'RORO-DECK-4B',
    etaDarPort: 'Imeshawasili Bandari ya Dar (Berth 7 - DP World / TICTS)',
    destinationBranch: 'Mikocheni Flagship Showroom',
    currentStep: 4,
    customsStage: 'TAX_PAID',
    lockedCifAndTaxTzs: 142500000,
    traDutyAmountTzs: 37800000,
    tansadNumber: 'TANSAD-2026-DAR-889120',
    tbsInspectionCode: 'JAAI-TBS-994012-PASS',
    stepTimestamps: [
      '14 Okt 2026 • Yokohama',
      '01 Nov 2026 • Dar Port Berth 7',
      '03 Nov 2026 • TRA TANSAD Assessed',
      '06 Nov 2026 • Ushuru & Wharfage Paid',
      'Inasubiri Ukaguzi wa Namba (8 Nov)',
      'Makabidhiano Mikocheni (9 Nov)',
    ],
  },
  'BINGWA-UK-4092': {
    trackingCode: 'BINGWA-UK-4092',
    trackingAccessToken: 'tok_bingwa_4092_defender',
    vinChassis: 'SALEA7BW2M2094412',
    customerInitials: 'Dkt. A. Kimei (Masaki, DSM)',
    customerPhone: '+255 767 901 224',
    vehicleTitle: '2022 Land Rover Defender 110 D300 HSE (Hakuba Silver)',
    originCountry: 'UK',
    originPort: 'Southampton Port, UK 🇬🇧',
    vesselName: 'MV GLOVIS SUNRISE',
    voyageNo: 'UK-EA-809',
    blNumber: 'BL-SOU-DAR-551902',
    containerNumber: 'RORO-VIP-1A',
    etaDarPort: 'Imekamilika — Tayari Ofisi ya Mikocheni',
    destinationBranch: 'Mikocheni Flagship Showroom',
    currentStep: 6,
    customsStage: 'YARD_DELIVERED',
    lockedCifAndTaxTzs: 218000000,
    traDutyAmountTzs: 59200000,
    tansadNumber: 'TANSAD-2026-DAR-772109',
    tbsInspectionCode: 'TBS-UK-441098-PASS',
    stepTimestamps: [
      '02 Okt 2026 • Southampton UK',
      '24 Okt 2026 • Dar Port Arrival',
      '26 Okt 2026 • TRA Valuation Cleared',
      '28 Okt 2026 • Full Tax & Port Cleared',
      '31 Okt 2026 • Plate T-Series Registered',
      '02 Nov 2026 • Tayari Mikocheni Showroom',
    ],
  },
  'BINGWA-IMP-3310': {
    trackingCode: 'BINGWA-IMP-3310',
    trackingAccessToken: 'tok_bingwa_3310_hilux',
    vinChassis: 'GUN126R-4410928',
    customerInitials: 'Eng. S. Nchimbi (Mbezi Beach)',
    customerPhone: '+255 713 550 119',
    vehicleTitle: '2022 Toyota Hilux Revo Rocco 2.8L 4x4 Double Cab',
    originCountry: 'Japan',
    originPort: 'Nagoya Port, Japan 🇯🇵',
    vesselName: 'MV NYK DELPHINUS',
    voyageNo: 'NGY-DAR-312',
    blNumber: 'BL-NGY-DAR-331094',
    containerNumber: 'RORO-DECK-2C',
    etaDarPort: '05 Nov 2026 • Ukaguzi wa Forodha (TRA)',
    destinationBranch: 'Mwenge Central Yard',
    currentStep: 3,
    customsStage: 'TRA_ASSESSMENT',
    lockedCifAndTaxTzs: 116000000,
    traDutyAmountTzs: 29400000,
    tansadNumber: 'TANSAD-2026-DAR-904511',
    tbsInspectionCode: 'JAAI-TBS-883104-PASS',
    stepTimestamps: [
      '18 Okt 2026 • Nagoya Port Exit',
      '05 Nov 2026 • Dar Port Arrival',
      '07 Nov 2026 • TRA Customs Assessment',
      'Inafuata: Malipo ya Bandari',
      'Inafuata: Usajili wa Namba',
      'Inafuata: Mwenge Central Yard',
    ],
  },
};

export const INITIAL_PRICE_AUDIT_LOGS: PriceAuditLogEntry[] = [
  {
    id: 'aud-901',
    vehicleVin: 'GDJ150W-0194882',
    vehicleTitle: '2021 Toyota Land Cruiser Prado TX-L',
    oldPriceTzs: 148000000,
    newPriceTzs: 145000000,
    modifiedByUserId: 'usr-owner-01',
    modifiedByName: 'H. Mwakasege (Executive Owner)',
    modifiedByRole: 'owner',
    reason: 'Final TRA TANSAD reconciliation upon arrival at Mikocheni Showroom.',
    signatureHash: 'SHA256:9f86d081884c7d659a2feaa0c55ad015',
    timestamp: '2026-11-01 09:15 EAT',
  },
  {
    id: 'aud-902',
    vehicleVin: 'GUN126R-0082419',
    vehicleTitle: '2022 Toyota Hilux Revo Rocco 2.8L 4x4',
    oldPriceTzs: 118500000,
    newPriceTzs: 118500000,
    modifiedByUserId: 'usr-owner-01',
    modifiedByName: 'H. Mwakasege (Executive Owner)',
    modifiedByRole: 'owner',
    reason: 'Initial owner price lock after TBS & Mwenge Yard intake inspection.',
    signatureHash: 'SHA256:4b227777d4dd1fc61c6f884f48641d02',
    timestamp: '2026-11-02 14:30 EAT',
  },
  {
    id: 'aud-903',
    vehicleVin: 'SALEA7BW-2091445',
    vehicleTitle: '2021 Land Rover Defender 110 D300 HSE',
    oldPriceTzs: 219000000,
    newPriceTzs: 215000000,
    modifiedByUserId: 'usr-owner-01',
    modifiedByName: 'H. Mwakasege (Executive Owner)',
    modifiedByRole: 'owner',
    reason: 'Executive Owner quarterly currency adjustment for UK direct import lot.',
    signatureHash: 'SHA256:e27c2214b8d199a01f98a231c908f117',
    timestamp: '2026-10-29 11:05 EAT',
  },
];

export const INITIAL_INTER_BRANCH_TRANSFERS: InterBranchTransferRecord[] = [
  {
    id: 'TRF-2026-041',
    vehicleId: 'a19bc40e-72dc-4910-b112-8c04d2e9f102',
    vehicleVin: 'GUN126R-0082419',
    vehicleTitle: '2022 Toyota Hilux Revo Rocco 2.8L 4x4 Double Cabin',
    sourceBranch: 'mwenge',
    destinationBranch: 'mikocheni',
    initiatingUser: 'G. Massawe (Mikocheni Branch Manager)',
    authorizingUser: 'E. Tarimo (Mwenge Yard Manager)',
    customerName: 'Eng. Baraka Msuya (+255 754 910 332)',
    status: 'IN_TRANSIT',
    requestedAt: '2026-11-07 14:15 EAT',
    updatedAt: '2026-11-07 14:40 EAT',
    notes: 'VIP corporate buyer at Mikocheni Lounge requested 2-hour physical viewing transfer.',
    conditionChecklistPassed: false,
  },
  {
    id: 'TRF-2026-042',
    vehicleId: 'd91ef02b-31fa-4812-8b45-9d21f7c8e334',
    vehicleVin: 'SK9-0182499',
    vehicleTitle: '2019 Subaru Forester 2.5i-S EyeSight Touring AWD',
    sourceBranch: 'mwenge',
    destinationBranch: 'mikocheni',
    initiatingUser: 'N. Kavishe (Senior Sales Agent)',
    authorizingUser: null,
    customerName: 'Bi. Neema Mollel (+255 767 441 800)',
    status: 'PENDING_AUTHORIZATION',
    requestedAt: '2026-11-07 16:05 EAT',
    updatedAt: '2026-11-07 16:05 EAT',
    notes: 'Walk-in client at Mikocheni Showroom wants test drive before 6:00 PM EAT.',
    conditionChecklistPassed: false,
  },
];

export const ENTERPRISE_USERS: EnterpriseUser[] = [
  {
    id: 'usr-owner-01',
    name: 'H. Mwakasege',
    email: 'owner@bingwacars.co.tz',
    phone: '+255 754 889 900',
    role: 'owner',
    branchId: 'all',
    branchName: 'All Branches (Executive Super-Admin)',
    status: 'ACTIVE',
    lastLoginEat: '2026-11-07 16:50 EAT',
  },
  {
    id: 'usr-mgr-mik',
    name: 'Grace Massawe',
    email: 'g.massawe@bingwacars.co.tz',
    phone: '+255 767 224 400',
    role: 'branch_manager',
    branchId: 'mikocheni',
    branchName: 'Mikocheni Flagship Showroom',
    status: 'ACTIVE',
    lastLoginEat: '2026-11-07 16:22 EAT',
  },
  {
    id: 'usr-mgr-mwe',
    name: 'Erick Tarimo',
    email: 'e.tarimo@bingwacars.co.tz',
    phone: '+255 754 889 905',
    role: 'branch_manager',
    branchId: 'mwenge',
    branchName: 'Mwenge Central Yard',
    status: 'ACTIVE',
    lastLoginEat: '2026-11-07 15:48 EAT',
  },
  {
    id: 'usr-sales-01',
    name: 'Noel Kavishe',
    email: 'n.kavishe@bingwacars.co.tz',
    phone: '+255 713 809 441',
    role: 'sales_agent',
    branchId: 'mikocheni',
    branchName: 'Mikocheni Flagship Showroom',
    status: 'ACTIVE',
    lastLoginEat: '2026-11-07 16:10 EAT',
  },
  {
    id: 'usr-customs-01',
    name: 'Salum Abdallah',
    email: 'customs.darport@bingwacars.co.tz',
    phone: '+255 784 612 900',
    role: 'customs_agent',
    branchId: 'transit',
    branchName: 'Dar Port & TRA Customs Desk',
    status: 'ACTIVE',
    lastLoginEat: '2026-11-07 14:35 EAT',
  },
];
