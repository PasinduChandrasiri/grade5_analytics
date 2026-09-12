"use client";

import React from "react";
import { Calculator, TrendingUp, Award, Activity } from "lucide-react";

export default function KpiSummary({ stats }) {
  if (!stats) return null;

  const {
    meanLikert,
    meanMarks,
    interpretation,
    grade,
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Overall Class Mean (Likert) */}
      <div className="rounded-xl bg-slate-900/90 border border-cyan-500/30 p-5 relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-lg shadow-cyan-950/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Overall Class Mean (Likert)</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Calculator className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-cyan-300">{meanLikert.toFixed(2)}</span>
          <span className="text-xs font-medium text-slate-400">/ 5.00</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${(meanLikert / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Mean Percentage */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 relative overflow-hidden group hover:border-slate-700 transition-all shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean Percentage</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-emerald-400">{meanMarks.toFixed(1)}%</span>
          <span className="text-xs text-slate-400">Average Mark</span>
        </div>
        <p className="text-xs text-slate-500 mt-3">Calculated across {stats.sampleSize} student records</p>
      </div>

      {/* 3. Class Performance Interpretation */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 relative overflow-hidden group hover:border-slate-700 transition-all shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Interpretation</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-black text-indigo-300">{interpretation}</span>
        </div>
        <p className="text-xs text-slate-500 mt-3">Based on Likert mean rating of {meanLikert.toFixed(2)}</p>
      </div>

      {/* 4. Overall Grade */}
      <div className="rounded-xl bg-slate-900/90 border border-amber-500/30 p-5 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-lg shadow-amber-950/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Overall Grade</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-4xl font-black text-amber-300 tracking-tight">{grade}</span>
          <span className="text-xs font-semibold text-amber-400/90 uppercase tracking-wide">Grade Scale Rating</span>
        </div>
        <p className="text-xs text-slate-500 mt-3">Grading Scale: A+ (≥4.5) to E (&lt;2.5)</p>
      </div>

    </div>
  );
}
