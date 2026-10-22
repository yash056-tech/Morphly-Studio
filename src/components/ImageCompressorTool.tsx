"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Trash2,
  TrendingDown,
  Layers,
  Lock,
  Unlock,
  Maximize2,
  FileDown,
  Palette,
  SunMedium
} from "lucide-react";
import { Dropzone } from "./Dropzone";
import { ProgressBar } from "./ProgressBar";
import { AlertBanner } from "./Toast";
import { 
  compressAndConvertImage, 
  AdvancedCompressionOptions, 
  AdvancedCompressionResult,
  ImageExportFormat,
  CompressionPreset,
  PRESET_CONFIGS
} from "@/lib/imageCompression";
import { formatFileSize, downloadBlob } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const EXPORT_FORMATS: { id: ImageExportFormat; label: string; badge: string }[] = [
  { id: "webp", label: "WebP", badge: "Most Compact" },
  { id: "jpeg", label: "JPEG / JPG", badge: "Universal" },
  { id: "png", label: "PNG", badge: "Lossless / Transparent" },
  { id: "avif", label: "AVIF", badge: "Next-Gen" },
  { id: "ico", label: "ICO", badge: "Favicon" },
  { id: "bmp", label: "BMP", badge: "Raw Bitmap" },
  { id: "pdf", label: "PDF Document", badge: "Print & Share" },
  { id: "svg", label: "SVG Vector", badge: "Scalable" },
];

const PRESETS: { id: CompressionPreset; label: string; desc: string }[] = [
  { id: "web", label: "⚡ Web Optimal", desc: "75% WebP, strip EXIF" },
  { id: "ultra", label: "🗜️ Ultra Compression", desc: "Maximum byte savings" },
  { id: "lossless", label: "💎 Pixel-Perfect Lossless", desc: "100% fidelity" },
  { id: "document", label: "📄 Target Size (200 KB)", desc: "For forms, visas & resumes" },
  { id: "icon", label: "🖼️ Favicon / Icon", desc: "64x64 ICO" },
  { id: "custom", label: "⚙️ Custom Settings", desc: "Manual tuning" },
];

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Settings State
  const [preset, setPreset] = useState<CompressionPreset>("web");
  const [exportFormat, setExportFormat] = useState<ImageExportFormat>("webp");
  const [quality, setQuality] = useState<number>(75);
  const [isLossless, setIsLossless] = useState<boolean>(false);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // Target size mode
  const [targetSizeMode, setTargetSizeMode] = useState<boolean>(false);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(200);

  // Filters
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [stripExif, setStripExif] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);

  // Processing state
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdvancedCompressionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"after" | "before" | "split">("after");
  const { isAuthenticated, openAuthModal, user } = useAuth();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (files.length > 0) {
      const selected = files[0];
      setFile(selected);
      setError(null);
      setResult(null);

      const originalUrl = URL.createObjectURL(selected);
      setOriginalPreview(originalUrl);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
        setCustomWidth(img.naturalWidth);
        setCustomHeight(img.naturalHeight);

        // Run initial compression
        triggerCompression(selected, {
          quality,
          isLossless,
          exportFormat,
          preset,
          targetSizeMode,
          targetSizeKB,
          scalePercent,
          customWidth: undefined,
          customHeight: undefined,
          lockAspectRatio: lockAspect,
          grayscale,
          stripExif,
          brightness,
          contrast,
        });
      };
      img.src = originalUrl;
    }
  };

  const handlePresetSelect = (selectedPreset: CompressionPreset) => {
    setPreset(selectedPreset);
    const cfg = PRESET_CONFIGS[selectedPreset];
    if (cfg.quality !== undefined) setQuality(cfg.quality);
    if (cfg.isLossless !== undefined) setIsLossless(cfg.isLossless);
    if (cfg.exportFormat !== undefined) setExportFormat(cfg.exportFormat);
    if (cfg.scalePercent !== undefined) setScalePercent(cfg.scalePercent);
    if (cfg.grayscale !== undefined) setGrayscale(cfg.grayscale);
    if (cfg.stripExif !== undefined) setStripExif(cfg.stripExif);
    if (cfg.targetSizeMode !== undefined) setTargetSizeMode(cfg.targetSizeMode);
    if (cfg.targetSizeKB !== undefined) setTargetSizeKB(cfg.targetSizeKB);

    if (file) {
      triggerCompression(file, {
        quality: cfg.quality ?? quality,
        isLossless: cfg.isLossless ?? isLossless,
        exportFormat: cfg.exportFormat ?? exportFormat,
        preset: selectedPreset,
        targetSizeMode: cfg.targetSizeMode ?? targetSizeMode,
        targetSizeKB: cfg.targetSizeKB ?? targetSizeKB,
        scalePercent: cfg.scalePercent ?? scalePercent,
        customWidth: cfg.customWidth,
        customHeight: cfg.customHeight,
        lockAspectRatio: lockAspect,
        grayscale: cfg.grayscale ?? grayscale,
        stripExif: cfg.stripExif ?? stripExif,
        brightness,
        contrast,
      });
    }
  };

  const triggerCompression = async (
    targetFile: File,
    opts: AdvancedCompressionOptions
  ) => {
    setIsCompressing(true);
    setProgress(15);
    setError(null);

    try {
      const res = await compressAndConvertImage(targetFile, opts, (p) =>
        setProgress(p)
      );
      setResult(res);
      setProgress(100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Compression failed";
      setError(msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const recompute = (overrides: Partial<AdvancedCompressionOptions> = {}) => {
    if (!file) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      triggerCompression(file, {
        quality,
        isLossless,
        exportFormat,
        preset: "custom",
        targetSizeMode,
        targetSizeKB,
        scalePercent,
        customWidth: customWidth !== originalDims.width ? customWidth : undefined,
        customHeight: customHeight !== originalDims.height ? customHeight : undefined,
        lockAspectRatio: lockAspect,
        grayscale,
        stripExif,
        brightness,
        contrast,
        ...overrides,
      });
    }, 200);
  };

  const handleWidthChange = (val: number) => {
    setCustomWidth(val);
    if (lockAspect && originalDims.width > 0) {
      const ratio = originalDims.height / originalDims.width;
      const newH = Math.round(val * ratio);
      setCustomHeight(newH);
      recompute({ customWidth: val, customHeight: newH });
    } else {
      recompute({ customWidth: val });
    }
  };

  const handleHeightChange = (val: number) => {
    setCustomHeight(val);
    if (lockAspect && originalDims.height > 0) {
      const ratio = originalDims.width / originalDims.height;
      const newW = Math.round(val * ratio);
      setCustomWidth(newW);
      recompute({ customWidth: newW, customHeight: val });
    } else {
      recompute({ customHeight: val });
    }
  };

  const handleDownload = () => {
    if (result && file) {
      const ext = result.format === "jpeg" ? "jpg" : result.format;
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const downloadName = `${baseName}_compressed.${ext}`;
      downloadBlob(result.file, downloadName);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
        });
      } catch {}
    }
  };

  const handleLoadSample = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
    grad.addColorStop(0, "#4f46e5");
    grad.addColorStop(0.35, "#06b6d4");
    grad.addColorStop(0.7, "#ec4899");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1000);

    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 1600,
        Math.random() * 1000,
        Math.random() * 100 + 20,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.35 + 0.1})`;
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Morphly Universal Image Studio", 800, 480);
    ctx.font = "30px sans-serif";
    ctx.fillText("All Compression Algorithms • Convert & Export Any Format", 800, 540);

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], "Morphly_Studio_Sample.jpg", {
          type: "image/jpeg",
        });
        handleFilesSelected([sampleFile]);
      }
    }, "image/jpeg", 0.95);
  };

  const handleReset = () => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setFile(null);
    setOriginalPreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Privacy guarantee banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                All-Options Image Studio • 100% In-Browser & Private
              </h4>
              {isAuthenticated ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Pro Unlimited Active
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Login Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAuthenticated
                ? `Logged in as ${user?.name} • Unlimited batch processing & export to any format enabled.`
                : "Sign in with Mobile Number, Email, or Social to unlock unlimited image compression & conversion."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign In to Unlock</span>
            </button>
          )}

          {!file && (
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Graphic</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {!file && (
        <Dropzone
          title="Upload or Drag & Drop Any Image"
          subtitle="Supports JPG, PNG, WebP, AVIF, BMP, TIFF. Full compression control & export to any format."
          acceptText="any image file (.jpg, .png, .webp, .bmp, .tiff, etc.)"
          acceptedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".gif", ".avif"]}
          maxSizeMB={500}
          onFilesSelected={handleFilesSelected}
          onError={(msg) => setError(msg)}
          icon={<ImageIcon className="w-8 h-8" />}
          className="min-h-[280px]"
        />
      )}

      {file && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Controls Card */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate max-w-sm">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Original: {formatFileSize(file.size)} • {originalDims.width} × {originalDims.height} px
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Different Image</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. Select Compression Profile
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetSelect(p.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                      preset === p.id
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm"
                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold block mb-0.5">{p.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Export Format */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Export Format (Convert to Any Format)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {EXPORT_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      setExportFormat(fmt.id);
                      setPreset("custom");
                      recompute({ exportFormat: fmt.id });
                    }}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      exportFormat === fmt.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs font-bold block">{fmt.label}</span>
                    <span className="text-[9px] opacity-80 block truncate">{fmt.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Granular Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Quality & Target Size */}
              <div className="space-y-4 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Quality & Size Targets
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const newLossless = !isLossless;
                        setIsLossless(newLossless);
                        setPreset("custom");
                        recompute({ isLossless: newLossless });
                      }}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                        isLossless
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white dark:bg-slate-800 text-slate-600 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isLossless ? "Lossless ON" : "Lossy Mode"}
                    </button>
                  </div>
                </div>

                {/* Quality Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Quality:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {isLossless ? "100% (Lossless)" : `${quality}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    disabled={isLossless || targetSizeMode}
                    value={quality}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuality(val);
                      setPreset("custom");
                      recompute({ quality: val });
                    }}
                    className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-indigo-600 cursor-pointer disabled:opacity-40"
                  />
                </div>

                {/* Target File Size Mode (e.g. for government portal max 200 KB) */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={targetSizeMode}
                        onChange={(e) => {
                          setTargetSizeMode(e.target.checked);
                          setPreset("custom");
                          recompute({ targetSizeMode: e.target.checked });
                        }}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <span>Target Exact Max Size (KB)</span>
                    </label>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {targetSizeMode ? `${targetSizeKB} KB` : "Disabled"}
                    </span>
                  </div>

                  {targetSizeMode && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="10"
                          max="20000"
                          value={targetSizeKB}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTargetSizeKB(val);
                            setPreset("custom");
                            recompute({ targetSizeKB: val });
                          }}
                          className="w-28 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <span className="text-xs text-slate-500">KB max threshold</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {[50, 100, 200, 500, 1024].map((kb) => (
                          <button
                            key={kb}
                            onClick={() => {
                              setTargetSizeKB(kb);
                              setPreset("custom");
                              recompute({ targetSizeKB: kb });
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              targetSizeKB === kb
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white dark:bg-slate-800 text-slate-600 border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Dimensions, Filters, Privacy */}
              <div className="space-y-4 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Dimensions & Image Filters
                </span>

                {/* Scale % Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Scale Resolution:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {scalePercent}% ({Math.round(originalDims.width * (scalePercent / 100))} × {Math.round(originalDims.height * (scalePercent / 100))} px)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={scalePercent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setScalePercent(val);
                      setPreset("custom");
                      recompute({ scalePercent: val });
                    }}
                    className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Custom Width x Height */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="space-y-1 flex-1">
                    <label className="text-[11px] text-slate-500 block">Width (px)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <button
                    onClick={() => setLockAspect(!lockAspect)}
                    className="mt-4 p-1.5 rounded text-slate-500 hover:text-indigo-600 transition-colors"
                    title={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  >
                    {lockAspect ? <Lock className="w-4 h-4 text-indigo-600" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <div className="space-y-1 flex-1">
                    <label className="text-[11px] text-slate-500 block">Height (px)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Toggles: Grayscale, Strip EXIF */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={grayscale}
                      onChange={(e) => {
                        setGrayscale(e.target.checked);
                        setPreset("custom");
                        recompute({ grayscale: e.target.checked });
                      }}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Grayscale / B&W</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={stripExif}
                      onChange={(e) => {
                        setStripExif(e.target.checked);
                        setPreset("custom");
                        recompute({ stripExif: e.target.checked });
                      }}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Strip EXIF / Privacy</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results & Metrics Box */}
            {result && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Original File</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {formatFileSize(result.originalSize)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {result.originalWidth} × {result.originalHeight} px
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Compressed File</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {formatFileSize(result.compressedSize)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {result.newWidth} × {result.newHeight} px
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Format Exported</span>
                  <span className="text-base font-bold text-violet-600 dark:text-violet-400 uppercase">
                    .{result.format}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">
                    100% In-Browser
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-slate-400 block mb-0.5">Total Reduction</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-{result.savedPercentage}% saved</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    ({formatFileSize(result.savedBytes)} reduced)
                  </span>
                </div>
              </div>
            )}

            {isCompressing && (
              <ProgressBar
                progress={progress || 50}
                stage="Processing image transformation..."
                subtext="Applying quantization, resolution scaling, and export formatting in WebWorker..."
              />
            )}
          </div>

          {/* Visual Comparison Preview & Download */}
          {result && originalPreview && (
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Preview: Compressed .{result.format.toUpperCase()} vs Original
                  </h4>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("after")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === "after"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Compressed ({formatFileSize(result.compressedSize)})
                  </button>
                  <button
                    onClick={() => setActiveTab("before")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === "before"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Original ({formatFileSize(result.originalSize)})
                  </button>
                  <button
                    onClick={() => setActiveTab("split")}
                    className={`hidden sm:inline-block px-3 py-1 rounded-md transition-all ${
                      activeTab === "split"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Side-by-Side
                  </button>
                </div>
              </div>

              {/* Canvas Preview Area */}
              <div className="rounded-xl overflow-hidden bg-slate-950/5 dark:bg-black/40 border border-slate-200 dark:border-slate-800 p-2">
                {activeTab === "after" && (
                  <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <img
                      src={result.previewUrl}
                      alt="Compressed preview"
                      className="max-h-[450px] w-auto object-contain rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {activeTab === "before" && (
                  <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <img
                      src={originalPreview}
                      alt="Original preview"
                      className="max-h-[450px] w-auto object-contain rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {activeTab === "split" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-center">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Original ({formatFileSize(result.originalSize)})
                      </span>
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="max-h-[350px] w-full object-contain rounded-lg bg-black/10"
                      />
                    </div>
                    <div className="space-y-1.5 text-center">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Compressed .{result.format.toUpperCase()} ({formatFileSize(result.compressedSize)})
                      </span>
                      <img
                        src={result.previewUrl}
                        alt="Compressed"
                        className="max-h-[350px] w-full object-contain rounded-lg bg-black/10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Download Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compressed from {formatFileSize(result.originalSize)} down to{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    {formatFileSize(result.compressedSize)}
                  </strong>{" "}
                  as .{result.format.toUpperCase()}
                </p>

                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .{result.format.toUpperCase()}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
