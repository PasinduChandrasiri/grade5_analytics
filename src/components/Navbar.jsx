"use client";

import React from "react";
import { Calculator, Download, Sparkles, RefreshCw } from "lucide-react";
import { TEMPLATE_CSV_CONTENT, downloadCsvFile } from "@/lib/sampleData";

export default function Navbar({ onLoadSample, hasData, onReset }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-bold text-base sm:text-lg text-slate-100 tracking-tight truncate">
                MathLikert<span className="text-cyan-400">.Analytics</span>
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                5-Point Scale Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              Mathematics Performance & Likert Scale Evaluation Dashboard
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => downloadCsvFile(TEMPLATE_CSV_CONTENT, "sample_input_template.csv")}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all hover:text-slate-100"
            title="Download formatted sample CSV template"
          >
            <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Download Template</span>
            <span className="sm:hidden">Template</span>
          </button>

          <button
            onClick={onLoadSample}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 shadow-sm shadow-cyan-950 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Load Demo Data</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {hasData && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
