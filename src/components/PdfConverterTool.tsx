"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  FileCode, 
  ShieldCheck, 
  Sparkles, 
  Trash2,
  FileDown,
  ArrowRight,
  Layers,
  FileType,
  FileSpreadsheet,
  FileImage
} from "lucide-react";
import { Dropzone } from "./Dropzone";
import { ProgressBar } from "./ProgressBar";
import { AlertBanner } from "./Toast";
import { formatFileSize, downloadBlob, sleep } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export interface TargetFormatOption {
  ext: string;
  label: string;
  category: string;
  desc: string;
}

const UNIVERSAL_TARGET_FORMATS: Record<string, TargetFormatOption[]> = {
  pdf: [
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Editable document with formatting & tables" },
    { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Clean extracted plain text" },
    { ext: "html", label: "HTML (.html)", category: "Web", desc: "Formatted web page layout" },
    { ext: "md", label: "Markdown (.md)", category: "Text", desc: "Formatted markdown syntax" },
    { ext: "png", label: "Images (.png)", category: "Image", desc: "High-resolution page render" },
    { ext: "xlsx", label: "Excel (.xlsx)", category: "Spreadsheet", desc: "Extracted data tables & grids" },
    { ext: "csv", label: "CSV (.csv)", category: "Spreadsheet", desc: "Comma-separated table values" },
  ],
  docx: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Standard print & share format" },
    { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Plain unformatted text" },
    { ext: "html", label: "HTML (.html)", category: "Web", desc: "Clean web page representation" },
    { ext: "md", label: "Markdown (.md)", category: "Text", desc: "Structured markdown with headings" },
  ],
  doc: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Standard print & share format" },
    { ext: "docx", label: "Modern Word (.docx)", category: "Document", desc: "Modern OpenXML format" },
    { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Plain text" },
  ],
  xlsx: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Printable tabular report" },
    { ext: "csv", label: "CSV (.csv)", category: "Spreadsheet", desc: "Standard comma-delimited data" },
    { ext: "html", label: "HTML Table (.html)", category: "Web", desc: "Interactive web table" },
    { ext: "json", label: "JSON Data (.json)", category: "Developer", desc: "Structured key-value records" },
    { ext: "md", label: "Markdown (.md)", category: "Text", desc: "Markdown formatted table" },
  ],
  xls: [
    { ext: "xlsx", label: "Modern Excel (.xlsx)", category: "Spreadsheet", desc: "Modern OpenXML spreadsheet" },
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Printable tabular report" },
    { ext: "csv", label: "CSV (.csv)", category: "Spreadsheet", desc: "Standard comma-delimited data" },
  ],
  csv: [
    { ext: "xlsx", label: "Excel (.xlsx)", category: "Spreadsheet", desc: "Formatted Microsoft Excel sheet" },
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Formatted PDF table" },
    { ext: "json", label: "JSON (.json)", category: "Developer", desc: "JSON structured records" },
    { ext: "html", label: "HTML Table (.html)", category: "Web", desc: "Styled HTML data table" },
    { ext: "md", label: "Markdown (.md)", category: "Text", desc: "Markdown table syntax" },
  ],
  pptx: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Presentation slides in PDF" },
    { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Extracted slide contents" },
    { ext: "html", label: "HTML (.html)", category: "Web", desc: "Web slide presentation" },
    { ext: "md", label: "Markdown (.md)", category: "Text", desc: "Markdown presentation notes" },
  ],
  txt: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Clean formatted PDF" },
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Editable Microsoft Word document" },
    { ext: "html", label: "HTML (.html)", category: "Web", desc: "Web page format" },
  ],
  md: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Formatted PDF with headings & lists" },
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Word document with headings" },
    { ext: "html", label: "HTML (.html)", category: "Web", desc: "Clean HTML5 markup" },
    { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Plain text" },
  ],
  html: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Printable PDF document" },
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Editable Microsoft Word document" },
    { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Extracted textual content" },
    { ext: "md", label: "Markdown (.md)", category: "Text", desc: "Markdown syntax" },
  ],
  png: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Document / Scan converted to PDF" },
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Word doc with embedded image" },
    { ext: "jpg", label: "JPEG (.jpg)", category: "Image", desc: "Compressed photographic format" },
    { ext: "webp", label: "WebP (.webp)", category: "Image", desc: "Modern web image format" },
    { ext: "ico", label: "Favicon (.ico)", category: "Image", desc: "Website favicon icon" },
    { ext: "bmp", label: "BMP (.bmp)", category: "Image", desc: "Uncompressed bitmap" },
  ],
  jpg: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Document / Photo converted to PDF" },
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Word doc with picture" },
    { ext: "png", label: "PNG (.png)", category: "Image", desc: "Lossless image format" },
    { ext: "webp", label: "WebP (.webp)", category: "Image", desc: "Ultra-compact web image" },
  ],
  webp: [
    { ext: "pdf", label: "PDF Document (.pdf)", category: "Document", desc: "Converted to PDF document" },
    { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Word document" },
    { ext: "png", label: "PNG (.png)", category: "Image", desc: "Lossless PNG" },
    { ext: "jpg", label: "JPEG (.jpg)", category: "Image", desc: "Universal JPEG" },
  ],
};

const DEFAULT_TARGETS: TargetFormatOption[] = [
  { ext: "pdf", label: "PDF (.pdf)", category: "Document", desc: "Standard PDF" },
  { ext: "docx", label: "Word (.docx)", category: "Document", desc: "Microsoft Word" },
  { ext: "txt", label: "Text (.txt)", category: "Text", desc: "Plain text" },
  { ext: "html", label: "HTML (.html)", category: "Web", desc: "Web markup" },
];

export function PdfConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("docx");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [outputFilename, setOutputFilename] = useState<string>("");
  const [outputSize, setOutputSize] = useState<number>(0);
  const { isAuthenticated, openAuthModal, user } = useAuth();

  const getAvailableTargets = (): TargetFormatOption[] => {
    if (!file) return UNIVERSAL_TARGET_FORMATS.pdf;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return UNIVERSAL_TARGET_FORMATS[ext] || DEFAULT_TARGETS;
  };

  const handleFilesSelected = (files: File[]) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (files.length > 0) {
      const selected = files[0];
      setFile(selected);
      setError(null);
      setConvertedBlob(null);
      setProgress(0);

      const ext = selected.name.split(".").pop()?.toLowerCase() || "";
      const available = UNIVERSAL_TARGET_FORMATS[ext] || DEFAULT_TARGETS;
      if (available.length > 0) {
        setTargetFormat(available[0].ext);
      } else {
        setTargetFormat("pdf");
      }
    }
  };

  const handleLoadSamplePdf = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    try {
      setError(null);
      const res = await fetch("/sample.pdf");
      if (!res.ok) throw new Error("Could not load sample PDF");
      const blob = await res.blob();
      const sampleFile = new File([blob], "Morphly_Sample_Document.pdf", {
        type: "application/pdf",
      });
      handleFilesSelected([sampleFile]);
    } catch {
      setError("Failed to load sample PDF. You can upload any file from your device.");
    }
  };

  const handleConvert = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setProgress(5);
    setStage(`Preparing and parsing ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);

      const progressTimer = (async () => {
        await sleep(300);
        setProgress(25);
        setStage("Analyzing file geometry, font styles & data streams...");
        await sleep(350);
        setProgress(55);
        setStage(`Translating vectors, tables, and content into .${targetFormat.toUpperCase()}...`);
        await sleep(400);
        setProgress(80);
        setStage(`Compiling final .${targetFormat.toUpperCase()} binary...`);
      })();

      const response = await fetch("/api/convert-file", {
        method: "POST",
        body: formData,
      });

      await progressTimer;

      if (!response.ok) {
        let errMessage = "Conversion failed";
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch {
          errMessage = `Server error ${response.status}: Failed to convert`;
        }
        throw new Error(errMessage);
      }

      const blob = await response.blob();
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const finalName = `${baseName}.${targetFormat}`;

      setProgress(100);
      setStage("Conversion complete!");
      setConvertedBlob(blob);
      setOutputFilename(finalName);
      setOutputSize(blob.size);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#4f46e5", "#10b981", "#3b82f6"],
        });
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Conversion failed";
      setError(msg);
      setProgress(0);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedBlob && outputFilename) {
      downloadBlob(convertedBlob, outputFilename);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedBlob(null);
    setProgress(0);
    setError(null);
    setOutputFilename("");
    setOutputSize(0);
  };

  const availableTargets = getAvailableTargets();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Sample Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Universal Any-to-Any File Converter
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
                ? `Logged in as ${user?.name} • 500MB+ high-capacity zero-retention conversion enabled.`
                : "Sign in with Phone, Email, or Social to unlock unlimited 500MB+ file conversions."}
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
              onClick={handleLoadSamplePdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Document</span>
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
          title="Upload or Drag & Drop ANY File"
          subtitle="Supports PDF, Word (.docx), Excel (.xlsx, .csv), PowerPoint (.pptx), Text, Markdown, HTML, and Images"
          acceptText="any file format (.pdf, .docx, .xlsx, .pptx, .csv, .txt, .png, .jpg, etc.)"
          acceptedExtensions={[
            ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".tsv",
            ".pptx", ".ppt", ".txt", ".md", ".html", ".htm", ".json",
            ".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"
          ]}
          maxSizeMB={500}
          onFilesSelected={handleFilesSelected}
          onError={(msg) => setError(msg)}
          icon={<FileType className="w-8 h-8" />}
          className="min-h-[280px]"
        />
      )}

      {file && !convertedBlob && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-sm space-y-6 animate-fade-in">
          {/* File header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/60 dark:border-indigo-900/60">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                  {file.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium uppercase font-mono">
                    .{file.name.split(".").pop() || "FILE"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={isConverting}
              className="self-start sm:self-center p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-40"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Target Format Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Choose Target Export Format
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Converting from <strong className="uppercase font-mono text-indigo-600">.{file.name.split(".").pop()}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableTargets.map((target) => (
                <button
                  key={target.ext}
                  type="button"
                  onClick={() => setTargetFormat(target.ext)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    targetFormat === target.ext
                      ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 dark:text-indigo-200"
                      : "bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {target.label}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {target.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {target.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar during conversion */}
          {isConverting && (
            <div className="py-2">
              <ProgressBar
                progress={progress}
                stage={stage}
                subtext={`Translating document streams, formatting, and tables to .${targetFormat.toUpperCase()}...`}
              />
            </div>
          )}

          {/* Action button */}
          {!isConverting && (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Choose Another File
              </button>
              <button
                onClick={handleConvert}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>Convert to .{targetFormat.toUpperCase()}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {convertedBlob && (
        <div className="p-6 sm:p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm space-y-6 animate-slide-up">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-bold">Successfully Converted to .{targetFormat.toUpperCase()}!</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-slate-500 dark:text-slate-400">Converted File</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {outputFilename}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-slate-600 dark:text-slate-400 px-2">
              <div>
                <span className="block text-slate-400">Original Size</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {file ? formatFileSize(file.size) : "-"}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">Output Size</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatFileSize(outputSize)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Convert Another File</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/25"
            >
              <FileDown className="w-4 h-4" />
              <span>Download .{targetFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
