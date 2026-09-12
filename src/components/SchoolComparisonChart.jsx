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
  Legend,
  ReferenceLine,
} from "recharts";
import { MapPin, TrendingUp, TrendingDown, Download, Loader2 } from "lucide-react";
import { exportSchoolComparisonPdf } from "@/lib/pdfExport";

export default function SchoolComparisonChart({ schoolBreakdown, zoneBreakdown, stats, fileName }) {
  const [selectedZone, setSelectedZone] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  if (!schoolBreakdown || schoolBreakdown.length === 0) return null;

  // Filter schools by selected Zone
  const filteredSchools = selectedZone === "all"
    ? schoolBreakdown
    : schoolBreakdown.filter(s => s.zoneName === selectedZone);

  // Active Zone Metadata
  const activeZoneObj = selectedZone !== "all"
    ? zoneBreakdown?.find(z => z.zoneName === selectedZone)
    : null;

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportSchoolComparisonPdf({
        schoolBreakdown: filteredSchools,
        zoneBreakdown,
        stats,
        fileName,
        chartElementId: "school-comparison-chart-container",
      });
    } catch (error) {
      console.error("Failed to export School Comparison PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
      
      {/* Header & Zone Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Education Zone & School Performance Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Benchmarking individual school performance against Education Zone averages (Likert 1.0–5.0 scale).
          </p>
        </div>

        {/* Action Controls: Zone Selector & PDF Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full lg:w-auto">
          {zoneBreakdown && zoneBreakdown.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Select Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
              >
                <option value="all">All Education Zones ({zoneBreakdown.length})</option>
                {zoneBreakdown.map((z) => (
                  <option key={z.zoneName} value={z.zoneName}>
                    {z.zoneName} (Mean: {z.meanLikert.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            id="export-school-pdf-btn"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/50 shadow-sm transition-all disabled:opacity-50 shrink-0"
            title="Download Education Zone & School Performance Comparison as PDF"
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
      </div>

      {/* Zone Overview Summary Banner */}
      {zoneBreakdown && zoneBreakdown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(selectedZone === "all" ? zoneBreakdown : [activeZoneObj]).filter(Boolean).map((zone) => (
            <div
              key={zone.zoneName}
              className="rounded-xl bg-slate-950/80 border border-indigo-500/20 p-3.5 space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {zone.zoneName}
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${zone.grade.color}`}>
                  Grade {zone.grade.letter}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl font-black text-slate-100">{zone.meanLikert.toFixed(2)}</span>
                  <span className="text-xs text-slate-400"> / 5.00 Zone Mean</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400">{zone.passRate.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">Pass Rate</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-900 flex justify-between">
                <span>Schools: <strong className="text-slate-200">{zone.schoolCount}</strong></span>
                {zone.topSchool && (
                  <span className="text-cyan-300 font-semibold truncate max-w-[140px]" title={`Top: ${zone.topSchool.schoolName}`}>
                    Top: {zone.topSchool.schoolName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparative Bar Chart */}
      <div id="school-comparison-chart-container" className="h-60 sm:h-72 w-full pt-2 p-2 bg-slate-950/40 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredSchools}
            margin={{ top: 20, right: 10, left: -20, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="schoolName"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={0}
            />
            <YAxis
              stroke="#06b6d4"
              domain={[0, 5]}
              tick={{ fill: "#06b6d4", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
            <Bar
              dataKey="meanLikert"
              name="School Likert Mean Score"
              fill="#06b6d4"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
            {activeZoneObj && (
              <ReferenceLine
                y={activeZoneObj.meanLikert}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{ value: `Zone Avg (${activeZoneObj.meanLikert})`, fill: '#10b981', position: 'top', fontSize: 10 }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed School Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {filteredSchools.map((s) => {
          const isPositive = s.zoneDiffLikert >= 0;
          return (
            <div
              key={s.schoolName}
              className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-2.5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-sm text-slate-200 block truncate" title={s.schoolName}>
                    {s.schoolName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block truncate">{s.zoneName}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs font-black rounded-md border shrink-0 ${s.grade.color}`}>
                  Grade {s.grade.letter}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-900">
                <div>
                  <span className="text-slate-400 block text-[11px]">Likert Mean:</span>
                  <strong className="text-cyan-400 font-mono text-sm">{s.meanLikert.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pass Rate:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{s.passRate.toFixed(1)}%</strong>
                </div>
              </div>

              {/* Zone Benchmark Variance Indicator */}
              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">vs Zone Benchmark:</span>
                <span className={`flex items-center gap-1 font-mono font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? `+${s.zoneDiffLikert.toFixed(2)}` : s.zoneDiffLikert.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
