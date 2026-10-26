"use client";

import React, { useState } from "react";
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ShieldCheck,
  UserCheck,
  Send
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export function EmailPreviewModal() {
  const { isEmailModalOpen, closeEmailModal, latestEmail } = useAuth();
  const [recipientTab, setRecipientTab] = useState<"admin" | "user">("admin");
  const [viewMode, setViewMode] = useState<"html" | "text">("html");
  const [copied, setCopied] = useState(false);

  if (!isEmailModalOpen || !latestEmail) return null;

  const currentEmailTo = recipientTab === "admin" 
    ? (latestEmail.adminTo || "ya09shu@gmail.com") 
    : latestEmail.to;

  const currentSubject = recipientTab === "admin" 
    ? latestEmail.subject 
    : (latestEmail.userSubject || latestEmail.subject);

  const currentHtml = recipientTab === "admin" 
    ? latestEmail.html 
    : (latestEmail.userHtml || latestEmail.html);

  const currentText = recipientTab === "admin" 
    ? latestEmail.text 
    : (latestEmail.userText || latestEmail.text);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl backdrop-blur-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Email Dispatch Confirmation
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Dispatched
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mailed to <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentEmailTo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeEmailModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Admin Copy vs User Copy */}
        <div className="px-5 pt-3 pb-2 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setRecipientTab("admin")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                recipientTab === "admin"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Admin Alert (ya09shu@gmail.com)</span>
            </button>

            <button
              onClick={() => setRecipientTab("user")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                recipientTab === "user"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>User Confirmation ({latestEmail.to})</span>
            </button>
          </div>

          <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-[11px] font-medium">
            <button
              onClick={() => setViewMode("html")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === "html"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Rendered HTML
            </button>
            <button
              onClick={() => setViewMode("text")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === "text"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Plain Text
            </button>
          </div>
        </div>

        {/* Email Meta Info Bar */}
        <div className="px-5 py-2.5 bg-indigo-50/40 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate max-w-md">
            <span className="font-semibold text-indigo-900 dark:text-indigo-200">Subject:</span>
            <span className="text-slate-700 dark:text-slate-300 truncate">{currentSubject}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" /> {latestEmail.sentAt}
            </span>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-950/40 min-h-[300px]">
          {viewMode === "html" ? (
            <div 
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white shadow-sm overflow-hidden text-slate-900"
              dangerouslySetInnerHTML={{ __html: currentHtml }}
            />
          ) : (
            <pre className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-sm">
              {currentText}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Mailed to ya09shu@gmail.com & User via Morphly Lead Dispatcher</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Details"}</span>
            </button>

            <button
              onClick={closeEmailModal}
              className="px-4 py-1.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
