"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileType, 
  Image as ImageIcon, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ServerOff, 
  EyeOff, 
  Infinity,
  UserCheck,
  ChevronRight,
  HelpCircle,
  Layers,
  Terminal,
  Sliders,
  Check,
  X,
  FileSpreadsheet,
  FileText,
  Laptop
} from "lucide-react";
import dynamic from "next/dynamic";
import { ToolCard } from "@/components/ToolCard";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";
import { ClientPersonasSection } from "@/components/ClientPersonasSection";
import { useAuth } from "@/lib/auth";

const PdfConverterTool = dynamic(
  () => import("@/components/PdfConverterTool").then((m) => m.PdfConverterTool),
  {
    loading: () => (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Universal Converter Engine...</p>
      </div>
    ),
    ssr: false,
  }
);

const ImageCompressorTool = dynamic(
  () => import("@/components/ImageCompressorTool").then((m) => m.ImageCompressorTool),
  {
    loading: () => (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Image Studio Engine...</p>
      </div>
    ),
    ssr: false,
  }
);

const TOOLS_CONFIG = [
  {
    id: "universal-converter",
    title: "Universal Any-to-Any File Converter",
    description:
      "Cross-convert between PDF, Word (.docx), Excel (.xlsx, .csv), PowerPoint (.pptx), Text, Markdown, HTML, and Images with exact typography and table reconstruction.",
    href: "/pdf-to-word",
    icon: FileType,
    badge: "500MB+ High Capacity",
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    features: [
      "PDF to Word (.docx) with editable tables & layouts",
      "Word, Markdown & Text to clean printable PDF",
      "Spreadsheets (XLSX/CSV) to interactive HTML & JSON",
      "Volatile memory processing with immediate purge",
    ],
  },
  {
    id: "image-studio",
    title: "All-Options Image Studio & Compressor",
    description:
      "Compress in all conceivable ways—Lossless vs Lossy, exact target file size in KB, resolution scaling, grayscale filter—and export to WebP, JPEG, PNG, AVIF, BMP, ICO, and PDF.",
    href: "/image-compressor",
    icon: ImageIcon,
    badge: "100% Client-Side",
    gradient: "from-emerald-500 via-teal-600 to-cyan-600",
    features: [
      "Exact target size matcher (50 KB, 100 KB, 200 KB)",
      "Pixel-perfect lossless & WebP/AVIF next-gen export",
      "Instant side-by-side Before vs After visual preview",
      "Runs entirely in HTML5 Canvas — zero server upload",
    ],
  },
];

const POPULAR_CONVERSIONS = [
  { from: "PDF", to: "DOCX", label: "PDF to Word", desc: "Editable document with tables intact", badge: "Popular" },
  { from: "PNG / JPG", to: "WebP", label: "Image to WebP", desc: "75% smaller size for web speed", badge: "Speed" },
  { from: "DOCX / MD", to: "PDF", label: "Document to PDF", desc: "Publish-ready vector formatting", badge: "Essential" },
  { from: "XLSX / CSV", to: "JSON", label: "Spreadsheet to JSON", desc: "Developer key-value data", badge: "Dev" },
  { from: "JPG / PNG", to: "ICO", label: "Favicon Generator", desc: "Multi-size website icon (.ico)", badge: "Design" },
  { from: "PDF", to: "XLSX", label: "PDF to Excel", desc: "Extract financial tables & statements", badge: "Finance" },
];

const FAQS = [
  {
    q: "Why does Morphly not impose a strict file size barrier?",
    a: "Traditional online converters enforce a low 10MB or 50MB ceiling with restrictive paywalls. Morphly provides all tools 100% free with a simple user registration, allowing authenticated users to freely process files up to 500MB without any payment or hidden fees.",
  },
  {
    q: "How does the Zero-Retention policy work?",
    a: "Your privacy is our baseline. Image compression executes 100% inside your browser using HTML5 Canvas and client-side WebAssembly—your images never leave your computer. For document conversions requiring server execution, files are held temporarily in RAM only during the conversion process and are permanently wiped the instant the download stream starts.",
  },
  {
    q: "Can I convert images to a specific file size limit (e.g., under 200 KB)?",
    a: "Yes! In the Image Studio, toggle 'Target Exact Max Size (KB)' and enter your required threshold (e.g. 50 KB, 100 KB, or 200 KB). The engine uses an iterative binary search algorithm in your browser to calculate the optimal quality factor and scale to match your requirement.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"converter" | "image">("converter");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { isAuthenticated, openAuthModal, user } = useAuth();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern">
        {/* Soft Ambient Light Glow */}
        <div className="ambient-glow" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {isAuthenticated ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>
                  Welcome, <strong>{user?.name}</strong> • Pro Unlimited Active (Zero Size Barrier)
                </span>
              </>
            ) : (
              <>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                <span>
                  Studio-Grade Utilities • Client-Side First • Zero Retention
                </span>
              </>
            )}
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Convert and compress files{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              without compromises.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Bespoke web utilities designed for students, professionals, and creators. Universal any-to-any document conversion and all-options in-browser image compression with strict zero data retention.
          </p>

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            {!isAuthenticated ? (
              <button
                onClick={openAuthModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/25 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign In Free (Unlock 500MB+)</span>
              </button>
            ) : (
              <Link
                href="/pdf-to-word"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/25"
              >
                <span>Launch Universal Converter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/image-compressor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-all"
            >
              <span>Image Studio (All Formats)</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl glass-card">
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">Any ➔ Any</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cross-Format Matrix</div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Infinity className="w-5 h-5 inline" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Zero Size Barriers</div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card">
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">Target KB</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Exact Size Matching</div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card">
              <div className="text-xl sm:text-2xl font-extrabold text-violet-600 dark:text-violet-400">0 ms</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Storage Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Google Ads Leaderboard Slot 1 */}
      <div className="w-full max-w-4xl px-4">
        <GoogleAdSlot format="horizontal" label="Advertisement" />
      </div>

      {/* Primary Tools Grid Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Core Tool Suite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Designed for Speed, Security & Extreme Flexibility
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select a tool below to enter its full-screen workspace with unlimited capacity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6 sm:gap-8">
            {TOOLS_CONFIG.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                badge={tool.badge}
                features={tool.features}
                gradient={tool.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Target Client Ecosystem */}
      <ClientPersonasSection />

      {/* Interactive Popular Format Routes Matrix */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090e]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Instant Conversion Routes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Click any conversion path below to immediately launch the dedicated converter preset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_CONVERSIONS.map((item, idx) => (
              <Link
                key={idx}
                href={item.to === "WebP" || item.to === "ICO" ? "/image-compressor" : "/pdf-to-word"}
                className="p-4 rounded-2xl glass-card hover:border-indigo-400/80 dark:hover:border-indigo-500/80 transition-all group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Preview Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive In-Browser Workspace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Try Any Tool Right Now
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Switch between the tools below to convert documents or compress images directly on this page.
            </p>
          </div>

          {/* Tool switch tabs */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setActiveTab("converter")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "converter"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileType className="w-4 h-4" />
                <span>Universal File Converter</span>
              </button>

              <button
                onClick={() => setActiveTab("image")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "image"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Image Studio</span>
              </button>
            </div>
          </div>

          {/* Active Tool View */}
          <div className="pt-2">
            {activeTab === "converter" && (
              <div className="animate-fade-in">
                <PdfConverterTool />
              </div>
            )}
            {activeTab === "image" && (
              <div className="animate-fade-in">
                <ImageCompressorTool />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Strategic Google Ads Slot 2 */}
      <div className="w-full max-w-4xl px-4">
        <GoogleAdSlot format="horizontal" label="Advertisement" />
      </div>

      {/* Architectural Comparison Table */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090e]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why In-Browser & Ephemeral Processing Wins
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              How Morphly compares to legacy online converters that store your private documents.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-4 px-6">Feature / Capability</th>
                  <th className="py-4 px-6 text-indigo-600 dark:text-indigo-400 font-extrabold">Morphly Platform</th>
                  <th className="py-4 px-6 text-slate-500">Legacy Online Converters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Data Privacy Architecture</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Zero Retention / Local Canvas</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">Files stored on remote servers for 1-24 hours</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">File Size Ceilings</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>500MB+ Unrestricted (100% Free)</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">Blocked at 10MB or 50MB behind paywalls</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Target KB Size Control</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Included (Exact 50/100/200 KB)</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">Basic arbitrary low/med/high quality only</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Cross-Format Document Matrix</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Any ➔ Any (PDF, Word, Excel, PPTX, HTML, Images)</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">Rigid single-directional conversions only</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Queue Waiting Times</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Instant Execution</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">Forced wait queues (e.g. 5-10 min timers)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Knowledge Base & FAQs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clear answers on how your files, privacy, and conversions are handled.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-card overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-indigo-600 dark:text-indigo-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* JSON-LD Schema for Google AdSense & SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Morphly",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            description:
              "Universal file converter and client-side image compression studio with zero data retention.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
    </div>
  );
}
