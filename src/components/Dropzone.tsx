"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, ArrowUpCircle, Lock, Sparkles, Infinity } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface DropzoneProps {
  acceptText: string;
  acceptedExtensions: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  onError?: (errorMessage: string) => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Dropzone({
  acceptText,
  acceptedExtensions,
  maxSizeMB = 500, // High capacity / unlimited
  multiple = false,
  onFilesSelected,
  onError,
  title = "Drag and drop your file here",
  subtitle = "or browse from your computer",
  icon,
  className = "",
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, openAuthModal } = useAuth();

  const validateAndForwardFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    // Check authentication requirement
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = "." + file.name.split(".").pop()?.toLowerCase();

      // Check file extension
      const isValidExtension = acceptedExtensions.some(
        (ext) => ext.toLowerCase() === extension
      );

      if (!isValidExtension) {
        const errorMsg = `Invalid file type "${file.name}". Please upload ${acceptText}.`;
        if (onError) onError(errorMsg);
        return;
      }

      // Check file size limit
      if (file.size > maxSizeBytes) {
        const errorMsg = `File "${file.name}" exceeds the ${maxSizeMB}MB limit (${formatFileSize(file.size)}).`;
        if (onError) onError(errorMsg);
        return;
      }

      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      inputRef.current?.click();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    validateAndForwardFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndForwardFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center select-none overflow-hidden ${
        isDragOver
          ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01] shadow-2xl shadow-indigo-500/10"
          : "border-slate-300 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/70 dark:bg-slate-900/50 hover:bg-slate-50/90 dark:hover:bg-slate-900/80 shadow-sm"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={acceptedExtensions.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Pulsing indicator icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 shadow-sm ${
          isDragOver
            ? "bg-indigo-600 text-white scale-110 rotate-3 shadow-indigo-500/25"
            : !isAuthenticated
            ? "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:scale-105"
            : "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-105"
        }`}
      >
        {icon ? (
          icon
        ) : isDragOver ? (
          <ArrowUpCircle className="w-8 h-8 animate-bounce" />
        ) : !isAuthenticated ? (
          <Lock className="w-8 h-8 text-indigo-500" />
        ) : (
          <UploadCloud className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
        {!isAuthenticated ? "Sign In to Upload & Convert (Unlimited Size)" : title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md">
        {!isAuthenticated
          ? "Click to sign in with Mobile Number, Email, or Social and unlock instant unlimited file processing."
          : subtitle}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Accepted: {acceptText}
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 flex items-center gap-1">
          <Infinity className="w-3 h-3" />
          <span>Unlimited Size (Pro)</span>
        </span>
        {!isAuthenticated && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Sign In Required</span>
          </span>
        )}
      </div>
    </div>
  );
}
