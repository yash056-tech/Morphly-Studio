"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  Layers, 
  Settings2, 
  FileCode, 
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { AlertBanner } from "./Toast";
import { formatCode, SupportedLanguage, SAMPLE_CODE } from "@/lib/formatters";
import { useAuth } from "@/lib/auth";

// Dynamically import Monaco Editor to avoid SSR conflicts
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading Monaco Editor engine...</span>
      </div>
    </div>
  ),
});

const LANGUAGES: { id: SupportedLanguage; label: string; monacoLang: string }[] = [
  { id: "javascript", label: "JavaScript / TypeScript", monacoLang: "javascript" },
  { id: "html", label: "HTML5", monacoLang: "html" },
  { id: "css", label: "CSS", monacoLang: "css" },
  { id: "json", label: "JSON", monacoLang: "json" },
  { id: "python", label: "Python", monacoLang: "python" },
];

export function CodeFormatterTool() {
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState<string>(SAMPLE_CODE.javascript);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { isAuthenticated, openAuthModal, user } = useAuth();

  // Auto detect system theme for Monaco default
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setEditorTheme(isDark ? "vs-dark" : "light");
  }, []);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setError(null);
    setSuccessMsg(null);
    // If current code is the default sample of previous language, switch to new language sample
    setCode(SAMPLE_CODE[newLang]);
    // Python traditionally prefers 4 spaces
    if (newLang === "python") {
      setIndentSize(4);
    } else {
      setIndentSize(2);
    }
  };

  const handleFormat = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!code || code.trim() === "") {
      setError("Please input or paste code before formatting.");
      return;
    }

    setIsFormatting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formatted = await formatCode(code, language, {
        indentSize,
        useTabs,
      });

      setCode(formatted);
      setSuccessMsg(`Successfully formatted ${language.toUpperCase()} code!`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Formatting failed";
      setError(msg);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleLoadSample = () => {
    setCode(SAMPLE_CODE[language]);
    setError(null);
    setSuccessMsg(`Loaded sample ${language.toUpperCase()} template.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleClear = () => {
    setCode("");
    setError(null);
    setSuccessMsg(null);
  };

  // Code statistics
  const lineCount = code ? code.split("\n").length : 0;
  const charCount = code.length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Privacy guarantee banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Client-Side Prettier & AST Engine
              </h4>
              {isAuthenticated ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Pro Unlimited Active
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Guest Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAuthenticated
                ? `Logged in as ${user?.name} • Priority AST syntax formatting active.`
                : "Syntax formatting runs in the browser via Prettier Standalone and local PEP-8 normalization."}
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
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors shadow-sm shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reset to Sample Template</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {successMsg && (
        <AlertBanner
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
        />
      )}

      {/* Main Formatter Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-sm overflow-hidden">
        {/* Editor Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/50">
          {/* Left: Language selector tabs / dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Language:
            </label>
            <div className="flex flex-wrap gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    language === lang.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  {lang.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Formatting options & Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Indent selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span>Indent:</span>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-transparent font-semibold text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value={2} className="dark:bg-slate-900">2 spaces</option>
                <option value={4} className="dark:bg-slate-900">4 spaces</option>
              </select>
            </div>

            {/* Monaco Theme Switcher */}
            <button
              onClick={() =>
                setEditorTheme(editorTheme === "vs-dark" ? "light" : "vs-dark")
              }
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60"
              title="Toggle Monaco editor light/dark theme"
            >
              {editorTheme === "vs-dark" ? "Dark Theme" : "Light Theme"}
            </button>

            {/* Clear button */}
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Clear editor"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              title="Copy formatted code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Format Button */}
            <button
              onClick={handleFormat}
              disabled={isFormatting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isFormatting ? "animate-spin" : ""}`} />
              <span>{isFormatting ? "Formatting..." : "Format / Beautify"}</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Canvas */}
        <div className="w-full h-[480px]">
          <MonacoEditor
            height="100%"
            language={
              LANGUAGES.find((l) => l.id === language)?.monacoLang || "javascript"
            }
            theme={editorTheme}
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              minimap: { enabled: true, maxColumn: 80 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: indentSize,
              insertSpaces: !useTabs,
              wordWrap: "on",
              padding: { top: 14, bottom: 14 },
              lineNumbersMinChars: 3,
            }}
          />
        </div>

        {/* Editor Bottom Stats Bar */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span className="uppercase font-mono text-[11px] text-indigo-500">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>UTF-8</span>
            <span>•</span>
            <span>Spaces: {indentSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
