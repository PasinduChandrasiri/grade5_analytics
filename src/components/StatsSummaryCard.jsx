"use client";

import React from "react";
import { ClipboardList, Hash, TrendingUp, TrendingDown, BarChart2, Layers } from "lucide-react";

/**
 * StatsSummaryCard
 * Displays the complete Data Aggregation summary:
 *  1. Frequency Distribution (raw count & percentage per Likert level)
 *  2. Overall Mean Performance Score
 *  3. Class Performance Interpretation with band
 *  4. Overall School Grade with scale
 *  5. Statistical Summary (Sample Size, Highest Mark, Lowest Mark, Mean Percentage)
 */
export default function StatsSummaryCard({ stats }) {
  if (!stats) return null;

  const {
    sampleSize,
    meanLikert,
    meanMarks,
    minMark,
    maxMark,
    grade,
    interpretation,
    distribution,
  } = stats;

  // Grade badge colour lookup
  const gradeColor = {
    "A+": "text-emerald-300 bg-emerald-500/15 border-emerald-500/40",
    "A":  "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    "B":  "text-cyan-400    bg-cyan-500/10    border-cyan-500/30",
    "C":  "text-indigo-400  bg-indigo-500/10  border-indigo-500/30",
    "D":  "text-amber-400   bg-amber-500/10   border-amber-500/30",
    "E":  "text-rose-400    bg-rose-500/10    border-rose-500/30",
  }[grade] ?? "text-slate-300 bg-slate-700/30 border-slate-600/30";

  // Interpretation badge colour
  const interpretationColor = {
    "Excellent":    "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    "Very Good":    "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    "Good":         "text-cyan-400    bg-cyan-500/10    border-cyan-500/30",
    "Satisfactory": "text-indigo-400  bg-indigo-500/10  border-indigo-500/30",
    "Poor":         "text-amber-400   bg-amber-500/10   border-amber-500/30",
    "Very Poor":    "text-rose-400    bg-rose-500/10    border-rose-500/30",
  }[interpretation] ?? "text-slate-300 bg-slate-700/30 border-slate-600/30";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── LEFT: Frequency Distribution Table ── */}
      <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Frequency Distribution</h3>
          <span className="ml-auto text-xs font-mono text-slate-500">N = {sampleSize}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Score</th>
                <th className="py-2.5 px-4">Label</th>
                <th className="py-2.5 px-4">Range</th>
                <th className="py-2.5 px-4 text-right">Count</th>
                <th className="py-2.5 px-4 text-right">Percentage</th>
                <th className="py-2.5 px-4">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {distribution.map((item) => (
                <tr key={item.score} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs border"
                      style={{
                        backgroundColor: `${item.color}18`,
                        color: item.color,
                        borderColor: `${item.color}45`,
                      }}
                    >
                      {item.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{item.label}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.rangeLabel}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-100 tabular-nums">
                    {item.count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums" style={{ color: item.color }}>
                    {item.percentage}%
                  </td>
                  <td className="py-3 px-4 w-32">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-slate-950/60 border-t-2 border-slate-700">
                <td colSpan={3} className="py-2.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total
                </td>
                <td className="py-2.5 px-4 text-right font-black text-slate-100 tabular-nums">
                  {sampleSize}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-slate-300 tabular-nums">
                  100%
                </td>
                <td className="py-2.5 px-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT: Stats Summary + Performance + Grade ── */}
      <div className="flex flex-col gap-4">

        {/* Statistical Summary */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ClipboardList className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-100">Statistical Summary</h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Hash className="w-3.5 h-3.5 text-slate-500" /> Sample Size
              </span>
              <strong className="text-slate-100 font-mono tabular-nums">{sampleSize} students</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Highest Mark
              </span>
              <strong className="text-emerald-400 font-mono tabular-nums">{maxMark.toFixed(1)}%</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-400">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Lowest Mark
              </span>
              <strong className="text-rose-400 font-mono tabular-nums">{minMark.toFixed(1)}%</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-400">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> Mean Percentage
              </span>
              <strong className="text-cyan-300 font-mono tabular-nums">{meanMarks.toFixed(2)}%</strong>
            </div>
          </div>
        </div>

        {/* Class Performance Interpretation */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-3">
          <h4 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
            Class Performance Interpretation
          </h4>
          <div className="space-y-2 text-xs text-slate-400">
            {[
              { range: "4.50 – 5.00", label: "Excellent" },
              { range: "3.50 – 4.49", label: "Good" },
              { range: "2.50 – 3.49", label: "Satisfactory" },
              { range: "1.50 – 2.49", label: "Poor" },
              { range: "1.00 – 1.49", label: "Very Poor" },
            ].map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all ${
                  row.label === interpretation
                    ? `${interpretationColor} font-bold`
                    : "border-transparent text-slate-500"
                }`}
              >
                <span className="font-mono">{row.range}</span>
                <span className="font-semibold">{row.label}</span>
              </div>
            ))}
          </div>
          <div className={`mt-2 flex items-center justify-between px-3 py-2 rounded-xl border font-bold text-sm ${interpretationColor}`}>
            <span>Current Result:</span>
            <span>{interpretation} ({meanLikert.toFixed(2)})</span>
          </div>
        </div>

        {/* Overall School Grade */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-3">
          <h4 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
            Overall School Grade
          </h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            {[
              { range: "4.50 – 5.00", g: "A+" },
              { range: "4.00 – 4.49", g: "A" },
              { range: "3.50 – 3.99", g: "B" },
              { range: "3.00 – 3.49", g: "C" },
              { range: "2.50 – 2.99", g: "D" },
              { range: "Below 2.50",  g: "E" },
            ].map((row) => (
              <div
                key={row.g}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all ${
                  row.g === grade
                    ? `${gradeColor} font-bold`
                    : "border-transparent text-slate-500"
                }`}
              >
                <span className="font-mono">{row.range}</span>
                <span className="font-black text-sm">{row.g}</span>
              </div>
            ))}
          </div>
          <div className={`mt-2 flex items-center justify-between px-3 py-2 rounded-xl border font-bold text-sm ${gradeColor}`}>
            <span>Assigned Grade:</span>
            <span className="text-2xl font-black">{grade}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
