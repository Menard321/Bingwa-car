'use client';

import { create } from 'zustand';
import {
  BodyType,
  BranchId,
  CustomsShipment,
  CustomsStage,
  ENTERPRISE_USERS,
  EnterpriseUser,
  INITIAL_INTER_BRANCH_TRANSFERS,
  INITIAL_PRICE_AUDIT_LOGS,
  InterBranchTransferRecord,
  Locale,
  PriceAuditLogEntry,
  SAMPLE_CUSTOMS_SHIPMENTS,
  TransferStatus,
  UserRole,
  VEHICLES_INVENTORY,
  Vehicle,
} from './data';

interface BingwaState {
  locale: Locale;
  selectedBranch: BranchId;
  selectedMake: string;
  selectedBodyType: BodyType;
  maxPriceMillions: number;
  searchQuery: string;
  forcePreloaderKey: number;
  selectedVehicleModal: Vehicle | null;

  // Live Operational Enterprise State (Phases 3, 4 & 5)
  vehicles: Vehicle[];
  priceAuditLogs: PriceAuditLogEntry[];
  transfers: InterBranchTransferRecord[];
  customsShipments: Record<string, CustomsShipment>;
  users: EnterpriseUser[];
  activeAdminRole: UserRole;

  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setSelectedBranch: (branch: BranchId) => void;
  setSelectedMake: (make: string) => void;
  setSelectedBodyType: (bodyType: BodyType) => void;
  setMaxPriceMillions: (priceM: number) => void;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
  triggerPreloaderReplay: () => void;
  setSelectedVehicleModal: (vehicle: Vehicle | null) => void;

  // Phase 5 Executive & Operational Mutations
  setActiveAdminRole: (role: UserRole) => void;
  updateOwnerLockedPrice: (params: {
    vehicleId: string;
    newPriceTzs: number;
    reason: string;
  }) => { success: boolean; error?: string };
  createTransferRequest: (params: {
    vehicleId: string;
    destinationBranch: 'mwenge' | 'mikocheni';
    customerName: string;
    notes: string;
  }) => InterBranchTransferRecord | null;
  advanceTransferStatus: (
    transferId: string,
    nextStatus: TransferStatus,
    actorName: string
  ) => void;
  updateCustomsMilestone: (params: {
    trackingCode: string;
    customsStage: CustomsStage;
    currentStep: number;
    blNumber?: string;
    tansadNumber?: string;
    traDutyAmountTzs?: number;
  }) => void;
  updateUserRoleAndBranch: (
    userId: string,
    role: UserRole,
    branchId: BranchId
  ) => void;
}

const persistPreference = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
      document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage quota errors
    }
  }
};

export const useBingwaStore = create<BingwaState>((set, get) => ({
  locale: 'sw',
  selectedBranch: 'all',
  selectedMake: 'ALL',
  selectedBodyType: 'ALL',
  maxPriceMillions: 250,
  searchQuery: '',
  forcePreloaderKey: 0,
  selectedVehicleModal: null,

  vehicles: VEHICLES_INVENTORY,
  priceAuditLogs: INITIAL_PRICE_AUDIT_LOGS,
  transfers: INITIAL_INTER_BRANCH_TRANSFERS,
  customsShipments: SAMPLE_CUSTOMS_SHIPMENTS,
  users: ENTERPRISE_USERS,
  activeAdminRole: 'owner',

  setLocale: (locale) => {
    persistPreference('bingwa_locale', locale);
    set({ locale });
  },
  toggleLocale: () =>
    set((state) => {
      const next = state.locale === 'sw' ? 'en' : 'sw';
      persistPreference('bingwa_locale', next);
      return { locale: next };
    }),
  setSelectedBranch: (selectedBranch) => {
    persistPreference('bingwa_branch', selectedBranch);
    set({ selectedBranch });
  },
  setSelectedMake: (selectedMake) => set({ selectedMake }),
  setSelectedBodyType: (selectedBodyType) => set({ selectedBodyType }),
  setMaxPriceMillions: (maxPriceMillions) => set({ maxPriceMillions }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () =>
    set({
      selectedBranch: 'all',
      selectedMake: 'ALL',
      selectedBodyType: 'ALL',
      maxPriceMillions: 250,
      searchQuery: '',
    }),
  triggerPreloaderReplay: () =>
    set((state) => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('bingwa_loader_seen');
        sessionStorage.removeItem('bingwa_session_loaded');
      }
      return { forcePreloaderKey: state.forcePreloaderKey + 1 };
    }),
  setSelectedVehicleModal: (selectedVehicleModal) => set({ selectedVehicleModal }),

  setActiveAdminRole: (activeAdminRole) => set({ activeAdminRole }),

  updateOwnerLockedPrice: ({ vehicleId, newPriceTzs, reason }) => {
    const state = get();
    if (state.activeAdminRole !== 'owner') {
      return {
        success: false,
        error:
          state.locale === 'sw'
            ? 'Ruhusa imekataliwa: Mmiliki Mkuu (Executive Owner) pekee ndiye anayeruhusiwa kubadili bei.'
            : 'Access Denied: Strict Owner-Controlled Price Policy requires Executive Owner role.',
      };
    }

    const target = state.vehicles.find((v) => v.id === vehicleId);
    if (!target) {
      return { success: false, error: 'Vehicle not found' };
    }

    const nowStamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' EAT';
    const pseudoHash =
      'SHA256:' +
      Math.abs(
        Array.from(`${vehicleId}|${newPriceTzs}|${reason}|${nowStamp}`).reduce(
          (acc, ch) => (acc << 5) - acc + ch.charCodeAt(0),
          0
        )
      )
        .toString(16)
        .padStart(16, '9f86d081')
        .slice(0, 32);

    const newLog: PriceAuditLogEntry = {
      id: `aud-${Date.now()}`,
      vehicleVin: target.vin,
      vehicleTitle: `${target.year} ${target.title}`,
      oldPriceTzs: target.priceTzs,
      newPriceTzs,
      modifiedByUserId: 'usr-owner-01',
      modifiedByName: 'H. Mwakasege (Executive Owner)',
      modifiedByRole: 'owner',
      reason,
      signatureHash: pseudoHash,
      timestamp: nowStamp,
    };

    const updatedVehicles = state.vehicles.map((v) =>
      v.id === vehicleId
        ? {
            ...v,
            priceTzs: newPriceTzs,
            priceAudit: {
              ...v.priceAudit,
              hash: pseudoHash,
              verifiedAt: nowStamp,
            },
          }
        : v
    );

    set({
      vehicles: updatedVehicles,
      priceAuditLogs: [newLog, ...state.priceAuditLogs],
    });

    return { success: true };
  },

  createTransferRequest: ({ vehicleId, destinationBranch, customerName, notes }) => {
    const state = get();
    const vehicle = state.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return null;

    const sourceBranch: 'mwenge' | 'mikocheni' =
      vehicle.branchId === 'mikocheni' ? 'mikocheni' : 'mwenge';

    const nowStamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' EAT';
    const newTransfer: InterBranchTransferRecord = {
      id: `TRF-2026-${Math.floor(100 + Math.random() * 899)}`,
      vehicleId: vehicle.id,
      vehicleVin: vehicle.vin,
      vehicleTitle: `${vehicle.year} ${vehicle.title}`,
      sourceBranch,
      destinationBranch,
      initiatingUser: 'Client / Branch Viewing Desk',
      authorizingUser: null,
      customerName,
      status: 'PENDING_AUTHORIZATION',
      requestedAt: nowStamp,
      updatedAt: nowStamp,
      notes,
      conditionChecklistPassed: false,
    };

    set({ transfers: [newTransfer, ...state.transfers] });
    return newTransfer;
  },

  advanceTransferStatus: (transferId, nextStatus, actorName) => {
    const state = get();
    const nowStamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' EAT';
    const targetTransfer = state.transfers.find((t) => t.id === transferId);
    if (!targetTransfer) return;

    const updatedTransfers = state.transfers.map((t) =>
      t.id === transferId
        ? {
            ...t,
            status: nextStatus,
            authorizingUser: actorName,
            updatedAt: nowStamp,
            conditionChecklistPassed:
              nextStatus === 'RECEIVED_AND_VERIFIED' ? true : t.conditionChecklistPassed,
          }
        : t
    );

    // Only flip active branch ownership on the vehicle when RECEIVED_AND_VERIFIED
    let updatedVehicles = state.vehicles;
    if (nextStatus === 'RECEIVED_AND_VERIFIED') {
      updatedVehicles = state.vehicles.map((v) =>
        v.id === targetTransfer.vehicleId
          ? {
              ...v,
              branchId: targetTransfer.destinationBranch,
              branchLabel:
                targetTransfer.destinationBranch === 'mikocheni'
                  ? {
                      sw: 'Mikocheni Showroom (Bagamoyo Rd)',
                      en: 'Mikocheni Showroom (Bagamoyo Rd)',
                    }
                  : {
                      sw: 'Mwenge Central Yard (Morogoro Rd)',
                      en: 'Mwenge Central Yard (Morogoro Rd)',
                    },
            }
          : v
      );
    }

    set({
      transfers: updatedTransfers,
      vehicles: updatedVehicles,
    });
  },

  updateCustomsMilestone: ({
    trackingCode,
    customsStage,
    currentStep,
    blNumber,
    tansadNumber,
    traDutyAmountTzs,
  }) => {
    const state = get();
    const existing = state.customsShipments[trackingCode];
    if (!existing) return;

    const updated: CustomsShipment = {
      ...existing,
      customsStage,
      currentStep,
      blNumber: blNumber ?? existing.blNumber,
      tansadNumber: tansadNumber ?? existing.tansadNumber,
      traDutyAmountTzs: traDutyAmountTzs ?? existing.traDutyAmountTzs,
    };

    set({
      customsShipments: {
        ...state.customsShipments,
        [trackingCode]: updated,
      },
    });
  },

  updateUserRoleAndBranch: (userId, role, branchId) => {
    const state = get();
    const branchLabelMap: Record<BranchId, string> = {
      all: 'All Branches (Executive Super-Admin)',
      mwenge: 'Mwenge Central Yard',
      mikocheni: 'Mikocheni Flagship Showroom',
      transit: 'Dar Port & TRA Customs Desk',
    };

    set({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              role,
              branchId,
              branchName: branchLabelMap[branchId],
            }
          : u
      ),
    });
  },
}));
