"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Code2, 
  Calculator, 
  Palette, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  TrendingDown,
  Layers,
  Check,
  Grid3X3,
  MonitorCheck
} from "lucide-react";

export interface SolutionOffering {
  id: string;
  category: string;
  targetAudience: string;
  badge: string;
  icon: React.ElementType;
  imageSrc: string;
  imageAlt: string;
  headline: string;
  description: string;
  whatWeOffer: string[];
  bottleneckSolved: {
    problem: string;
    morphlyFix: string;
  };
  metrics: {
    before: string;
    after: string;
    gain: string;
  };
  toolUrl: string;
  toolActionLabel: string;
  favoriteTool: string;
}

export const SOLUTIONS_CONFIG: SolutionOffering[] = [
  {
    id: "students",
    category: "Students & Exams",
    targetAudience: "College Students & Competitive Exam Aspirants (UPSC / SSC / NEET / JEE / State PSCs)",
    badge: "🇮🇳 Govt & Entrance Exam Suite",
    icon: GraduationCap,
    imageSrc: "/images/clients/student-aspirant.jpg",
    imageAlt: "College students and exam aspirants collaborating with study materials and laptop",
    headline: "What We Offer to Students & Exam Aspirants",
    description: "Format, crop, and compress your application documents to strict government portal limits without rejection or distortion.",
    whatWeOffer: [
      "Exact 20–50 KB Photo Resizer: Binary search compression that matches SSC, UPSC, and NTA criteria instantly.",
      "10–20 KB Applicant Signature Scaler: Dimensioned to 140×60 px with aspect ratio preservation.",
      "Marksheet & Certificate PDF Compressor: Shrink multi-page certificates below 200 KB while keeping text sharp and legible.",
      "100% Client-Side Privacy: Your personal identification photos and admit cards never leave your device."
    ],
    bottleneckSolved: {
      problem: "Government exam portals reject phone photos exceeding 50 KB or signatures exceeding 20 KB.",
      morphlyFix: "Our Target KB matcher iteratively scales quality to hit exactly 48 KB or 18 KB in 0.4 seconds."
    },
    metrics: {
      before: "3.2 MB Phone Camera Photo",
      after: "48 KB Portal-Ready JPG",
      gain: "98.5% Size Reduction"
    },
    toolUrl: "/image-compressor",
    toolActionLabel: "Launch Exam Photo & Signature Resizer",
    favoriteTool: "Image Studio • Target KB Matcher"
  },
  {
    id: "developers",
    category: "Software Engineers",
    targetAudience: "Full-Stack Developers, DevOps & Engineering Teams",
    badge: "💻 Dev & Cloud Engineering Suite",
    icon: Code2,
    imageSrc: "/images/clients/software-engineer.jpg",
    imageAlt: "Software engineers developing code with vertical dual-screen setups",
    headline: "What We Offer to Developers & Software Engineers",
    description: "Studio-grade code formatting and syntax restructuring powered by official AST parsers with zero telemetry.",
    whatWeOffer: [
      "Monaco Editor Engine: Same powerful editor interface as VS Code with minimap, line numbers, and error detection.",
      "Prettier Standalone AST: Mathematically consistent AST parsing for HTML, CSS, JavaScript, TypeScript, JSON, and Python (PEP 8).",
      "Zero Telemetry / Total Code Privacy: Parsing runs 100% locally in browser Web Workers—no proprietary code or API tokens touch any server.",
      "Instant Clipboard Sync: 1-click beautify, validate, and copy formatted output."
    ],
    bottleneckSolved: {
      problem: "Online formatters send proprietary code, API tokens, or customer data to third-party logging servers.",
      morphlyFix: "Morphly bundles Prettier Standalone directly in your browser—zero network requests are made."
    },
    metrics: {
      before: "450 KB Minified API Payload",
      after: "Formatted Prettier / PEP-8 AST",
      gain: "0 ms Server Latency"
    },
    toolUrl: "/code-formatter",
    toolActionLabel: "Launch Monaco Code Formatter",
    favoriteTool: "Monaco Code Beautifier"
  },
  {
    id: "finance",
    category: "CAs & Finance",
    targetAudience: "Chartered Accountants (CAs), Tax Auditors & Finance Consultants",
    badge: "📊 Audit & GST Compliance Suite",
    icon: Calculator,
    imageSrc: "/images/clients/chartered-accountant.jpg",
    imageAlt: "Chartered accountant auditing financial statements and invoices at desk with calculator",
    headline: "What We Offer to CAs & Finance Professionals",
    description: "Deep structural document conversion built for high-stakes financial statements, invoices, and audit filings.",
    whatWeOffer: [
      "PDF to Excel (.xlsx) Grid Conversion: Reconstructs tables, columns, and numeric cells from scanned bank statements and GST invoices.",
      "Strict Zero-Retention Policy: Financial statements, PANs, and GSTINs are processed in RAM and erased immediately upon download.",
      "No 50 MB File Size Bottlenecks: Process comprehensive annual audit reports, multi-year statements, and books of accounts.",
      "PDF to Word (.docx) for Contracts: Editable conversion of financial agreements without scrambled formatting."
    ],
    bottleneckSolved: {
      problem: "Copying tables from bank statement PDFs scrambles columns and drops decimal alignments.",
      morphlyFix: "Deep geometric vector parsing maps PDF lines into native Microsoft Excel XML grids."
    },
    metrics: {
      before: "85-page Statement PDF",
      after: "Structured Excel .xlsx File",
      gain: "100% Grid Cell Retention"
    },
    toolUrl: "/pdf-to-word",
    toolActionLabel: "Convert PDF Statement to Excel",
    favoriteTool: "Universal File Converter (PDF ➔ XLSX)"
  },
  {
    id: "designers",
    category: "Designers & Creators",
    targetAudience: "Digital Creators, UI/UX Designers & Content Producers",
    badge: "🎨 Next-Gen Visual Media Suite",
    icon: Palette,
    imageSrc: "/images/clients/graphic-designer.jpg",
    imageAlt: "Digital content creator in studio with color-calibrated monitors, camera, and microphone",
    headline: "What We Offer to Designers & Content Creators",
    description: "Next-generation image compression and format transcoding engineered for peak web performance and Core Web Vitals.",
    whatWeOffer: [
      "Modern WebP & AVIF Encoding: Reduce image payloads by up to 85% while preserving full alpha transparency and HDR gamuts.",
      "Favicon (.ico) Generator: Create multi-resolution web icon packs (.ico) from any high-res PNG or JPEG.",
      "Resolution & Dimension Scaler: Lock aspect ratio and resize images for YouTube thumbnails, social banners, and hero assets.",
      "Metadata Scrubber: Automatically strips invasive EXIF camera tags and GPS coordinates."
    ],
    bottleneckSolved: {
      problem: "Heavy uncompressed PNGs and legacy JPEGs damage website load speeds (LCP) and waste bandwidth.",
      morphlyFix: "Transcode to next-generation AVIF and WebP with real-time before/after size comparisons."
    },
    metrics: {
      before: "14.8 MB PNG Portfolio Asset",
      after: "820 KB Next-Gen AVIF Image",
      gain: "94.4% Faster LCP Load"
    },
    toolUrl: "/image-compressor",
    toolActionLabel: "Open WebP & AVIF Studio",
    favoriteTool: "All-Options Image Studio"
  },
  {
    id: "corporate",
    category: "Corporate HR & Legal",
    targetAudience: "HR Leaders, Legal Counsels & Operations Managers",
    badge: "🏢 Enterprise Document Suite",
    icon: Building2,
    imageSrc: "/images/clients/corporate-manager.jpg",
    imageAlt: "Corporate operations executive reviewing digital documentation on tablet in office",
    headline: "What We Offer to Corporate Teams & HR",
    description: "High-volume document conversion and text extraction for recruitment, legal contracts, and onboarding paperwork.",
    whatWeOffer: [
      "Bulk Resume PDF to Word (.docx): Edit, annotate, and anonymize applicant CVs without breaking typography or layout.",
      "Zero Storage Risk: Fully GDPR and CCPA compliant ephemeral processing—no employee or candidate records are ever stored.",
      "High Capacity (500 MB+): Convert heavy contract bundles, annual reports, and training decks for free.",
      "Universal Cross-Format Support: Seamlessly switch between PDF, Word, PowerPoint, Markdown, and Text."
    ],
    bottleneckSolved: {
      problem: "Traditional tools charge $20/month per seat and block conversions with low 10 MB file limits.",
      morphlyFix: "Morphly is 100% free with unlimited 500 MB capacity and instant zero-retention processing."
    },
    metrics: {
      before: "Locked 45 MB Candidate Dossier",
      after: "Editable Microsoft Word (.docx)",
      gain: "Zero Per-Seat Fees"
    },
    toolUrl: "/pdf-to-word",
    toolActionLabel: "Convert Candidate Resumes & Contracts",
    favoriteTool: "Universal Document Suite"
  }
];

export function ClientPersonasSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<"spotlight" | "grid">("spotlight");
  const current = SOLUTIONS_CONFIG[activeTab];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/70 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tailored Solutions For Every Field</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            What Morphly Offers{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              For Your Daily Workflow
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Select your field below to explore the dedicated tools, exact size presets, and zero-retention privacy standards Morphly provides for you.
          </p>

          {/* View Mode Switcher */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setViewMode("spotlight")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "spotlight"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MonitorCheck className="w-3.5 h-3.5" />
              <span>Interactive Spotlight</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>View All 5 Offerings</span>
            </button>
          </div>
        </div>

        {/* 5 Prominent Visual Audience Cards (All 5 Images Visible at a Glance) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {SOLUTIONS_CONFIG.map((solution, idx) => {
            const Icon = solution.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={solution.id}
                onClick={() => {
                  setActiveTab(idx);
                  setViewMode("spotlight");
                }}
                className={`group text-left p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected && viewMode === "spotlight"
                    ? "bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02] ring-2 ring-indigo-500/20"
                    : "bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                {/* Photo Header: 100% visible, crisp aspect ratio with direct native img tag */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5 border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${solution.imageSrc}?v=3`}
                    alt={solution.imageAlt}
                    width={400}
                    height={300}
                    loading="eager"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                    <Icon className="w-3 h-3 text-indigo-400" />
                    <span className="hidden sm:inline">{solution.category.split(" ")[0]}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className={`text-xs sm:text-sm font-bold tracking-tight line-clamp-1 ${
                    isSelected && viewMode === "spotlight" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"
                  }`}>
                    {solution.category}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {solution.badge}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* View Mode 1: Interactive Spotlight View */}
        {viewMode === "spotlight" && (
          <div className="rounded-3xl glass-card border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-black/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Full-Size Crisp Image Display (Zero Dark Vignette, Clean Visibility) */}
              <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-900/60 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800/80">
                <div className="space-y-4">
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${current.imageSrc}?v=3`}
                      alt={current.imageAlt}
                      width={640}
                      height={480}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Offering Meta Pill Underneath Image */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/70">
                        {current.badge}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100% Free & Unlimited</span>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                      {current.category}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {current.targetAudience}
                    </p>
                  </div>
                </div>

                {/* Privacy Guarantee Pill */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Client-Side & RAM Only • Zero Storage Retention</span>
                </div>
              </div>

              {/* Right Column: Exact What We Offer & Solved Bottlenecks */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                
                {/* Header Headline & Description */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Dedicated Capabilities</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {current.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {current.description}
                  </p>
                </div>

                {/* What We Offer List (Actionable Bullet Points) */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    What Morphly Includes For You:
                  </span>
                  <div className="space-y-2">
                    {current.whatWeOffer.map((feature, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottleneck Solved: Problem vs Fix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                    <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px] block">
                      The Pain Point
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                      {current.bottleneckSolved.problem}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px] block">
                      How Morphly Solves It
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                      {current.bottleneckSolved.morphlyFix}
                    </p>
                  </div>
                </div>

                {/* Performance Gain Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Typical Input</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{current.metrics.before}</p>
                  </div>

                  <div className="flex items-center text-indigo-500 font-extrabold text-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Morphly Output</span>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{current.metrics.after}</p>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{current.metrics.gain}</span>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Tool: <span className="font-bold text-slate-800 dark:text-slate-200">{current.favoriteTool}</span>
                  </div>

                  <Link
                    href={current.toolUrl}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/20 group"
                  >
                    <span>{current.toolActionLabel}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* View Mode 2: Grid View (All 5 Complete Cards Shown with Photos and Offerings) */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS_CONFIG.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-3xl glass-card border border-slate-200/90 dark:border-slate-800/90 overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  <div>
                    {/* Card Photo Header */}
                    <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${item.imageSrc}?v=3`}
                        alt={item.imageAlt}
                        width={600}
                        height={375}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item.category}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/70 inline-block">
                          {item.badge}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {item.headline}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      {/* Capabilities */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Included Capabilities:
                        </span>
                        {item.whatWeOffer.slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Metric */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">Output Gain:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.metrics.gain}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={item.toolUrl}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm group"
                    >
                      <span>{item.toolActionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
