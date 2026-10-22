"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileType, CheckCircle2, ShieldCheck, Sparkles, HelpCircle, FileText, Check } from "lucide-react";
import { PdfConverterTool } from "@/components/PdfConverterTool";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";

export default function UniversalConverterPage() {
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
                  <FileType className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Universal File & Document Converter
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Convert any file format to any other file format: PDF, Word (<code className="text-indigo-600 dark:text-indigo-400 font-mono">.docx</code>), Excel (<code className="text-indigo-600 dark:text-indigo-400 font-mono">.xlsx, .csv</code>), PowerPoint (<code className="text-indigo-600 dark:text-indigo-400 font-mono">.pptx</code>), Text, Markdown, HTML, and Images with exact layout and table reconstruction.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Retention Active
              </span>
            </div>
          </div>
        </div>

        {/* The Converter Workspace */}
        <PdfConverterTool />

        {/* Responsive Google Ad Placement */}
        <GoogleAdSlot format="horizontal" label="Advertisement" />

        {/* Feature Specs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              1. Any-to-Any Flexibility
            </h4>
            <p>
              Cross-convert between PDF, Word, Excel, PowerPoint, Text, Markdown, HTML, and Images with automatic format detection.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              2. Tables & Geometry Preservation
            </h4>
            <p>
              Reconstructs multi-row, multi-column tables, cell padding, column alignments, typography, and vectors faithfully.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              3. Data Extraction
            </h4>
            <p>
              Extract tabular records from PDFs into editable Excel sheets (.xlsx), CSV files, or structured JSON.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              4. Strict Zero Retention
            </h4>
            <p>
              Conversion executes in isolated ephemeral memory. Original and converted files are immediately purged forever.
            </p>
          </div>
        </div>

        {/* Editorial Guide for AdSense Content Value */}
        <div className="p-6 rounded-3xl glass-card space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>How High-Fidelity PDF to Word Conversion Works</span>
          </h3>
          <p className="leading-relaxed">
            Standard PDF parsers often dump raw unformatted text blocks, losing margins, font weights, and table cell borders. Morphly executes deep geometric parsing: text runs are grouped into paragraphs, font families and sizing metrics are reconstructed into native Word paragraph styles, and table borders are measured and converted into true Microsoft Word XML tables.
          </p>
        </div>
      </div>
    </div>
  );
}
