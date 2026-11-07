"use client";

import React, { useEffect, useState } from "react";
import { useBingwaStore } from "@/lib/store";

export interface StartupLoaderProps {
  onComplete?: () => void;
}

export default function StartupLoader({ onComplete }: StartupLoaderProps) {
  const { forcePreloaderKey } = useBingwaStore();
  const [progress, setProgress] = useState<number>(0);
  const [rpm, setRpm] = useState<number>(850);
  const [gear, setGear] = useState<number>(1);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);

  useEffect(() => {
    // 1. Session Intelligence: Check if the preloader was already seen in this session
    const hasSeenLoader = sessionStorage.getItem("bingwa_loader_seen");
    if (hasSeenLoader === "true" && forcePreloaderKey === 0) {
      setIsUnmounted(true);
      onComplete?.();
      return;
    }

    setIsUnmounted(false);
    setIsFadingOut(false);
    setProgress(0);
    setRpm(850);
    setGear(1);

    let currentProgress = 0;
    let tickTimeout: ReturnType<typeof setTimeout> | null = null;
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;
    let unmountTimeout: ReturnType<typeof setTimeout> | null = null;

    // 2. Dynamic Acceleration Simulation (Non-Linear Revving Curve)
    const stepRevvingCounter = () => {
      let increment = 1;
      let delayMs = 38;

      if (currentProgress < 40) {
        // Steady 1st–2nd gear launch (0% -> 39%)
        increment = Math.floor(Math.random() * 3) + 2;
        delayMs = 42;
        setGear(currentProgress < 20 ? 1 : 2);
      } else if (currentProgress < 85) {
        // Rapid turbo-boost acceleration (40% -> 84%)
        increment = Math.floor(Math.random() * 6) + 5;
        delayMs = 26;
        setGear(currentProgress < 62 ? 3 : 4);
      } else {
        // Smooth top-end taper into 100% (85% -> 100%)
        increment = Math.floor(Math.random() * 3) + 2;
        delayMs = 36;
        setGear(currentProgress < 94 ? 5 : 6);
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      // Compute realistic engine tachometer RPM
      const simulatedRpm =
        currentProgress < 100
          ? Math.min(
              7200,
              Math.round(1100 + (currentProgress / 100) * 5600 + (currentProgress % 7) * 65)
            )
          : 1200;
      setRpm(simulatedRpm);

      if (currentProgress < 100) {
        tickTimeout = setTimeout(stepRevvingCounter, delayMs);
      } else {
        // 3. Persist session flag & hold at 100% for 250ms before fade-out
        sessionStorage.setItem("bingwa_loader_seen", "true");

        holdTimeout = setTimeout(() => {
          setIsFadingOut(true);

          // 4. Complete DOM teardown after 600ms opacity transition
          unmountTimeout = setTimeout(() => {
            setIsUnmounted(true);
            onComplete?.();
          }, 600);
        }, 250);
      }
    };

    tickTimeout = setTimeout(stepRevvingCounter, 45);

    return () => {
      if (tickTimeout) clearTimeout(tickTimeout);
      if (holdTimeout) clearTimeout(holdTimeout);
      if (unmountTimeout) clearTimeout(unmountTimeout);
    };
  }, [forcePreloaderKey, onComplete]);

  if (isUnmounted) return null;

  const statusText =
    progress < 42
      ? "Initializing Showroom..."
      : progress < 86
      ? "Preparing 3D Inspection..."
      : "Verifying Owner-Locked Valuation...";

  // SVG Tachometer Ring Math
  const radius = 104;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progress / 100) * (circumference * 0.75);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Bingwa Cars Startup Odometer Preloader"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 px-6 text-white select-none transition-opacity duration-600 ease-out ${
        isFadingOut
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      }`}
    >
      {/* Hardware-Accelerated Radial Blurs (Deep Gold/Amber #F59E0B & Subtle Crimson Glow) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[28rem] w-[38rem] rounded-full bg-[#F59E0B]/15 blur-[130px] transform-gpu" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/3 h-[22rem] w-[30rem] rounded-full bg-rose-700/10 blur-[120px] transform-gpu" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Main Centered Luxury Studio Cluster */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* Minimalist Luxury Car Silhouette + Circular Tachometer Dial */}
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Outer Studio Ring */}
          <div className="absolute inset-2 rounded-full border border-neutral-800/80 bg-neutral-950/90 shadow-[0_0_70px_rgba(245,158,11,0.12)]" />

          {/* Tachometer SVG Arc */}
          <svg
            className="h-60 w-60 -rotate-[225deg] transform"
            viewBox="0 0 240 240"
          >
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="transparent"
              stroke="url(#bingwaTachGradient)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out"
            />
            <defs>
              <linearGradient
                id="bingwaTachGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Odometer Readout & Minimalist Car Silhouette */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            {/* Minimalist Automotive Silhouette Icon with Breathing Pulse */}
            <svg
              viewBox="0 0 120 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 h-8 w-24 text-amber-500 animate-pulse"
            >
              <path
                d="M12 28L20 26L34 13C38 9.5 44 8 51 8H76C83 8 89 11 94 16L104 24L110 26C112.5 26.8 114 28.5 114 31H6C6 29 8.5 28.2 12 28Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="30"
                cy="31"
                r="5.5"
                className="fill-neutral-950 stroke-amber-400"
                strokeWidth="2.2"
              />
              <circle
                cx="90"
                cy="31"
                r="5.5"
                className="fill-neutral-950 stroke-amber-400"
                strokeWidth="2.2"
              />
            </svg>

            {/* Digital Percentage Odometer Counter (0% to 100%) */}
            <div className="font-mono text-5xl font-black tracking-tighter text-white tabular-nums sm:text-6xl">
              {progress}
              <span className="ml-0.5 text-2xl font-bold text-amber-500">
                %
              </span>
            </div>

            {/* RPM & Gear Shift Sub-Readout */}
            <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
              <span className="text-amber-400 font-bold">G{gear}</span>
              <span>•</span>
              <span>{rpm.toLocaleString()} RPM</span>
            </div>
          </div>
        </div>

        {/* Brand Identity Display */}
        <div className="mt-5 space-y-2">
          <h1 className="text-2xl font-black tracking-[0.25em] text-white sm:text-3xl">
            BINGWA CARS
          </h1>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-500/90 uppercase">
            DAR ES SALAAM • MWENGE &amp; MIKOCHENI YARDS
          </p>
        </div>

        {/* Slim Glowing Progress Line (h-[3px]) */}
        <div className="mt-8 w-full overflow-hidden rounded-full bg-neutral-900 p-0">
          <div
            style={{ width: `${progress}%` }}
            className="h-[3px] rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all duration-75 ease-out"
          />
        </div>

        {/* Live Status Indicator with Animated Ping Dot */}
        <div className="mt-4 flex items-center justify-center gap-2.5 text-xs font-medium tracking-wider text-neutral-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-300">
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
