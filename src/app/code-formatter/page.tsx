"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Code2, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { CodeFormatterTool } from "@/components/CodeFormatterTool";
import { GoogleAdSlot } from "@/components/GoogleAdSlot";

export default function CodeFormatterPage() {
  return (
    <div className="w-full flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="max-w-6xl mx-auto space-y-8">
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
                  <Code2 className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Code Formatter & Beautifier
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Format and beautify HTML, CSS, JavaScript, JSON, and Python using the Monaco Editor engine and Prettier Standalone with custom indentation.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Monaco Editor Engine
              </span>
            </div>
          </div>
        </div>

        {/* The Formatter Workspace */}
        <CodeFormatterTool />

        {/* Responsive Google Ad Placement */}
        <GoogleAdSlot format="horizontal" label="Advertisement" />

        {/* Feature Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              1. Full VS Code Engine
            </h4>
            <p>
              Integrated Monaco editor with minimap, syntax highlighting, bracket matching, line numbers, and keyboard shortcuts.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              2. Prettier Standalone (Browser)
            </h4>
            <p>
              Parses the Abstract Syntax Tree (AST) client-side for HTML, CSS, JavaScript, and JSON to enforce standard conventions.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200">
              3. PEP 8 Python Beautification
            </h4>
            <p>
              Standardizes Python indentation, imports, and spacing according to official PEP 8 style guides.
            </p>
          </div>
        </div>

        {/* Editorial Guide */}
        <div className="p-6 rounded-3xl glass-card space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>Client-Side AST Parsing vs Regular Expression Regex Reformatters</span>
          </h3>
          <p className="leading-relaxed">
            Many generic code formatters rely on naive regex string matching, which often breaks inside template literals, multi-line strings, or JSX elements. Morphly bundles Prettier Standalone with the Babel and PostCSS parsers, analyzing code as a full Abstract Syntax Tree (AST) before re-printing it with mathematically consistent indentation and line breaks.
          </p>
        </div>
      </div>
    </div>
  );
}
