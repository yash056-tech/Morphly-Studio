import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  features: string[];
  gradient: string;
  ctaText?: string;
}

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  features,
  gradient,
  ctaText = "Open Workspace",
}: ToolCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-3xl glass-card p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
      {/* Subtle organic light accent on card hover */}
      <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
            {badge}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-normal">
          {description}
        </p>

        {/* Features Checklist */}
        <ul className="space-y-2.5 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/60 dark:border-indigo-800/60">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <Link
        href={href}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm group-hover:shadow-md group-hover:shadow-indigo-500/20"
      >
        <span>{ctaText}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
