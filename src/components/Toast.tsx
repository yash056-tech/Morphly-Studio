"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function AlertBanner({ type = "info", message, onClose, className = "" }: ToastProps) {
  if (!message) return null;

  const styles = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800/60",
      text: "text-emerald-800 dark:text-emerald-200",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    },
    error: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800/60",
      text: "text-rose-800 dark:text-rose-200",
      icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
    },
    info: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-200 dark:border-indigo-800/60",
      text: "text-indigo-800 dark:text-indigo-200",
      icon: <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />,
    },
  }[type];

  return (
    <div
      className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-sm animate-fade-in ${styles.bg} ${styles.border} ${styles.text} ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {styles.icon}
        <span className="leading-snug">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
