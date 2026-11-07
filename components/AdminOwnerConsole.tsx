"use client";

import React, { useState } from "react";

interface AdminVehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  branch: string;
  selling_price_tzs: number;
  status: string;
  price_locked_at: string;
}

const mockAdminInventory: AdminVehicle[] = [
  {
    id: "9bf4c01a-8bb2-482a-a9e9-112dfd82a101",
    vin: "JTEBX4FJ80K128911",
    make: "Toyota",
    model: "Land Cruiser Prado TX-L",
    branch: "Mikocheni Flagship Showroom",
    selling_price_tzs: 145000000,
    status: "AVAILABLE",
    price_locked_at: "2026-11-01 09:30 EAT",
  },
  {
    id: "a310bb21-12c8-4791-bd81-341ef909b202",
    vin: "SALWR2V48MA891230",
    make: "Land Rover",
    model: "Range Rover Sport HSE",
    branch: "Mwenge Central Yard",
    selling_price_tzs: 210000000,
    status: "RESERVED",
    price_locked_at: "2026-10-28 14:15 EAT",
  },
];

export default function AdminOwnerConsole() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(mockAdminInventory);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Direct call to Laravel 11 Protected API endpoint
      const response = await fetch(`/api/v1/vehicles/${selectedVehicle.id}/lock-price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bingwa_token") || ""}`,
        },
        body: JSON.stringify({
          new_price_tzs: Number(newPrice),
          change_reason: reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update price. Owner authentication required.");
      }

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === selectedVehicle.id
            ? { ...v, selling_price_tzs: Number(newPrice), price_locked_at: new Date().toLocaleString() }
            : v
        )
      );

      setMessage({ type: "success", text: "Price locked and cryptographic audit record logged successfully." });
      setSelectedVehicle(null);
      setNewPrice("");
      setReason("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error or unauthorized action.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                EXECUTIVE CONSOLE: OWNER PRICE LOCK & MULTI-BRANCH YARDS
              </h1>
            </div>
            <p className="text-neutral-400 text-sm mt-1">
              Authorized personnel only. Direct valuation authority for Mwenge and Mikocheni branches.
            </p>
          </div>
          <span className="bg-neutral-900 border border-neutral-800 text-amber-500 font-mono text-xs px-3 py-1.5 rounded-lg">
            Role: SUPER_ADMIN (Owner)
          </span>
        </div>

        {/* Global Feedback Banner */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                : "bg-rose-950/40 border-rose-500 text-rose-300"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {/* Inventory Table with Owner Controls */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Active Branch Fleet Inventory</h2>
            <span className="text-xs text-neutral-400">{vehicles.length} Vehicles Under Active Lock</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 uppercase text-xs tracking-wider">
                  <th className="p-4">Vehicle Details</th>
                  <th className="p-4">Branch Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Locked Selling Price (TZS)</th>
                  <th className="p-4">Last Verified</th>
                  <th className="p-4 text-right">Owner Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono text-xs">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-800/40 transition">
                    <td className="p-4 font-sans">
                      <div className="font-bold text-white text-sm">{v.make} {v.model}</div>
                      <div className="text-xs text-neutral-400 font-mono">{v.vin}</div>
                    </td>
                    <td className="p-4 font-sans">{v.branch}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                        v.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-400 text-sm">
                      {v.selling_price_tzs.toLocaleString()} TZS
                    </td>
                    <td className="p-4 text-neutral-400">{v.price_locked_at}</td>
                    <td className="p-4 text-right font-sans">
                      <button
                        onClick={() => {
                          setSelectedVehicle(v);
                          setNewPrice(String(v.selling_price_tzs));
                        }}
                        className="bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-200 px-3 py-1.5 rounded-lg font-bold transition border border-neutral-700 cursor-pointer"
                      >
                        Adjust Lock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Price Lock Adjustment */}
        {selectedVehicle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                <h3 className="text-lg font-bold text-white">Adjust Locked Price (Owner Override)</h3>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdatePrice} className="space-y-4 mt-4 text-sm font-sans">
                <div>
                  <span className="text-xs text-neutral-400 uppercase">Target Vehicle</span>
                  <p className="font-bold text-white text-base">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.vin})
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                    New Selling Price (TZS)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                    placeholder="e.g. 150000000"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                    Reason for Adjustment (Mandatory Audit Trail)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none text-xs"
                    placeholder="State justification (e.g., TBS clearing cost adjustments, executive direct reduction)..."
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVehicle(null)}
                    className="w-1/2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-3 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-3 rounded-xl transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Locking..." : "Commit & Lock"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

