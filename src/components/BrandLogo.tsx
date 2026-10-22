"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  withLink?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  withLink = true,
  className = "",
}: BrandLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  }[size];

  const textClasses = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight",
  }[size];

  const logoIcon = (
    <div
      className={`relative ${iconDimensions} rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-1 shrink-0 overflow-hidden`}
    >
      {/* Glossy inner container */}
      <div className="w-full h-full rounded-[15px] bg-slate-950/90 dark:bg-[#07090e]/95 backdrop-blur-xl flex items-center justify-center p-1.5">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-110"
        >
          {/* Definitions for rich gradients and subtle glow */}
          <defs>
            <linearGradient id="morphGrad1" x1="2" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="morphGrad2" x1="10" y1="8" x2="34" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#6366F1" />
              <stop offset="1" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background subtle morphing grid node */}
          <rect x="4" y="4" width="28" height="28" rx="8" stroke="url(#morphGrad1)" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="2 3" />

          {/* Morph Fold 1: Ascending Transformation Wave */}
          <path
            d="M8 24C8 17.3726 13.3726 12 20 12C23.5 12 26.5 13.5 28 16"
            stroke="url(#morphGrad1)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Morph Fold 2: Descending Return Wave forming infinity loop */}
          <path
            d="M28 12C28 18.6274 22.6274 24 16 24C12.5 24 9.5 22.5 8 20"
            stroke="url(#morphGrad2)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Core Kinetic Anchor Node */}
          <circle cx="18" cy="18" r="3.2" fill="url(#morphGrad1)" filter="url(#softGlow)" />
          <circle cx="18" cy="18" r="1.6" fill="#FFFFFF" />

          {/* Dynamic Velocity Sparks */}
          <circle cx="28" cy="12" r="2.2" fill="url(#sparkleGrad)" />
          <circle cx="8" cy="24" r="2.2" fill="#38BDF8" />
        </svg>
      </div>
    </div>
  );

  const logoText = showText && (
    <div className="flex items-center gap-1.5">
      <span className={`font-extrabold ${textClasses} text-slate-900 dark:text-white leading-none tracking-tight flex items-center`}>
        Morph<span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">ly</span>
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 leading-none">
        Studio
      </span>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
        {logoIcon}
        {logoText}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {logoIcon}
      {logoText}
    </div>
  );
}
