import React from "react";
import Link from "next/link";
import { 
  Layers, 
  ShieldCheck, 
  Cpu, 
  ServerOff, 
  Zap, 
  HeartHandshake, 
  ArrowLeft,
  Sparkles,
  Users,
  CheckCircle2
} from "lucide-react";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";

export const metadata = {
  title: "About Us — Morphly",
  description: "Our mission, ephemeral architecture, and commitment to fast, private, client-side digital utilities.",
};

export default function AboutPage() {
  return (
    <div className="w-full flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Morphly Home</span>
      </Link>

      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent Digital Utility Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Tools designed with{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            integrity, speed, and privacy.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Most file conversion tools on the web are bloated with paywalls, 15-minute wait queues, and invasive tracking that uploads your sensitive PDFs and confidential images to unknown servers. Morphly was built to be the antidote.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Client-Side First</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Where others burn cloud bandwidth and log your pictures, our image compressor runs 100% inside your browser using WebAssembly and HTML5 Canvas.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Data Retention</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            For heavy document conversions requiring server execution, our microservice processes files in volatile RAM and purges them immediately upon stream download.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Size Restrictions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We reject the artificial 10MB/50MB bottlenecks common across online converters. Authenticated users get unrestricted 500MB+ processing capacity for free.
          </p>
        </div>
      </div>

      <GoogleAdSlot format="horizontal" label="Advertisement" />

      {/* Story & Team */}
      <div className="p-8 rounded-3xl glass-card space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Who Uses Morphly?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Morphly is actively relied upon by students and applicants preparing government portal photos, university researchers converting multi-table papers to Word, and product designers optimizing high-resolution imagery into next-generation AVIF and WebP formats.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</div>
            <div className="text-[11px] text-slate-500">In-Browser Image Engine</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">0 ms</div>
            <div className="text-[11px] text-slate-500">Data Storage Retention</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="text-xl font-extrabold text-violet-600 dark:text-violet-400">500MB+</div>
            <div className="text-[11px] text-slate-500">High Capacity Tier</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">Free</div>
            <div className="text-[11px] text-slate-500">For Students & Pros</div>
          </div>
        </div>
      </div>
    </div>
  );
}
