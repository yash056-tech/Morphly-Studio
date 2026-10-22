"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  ArrowRight, 
  FileType, 
  ImageIcon, 
  Code2, 
  ShieldCheck, 
  Zap, 
  Minimize2,
  Maximize2,
  Trash2
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  actionLink?: {
    text: string;
    href: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hello! I'm your Morphly Help Assistant. How can I assist you with document conversion, image compression, or code formatting today?",
    time: "Just now",
  },
];

const SUGGESTIONS = [
  "🇮🇳 Govt Exam Photo/Signature (SSC/UPSC/NEET)",
  "How to convert PDF to Word (.docx)?",
  "How to compress an image under 100 KB?",
  "Is my uploaded document private?",
  "How to format Python or JSON code?",
  "How to lift the 50MB file size limit?",
];

export function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, openAuthModal, user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateAnswer = (query: string): { text: string; actionLink?: { text: string; href: string } } => {
    const q = query.toLowerCase();

    // PDF to Word / Document Conversion
    if (q.includes("pdf") || q.includes("word") || q.includes("docx") || q.includes("convert") || q.includes("excel") || q.includes("pptx")) {
      return {
        text: "You can convert any document using our Universal File Converter. Upload your PDF, DOCX, XLSX, PPTX, or Markdown file, pick your target export format (such as Word .docx or clean PDF), and click Convert. Original tables, typography, and margins are preserved intact!",
        actionLink: {
          text: "Open Universal Converter",
          href: "/pdf-to-word",
        },
      };
    }

    // Indian Government Exams, Sarkari Portals, SSC, UPSC, NEET, Aadhaar, PAN
    if (
      q.includes("ssc") ||
      q.includes("upsc") ||
      q.includes("neet") ||
      q.includes("jee") ||
      q.includes("sarkari") ||
      q.includes("ibps") ||
      q.includes("gate") ||
      q.includes("aadhaar") ||
      q.includes("pan") ||
      q.includes("signature") ||
      q.includes("passport photo") ||
      q.includes("gst") ||
      q.includes("bank statement")
    ) {
      return {
        text: "For Indian Govt Portals & Exams (SSC, UPSC, NTA NEET, JEE, IBPS, State PSCs, Passport Seva):\n• Passport Photo: Use Image Studio → set 'Target Exact Max Size' to 50 KB (or 20-50 KB range).\n• Signature: Set Target Size to 20 KB (or 10-20 KB range, dimensions 140×60 px).\n• Certificates / Aadhaar / PAN: Convert and compress PDF under 200 KB or 300 KB.\n• Bank Statements / GST: Convert PDF invoices to Excel (.xlsx) in the Universal Converter.",
        actionLink: {
          text: "Open Image Studio (Photo/Signature Resizer)",
          href: "/image-compressor",
        },
      };
    }

    // Image Compression / Target KB
    if (q.includes("image") || q.includes("compress") || q.includes("kb") || q.includes("webp") || q.includes("jpg") || q.includes("png") || q.includes("photo") || q.includes("size")) {
      return {
        text: "Our Image Studio compresses images 100% in your browser. You can choose Lossless mode, manual quality sliders, or check 'Target Exact Max Size (KB)' and type e.g. 50, 100, or 200 KB to meet government portal or resume upload limits. You can also export to WebP, AVIF, JPEG, PNG, or ICO favicons.",
        actionLink: {
          text: "Open Image Studio",
          href: "/image-compressor",
        },
      };
    }

    // Code Formatting
    if (q.includes("code") || q.includes("format") || q.includes("python") || q.includes("json") || q.includes("javascript") || q.includes("prettier") || q.includes("indent")) {
      return {
        text: "The Code Formatter uses the official VS Code Monaco Editor and Prettier Standalone parser. It formats HTML, CSS, JavaScript, TypeScript, JSON, and Python (with official PEP 8 indentation). All parsing executes client-side without sending your code to any remote server.",
        actionLink: {
          text: "Open Code Beautifier",
          href: "/code-formatter",
        },
      };
    }

    // Privacy & Zero Retention
    if (q.includes("private") || q.includes("safe") || q.includes("security") || q.includes("retention") || q.includes("store") || q.includes("save")) {
      return {
        text: "Morphly enforces a strict Zero-Retention policy. Images and source code are processed 100% locally in your browser (HTML5 Canvas & WebAssembly). Heavy document conversions execute in volatile server RAM and are immediately purged the moment your download starts.",
        actionLink: {
          text: "Read Privacy Policy",
          href: "/privacy",
        },
      };
    }

    // Size limit / Login / Registration
    if (q.includes("limit") || q.includes("50mb") || q.includes("login") || q.includes("account") || q.includes("register") || q.includes("email") || q.includes("phone")) {
      return {
        text: isAuthenticated
          ? `You are logged in as ${user?.name} with Pro Unlimited status! You have access to high-capacity conversions up to 500MB+ with zero retention.`
          : "To lift the standard 50MB barrier and convert large files up to 500MB+, simply register or sign in for free with your Email or Mobile Phone. Your registration details and Pro access confirmation will be sent directly to your email.",
        actionLink: {
          text: isAuthenticated ? "Go to Dashboard" : "Sign In / Register Free",
          href: isAuthenticated ? "/" : "/login",
        },
      };
    }

    // Student vs Professional
    if (q.includes("student") || q.includes("professional") || q.includes("who are you") || q.includes("role")) {
      return {
        text: "When registering, you can select whether you are a Student (for academic papers, thesis conversion, and coursework) or a Working Professional (for enterprise documents, high-res web assets, and API payloads). Both tiers receive full Pro Unlimited access for free!",
        actionLink: {
          text: "Manage Account Profile",
          href: "/login",
        },
      };
    }

    // Generic fallback
    return {
      text: "I can help you with: 1) Universal File Conversion (PDF to Word, Excel, Images), 2) All-Options Image Studio (Lossless, Target KB, WebP/AVIF), 3) Monaco Code Formatter (HTML, JS, Python PEP 8), or 4) Privacy & account questions. What would you like to know?",
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAnswer(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionLink: response.actionLink,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-700/50 dark:border-slate-200 cursor-pointer"
          aria-label="Open Help Assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1.5 font-bold text-xs tracking-tight">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
            <span>Help Assistant</span>
          </div>
        </button>
      )}

      {/* Expanded Floating Assistant Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] max-h-[620px] h-[85vh] flex flex-col rounded-3xl glass-card shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Morphly Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online • Instant Answers</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/20 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all font-medium shrink-0 shadow-2xs"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed space-y-2 shadow-xs ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-xs"
                      : "bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  
                  {m.actionLink && (
                    <div className="pt-1">
                      <Link
                        href={m.actionLink.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] border border-indigo-200 dark:border-indigo-800 shadow-xs hover:scale-102 transition-all"
                      >
                        <span>{m.actionLink.text}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  <div
                    className={`text-[9px] text-right ${
                      m.sender === "user" ? "text-indigo-200" : "text-slate-400"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-2">
                <Bot className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                <span className="italic">Assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything (e.g. 'How to convert PDF to Word?')..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
