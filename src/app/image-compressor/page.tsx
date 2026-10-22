"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Sparkles, Sliders, Palette } from "lucide-react";
import { ImageCompressorTool } from "@/components/ImageCompressorTool";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";

export default function ImageCompressorPage() {
  return (
    <div className="w-full flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link & Header */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Utilities</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Universal Image Compressor & Converter
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Compress images in all possible ways: Lossless vs Lossy, exact target size (KB), resolution scaling, grayscale, and convert/export to any format (WebP, JPG, PNG, AVIF, BMP, ICO, PDF, SVG). Runs 100% in-browser.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Client-Side Engine
              </span>
            </div>
          </div>
        </div>

        {/* The Compressor Workspace */}
        <ImageCompressorTool />

        {/* Responsive Google Ad Placement */}
        <GoogleAdSlot format="horizontal" label="Advertisement" />

        {/* Feature Specs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              1. All Compression Algorithms
            </h4>
            <p>
              Choose from Web Optimal, Ultra Compression, 100% Lossless, or manual quality sliders with real-time Before/After inspection.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              2. Target Size Matcher
            </h4>
            <p>
              Specify exact KB thresholds (e.g. 50 KB, 100 KB, 200 KB) for strict passport, visa, and government upload forms.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              3. Any Format Export
            </h4>
            <p>
              Convert and download in WebP, JPEG, PNG, AVIF, BMP, ICO (favicon), printable PDF, or SVG formats seamlessly.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              4. Dimension & Filter Studio
            </h4>
            <p>
              Scale resolution with aspect ratio lock, convert to Grayscale / B&W, and strip tracking EXIF metadata for total privacy.
            </p>
          </div>
        </div>

        {/* Editorial Guide */}
        <div className="p-6 rounded-3xl glass-card space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-500" />
            <span>Format Guide: When to Choose WebP, AVIF, or PNG</span>
          </h3>
          <p className="leading-relaxed">
            <strong>WebP</strong> provides ~30% better compression than traditional JPEG while retaining transparency. <strong>AVIF</strong> leverages the AV1 video codec to achieve up to 50% byte savings with rich HDR color gamuts. <strong>PNG</strong> is ideal when mathematical 100% lossless fidelity or crisp high-contrast UI graphics are required. Morphly lets you preview and export in all three formats with a single click.
          </p>
        </div>
      </div>
    </div>
  );
}
