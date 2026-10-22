import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";

export const metadata = {
  title: "Terms of Service — Morphly",
  description: "Terms and conditions governing the use of Morphly universal conversion and formatting utilities.",
};

export default function TermsPage() {
  return (
    <div className="w-full flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Morphly</span>
      </Link>

      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last revised: October 22, 2026 • Effective immediately
        </p>
      </div>

      <div className="prose dark:prose-invert prose-slate max-w-none text-sm leading-relaxed space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p className="text-slate-600 dark:text-slate-300">
            By accessing or using Morphly (https://morphly.pro), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Acceptable Use License</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Morphly grants you a personal, non-exclusive, non-transferable, revocable license to use our web-based tools for personal, academic, and commercial purposes. You agree NOT to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <li>Use the services to process, convert, or distribute illegal content or materials that violate intellectual property rights.</li>
            <li>Attempt to reverse engineer or extract the source code of our backend microservices without authorization.</li>
            <li>Interfere with or disrupt the integrity or performance of the servers and network infrastructure.</li>
            <li>Deploy automated scrapers, bots, or excessive load generating attacks against our API endpoints.</li>
          </ul>
        </section>

        <GoogleAdSlot format="horizontal" label="Advertisement" />

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Intellectual Property Rights & Content Ownership</h2>
          <p className="text-slate-600 dark:text-slate-300">
            <strong>You retain 100% ownership of all files, images, code, and documents you process through Morphly.</strong> Morphly claims no intellectual property rights over any materials processed. Because our processing architecture is ephemeral and zero-retention, we do not store copies of your intellectual property.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties</h2>
          <p className="text-slate-600 dark:text-slate-300">
            The materials and tools on Morphly are provided on an &apos;as is&apos; basis. Morphly makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Governing Law</h2>
          <p className="text-slate-600 dark:text-slate-300">
            These terms and conditions are governed by and construed in accordance with the laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>
      </div>
    </div>
  );
}
