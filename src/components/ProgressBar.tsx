"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ProgressBarProps {
  progress: number; // 0 to 100
  stage?: string;
  subtext?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  progress,
  stage = "Processing...",
  subtext,
  showPercent = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
          <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span>{stage}</span>
        </div>
        {showPercent && (
          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {clamped}%
          </span>
        )}
      </div>

      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200/60 dark:border-slate-700/60 p-[2px]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-300 ease-out shadow-sm shadow-indigo-500/20"
          style={{ width: `${clamped}%` }}
        />
      </div>

      {subtext && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center animate-pulse">
          {subtext}
        </p>
      )}
    </div>
  );
}
