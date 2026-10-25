"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3, Download, Loader2 } from "lucide-react";
import { exportLikertDistributionPdf } from "@/lib/pdfExport";

const CustomTooltip = ({ active, payload, filterContext }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const subj = filterContext?.subject && filterContext.subject !== "all" ? filterContext.subject : "All Subjects";
    const gr = filterContext?.grade && filterContext.grade !== "all" ? filterContext.grade : "All Grades";
    return (
      <div className="rounded-lg bg-slate-900 border border-slate-700 p-3 shadow-xl text-xs space-y-1 z-50">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
          <span>Score {data.score}: {data.label}</span>
        </div>
        <p className="text-slate-400">Scope: <strong className="text-cyan-300">{subj} ({gr})</strong></p>
        <p className="text-slate-400">Range: <strong className="text-slate-200">{data.rangeLabel}</strong></p>
        <p className="text-slate-400">Frequency: <strong className="text-cyan-400">{data.count} student{data.count !== 1 ? "s" : ""}</strong></p>
        <p className="text-slate-400">Proportion: <strong className="text-emerald-400">{data.percentage}%</strong></p>
      </div>
    );
  }
  return null;
};

const CustomBarLabel = ({ x, y, width, value }) => {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#94a3b8"
      textAnchor="middle"
      fontSize={11}
      fontWeight="600"
    >
      {value}
    </text>
  );
};

export default function LikertDistributionChart({ distribution, stats, fileName, filterContext = {} }) {
  const [isExporting, setIsExporting] = useState(false);

  if (!distribution || distribution.length === 0) return null;

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportLikertDistributionPdf({
        distribution,
        stats,
        fileName,
        chartElementId: "likert-distribution-chart-container",
        filterContext,
      });
    } catch (error) {
      console.error("Failed to export Likert Distribution PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const subjectLabel = filterContext.subject && filterContext.subject !== "all" ? filterContext.subject : "All Subjects";
  const gradeLabel = filterContext.grade && filterContext.grade !== "all" ? filterContext.grade : "All Grades";
  const classLabel = filterContext.classVal && filterContext.classVal !== "all" ? filterContext.classVal : null;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <BarChart3 className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Likert Score Frequency Distribution
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-semibold">
              {subjectLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-[11px] font-semibold">
              {gradeLabel}
            </span>
            {classLabel && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold">
                {classLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Student counts and proportions across 5-point Likert performance tiers for <strong className="text-slate-300">{subjectLabel}</strong> ({gradeLabel}).
          </p>
        </div>

        <button
          id="export-likert-pdf-btn"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/50 shadow-sm transition-all disabled:opacity-50 shrink-0"
          title="Download Likert Score Frequency Distribution as PDF"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Bar Chart Container */}
      <div id="likert-distribution-chart-container" className="h-56 sm:h-72 w-full p-2 bg-slate-950/40 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={distribution}
            margin={{ top: 24, right: 10, left: -20, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip filterContext={filterContext} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56} label={<CustomBarLabel />}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Likert Reference Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
        {distribution.map((item) => (
          <div
            key={item.score}
            className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-2.5 sm:p-3 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] font-mono text-slate-500">Score {item.score}</span>
            </div>
            <div className="text-xs font-bold text-slate-200 truncate">{item.label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{item.rangeLabel}</div>
            <div className="mt-2 pt-1.5 border-t border-slate-900 flex items-baseline justify-between">
              <span className="text-sm font-black text-slate-100">{item.count}</span>
              <span className="text-xs font-semibold text-slate-400">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
