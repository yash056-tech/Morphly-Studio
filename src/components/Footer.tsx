import React from "react";
import Link from "next/link";
import { Shield, Lock, Cpu, Heart, CheckCircle2, Megaphone, FileText, HelpCircle, Mail } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#07090e] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand & Privacy Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" />
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                <CheckCircle2 className="w-3 h-3" /> Ephemeral Processing
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Studio-grade web utilities built for developers, designers, and students worldwide.
              Images and source code are compressed and formatted 100% inside your browser. Documents are converted in volatile memory and purged immediately.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Shield className="w-3.5 h-3.5 text-indigo-500" /> Zero File Retention
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Lock className="w-3.5 h-3.5 text-indigo-500" /> Client-Side First
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Unlimited Sizes
              </span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Tools Suite
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/pdf-to-word" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Universal File Converter
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All-Options Image Studio
                </Link>
              </li>
              <li>
                <Link href="/code-formatter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Monaco Code Formatter
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Free Account & Unlimited Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Company & Ethics
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Morphly
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Ad Choices (Google)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policy (Crucial for Google AdSense Approval) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Privacy Policy (GDPR/CCPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cookie Opt-Out Portal
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Report Copyright Issue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Morphly Studio • Built with client-side WebAssembly & zero-retention memory.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
