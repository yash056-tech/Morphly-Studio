import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Cookie, ServerOff, ArrowLeft } from "lucide-react";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";

export const metadata = {
  title: "Privacy Policy — Morphly",
  description: "Learn how Morphly protects your privacy with strict zero-retention ephemeral processing and client-side execution.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Morphly</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Strict Zero-Retention Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last revised: October 22, 2026 • Effective immediately
        </p>
      </div>

      <div className="prose dark:prose-invert prose-slate max-w-none text-sm leading-relaxed space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Core Philosophy: Client-Side First & Zero-Retention</h2>
          <p className="text-slate-600 dark:text-slate-300">
            At Morphly (accessible from https://morphly.pro), one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by Morphly and how we treat uploaded data.
          </p>
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <ServerOff className="w-4 h-4 text-indigo-500" />
              <span>Zero-Storage Guarantee</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>We do not retain, index, inspect, share, or sell your files.</strong> Image compression executes 100% locally in your web browser using HTML5 Canvas and WebAssembly. Document conversions running on our server are held in volatile RAM only for the duration of the conversion and are instantly and irrevocably unlinked from storage.
            </p>
          </div>
        </section>

        {/* Ad Placement */}
        <GoogleAdSlot format="horizontal" label="Advertisement" />

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Third-Party Advertising & Google AdSense Disclosures</h2>
          <p className="text-slate-600 dark:text-slate-300">
            To provide our universal tools for free to students, developers, and professionals worldwide, Morphly may partner with third-party advertising networks, including <strong>Google AdSense</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <li>
              <strong>Google DART Cookie:</strong> Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to morphly.pro and other sites on the internet.
            </li>
            <li>
              <strong>Opt-Out Options:</strong> Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">https://policies.google.com/technologies/ads</a>.
            </li>
            <li>
              You can also manage or opt out of personalized advertising globally via the Network Advertising Initiative (NAI) opt-out page or the Digital Advertising Alliance (DAA) portal at <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">aboutads.info</a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Cookies and Web Beacons</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Like any other modern web application, Morphly uses browser local storage for saving user session preferences (such as Dark Mode theme choice, recent conversion history, and logged-in account status). We do not use persistent tracking cookies or invasive cross-site profiling trackers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. GDPR Data Protection Rights</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We want to ensure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> Because our processing is ephemeral, your document contents are erased the moment conversion completes.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request restriction of personal data processing under certain conditions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            <li>Request that a business disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data. <strong>Morphly does not sell personal information or files.</strong></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Contact Us</h2>
          <p className="text-slate-600 dark:text-slate-300">
            If you have any questions, suggestions, or concerns regarding this Privacy Policy or our file handling methods, please contact us at <a href="mailto:privacy@morphly.pro" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">privacy@morphly.pro</a> or visit our <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
