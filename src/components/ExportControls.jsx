"use client";

import React, { useState } from "react";
import { Download, FileBarChart, FileText, BarChart3, MapPin, Users, Loader2 } from "lucide-react";
import { generateSchoolComparisonCsv, aggregateEvaluationData } from "@/lib/likertEngine";
import { downloadCsvFile } from "@/lib/sampleData";
import {
  exportLikertDistributionPdf,
  exportSchoolComparisonPdf,
  exportStudentRegisterPdf,
} from "@/lib/pdfExport";

export default function ExportControls({ records, stats, fileName }) {
  const [exportingType, setExportingType] = useState(null);

  if (!records || records.length === 0) return null;

  const currentStats = stats || aggregateEvaluationData(records);

  // 1. Likert Distribution PDF
  const handleDownloadLikertPdf = async () => {
    try {
      setExportingType("likert-pdf");
      await exportLikertDistributionPdf({
        distribution: currentStats?.distribution,
        stats: currentStats,
        fileName,
        chartElementId: "likert-distribution-chart-container",
      });
    } catch (err) {
      console.error("Failed to export Likert Distribution PDF:", err);
    } finally {
      setExportingType(null);
    }
  };

  // 2. Zone & School Comparison PDF
  const handleDownloadSchoolPdf = async () => {
    try {
      setExportingType("school-pdf");
      await exportSchoolComparisonPdf({
        schoolBreakdown: currentStats?.schoolBreakdown,
        zoneBreakdown: currentStats?.zoneBreakdown,
        stats: currentStats,
        fileName,
        chartElementId: "school-comparison-chart-container",
      });
    } catch (err) {
      console.error("Failed to export School Comparison PDF:", err);
    } finally {
      setExportingType(null);
    }
  };

  // 3. Student Evaluation Register PDF
  const handleDownloadRegisterPdf = async () => {
    try {
      setExportingType("register-pdf");
      await exportStudentRegisterPdf({
        records,
        fileName,
        stats: currentStats,
        filterSummary: "All Evaluated Students",
      });
    } catch (err) {
      console.error("Failed to export Student Register PDF:", err);
    } finally {
      setExportingType(null);
    }
  };

  // 4. Download All 3 PDFs sequentially
  const handleDownloadAllPdfs = async () => {
    try {
      setExportingType("all-pdfs");
      await handleDownloadLikertPdf();
      await new Promise((resolve) => setTimeout(resolve, 600));
      await handleDownloadSchoolPdf();
      await new Promise((resolve) => setTimeout(resolve, 600));
      await handleDownloadRegisterPdf();
    } catch (err) {
      console.error("Failed to batch export all PDFs:", err);
    } finally {
      setExportingType(null);
    }
  };

  const handleDownloadSchoolReport = () => {
    const csvContent = generateSchoolComparisonCsv(records);
    downloadCsvFile(csvContent, "School_Comparison_Report.csv");
  };

  const handleDownloadHtmlReport = () => {
    if (!currentStats) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mathematics Likert Performance Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #090D16; color: #f8fafc; padding: 1.5rem; }
    h1 { color: #38bdf8; text-align: center; font-size: 1.5rem; }
    .card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
    .kpi-box { background: #1e293b; padding: 0.75rem; border-radius: 8px; text-align: center; }
    .kpi-val { font-size: 1.4rem; font-weight: bold; color: #38bdf8; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.85rem; }
    th, td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #020617; color: #94a3b8; }
    .bar-container { background: #1e293b; border-radius: 4px; overflow: hidden; height: 14px; width: 100%; display: flex; }
    .bar-fill { height: 100%; background: linear-gradient(to right, #06b6d4, #10b981); }
  </style>
</head>
<body>
  <h1>Mathematics Likert Performance Report</h1>
  
  <div class="kpi-grid">
    <div class="kpi-box"><div class="kpi-val">${currentStats.meanLikert.toFixed(2)}</div><div>Overall Likert Mean</div></div>
    <div class="kpi-box"><div class="kpi-val">${currentStats.meanMarks.toFixed(1)}%</div><div>Mean Marks</div></div>
    <div class="kpi-box"><div class="kpi-val">${currentStats.interpretation}</div><div>Class Interpretation</div></div>
    <div class="kpi-box"><div class="kpi-val">${currentStats.grade}</div><div>Assigned Grade</div></div>
  </div>

  <div class="card">
    <h2>Likert Category Distribution</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr><th>Likert Score</th><th>Label</th><th>Range</th><th>Count</th><th>Percentage</th><th>Bar Graph</th></tr>
        </thead>
        <tbody>
          ${currentStats.distribution.map(d => `
            <tr>
              <td><strong>Score ${d.score}</strong></td>
              <td>${d.label}</td>
              <td>${d.rangeLabel}</td>
              <td>${d.count}</td>
              <td>${d.percentage}%</td>
              <td style="width:35%;">
                <div class="bar-container">
                  <div class="bar-fill" style="width:${d.percentage}%; background:${d.color};"></div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  ${currentStats.schoolBreakdown && currentStats.schoolBreakdown.length > 0 ? `
  <div class="card">
    <h2>School Comparison Report</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr><th>Rank</th><th>School Name</th><th>Zone</th><th>Likert Mean</th><th>Grade</th><th>Pass Rate</th><th>Likert Bar Graph</th></tr>
        </thead>
        <tbody>
          ${currentStats.schoolBreakdown.map((s, idx) => `
            <tr>
              <td>#${idx + 1}</td>
              <td><strong>${s.schoolName}</strong></td>
              <td>${s.zoneName}</td>
              <td>${s.meanLikert.toFixed(2)}</td>
              <td>Grade ${s.grade.letter}</td>
              <td>${s.passRate.toFixed(1)}%</td>
              <td style="width:30%;">
                <div class="bar-container">
                  <div class="bar-fill" style="width:${(s.meanLikert / 5) * 100}%;"></div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ` : ''}

</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "School_Comparison_Visual_Report.html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
            Report Export Center
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Download individual evaluation sections separately as professional, publication-ready PDF reports.
          </p>
        </div>

        <button
          id="download-all-pdfs-btn"
          onClick={handleDownloadAllPdfs}
          disabled={exportingType !== null}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 shrink-0"
        >
          {exportingType === "all-pdfs" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating All 3 PDFs...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download All 3 Reports (PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Separate PDF Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Part 1: Likert Score Frequency Distribution */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Part 1
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              Likert Score Frequency Distribution
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              5-point category breakdown, cohort frequencies, percentages, and visual distribution chart.
            </p>
          </div>

          <button
            id="download-likert-pdf-card-btn"
            onClick={handleDownloadLikertPdf}
            disabled={exportingType !== null}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 transition-all disabled:opacity-50"
          >
            {exportingType === "likert-pdf" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Likert PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Part 2: Education Zone & School Comparison */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Part 2
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              Zone & School Comparison
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Education zone benchmarks, comparative school bar chart, rankings, and variance indicators.
            </p>
          </div>

          <button
            id="download-school-pdf-card-btn"
            onClick={handleDownloadSchoolPdf}
            disabled={exportingType !== null}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-indigo-300 hover:text-indigo-200 transition-all disabled:opacity-50"
          >
            {exportingType === "school-pdf" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download Comparison PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Part 3: Student Evaluation Register */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Part 3
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              Student Evaluation Register
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-page student roster with IDs, schools, marks percentage, Likert score, and performance rating.
            </p>
          </div>

          <button
            id="download-register-pdf-card-btn"
            onClick={handleDownloadRegisterPdf}
            disabled={exportingType !== null}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-emerald-300 hover:text-emerald-200 transition-all disabled:opacity-50"
          >
            {exportingType === "register-pdf" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Register PDF</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Legacy CSV and HTML Exports */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <span className="text-[11px]">Additional Data Formats:</span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="download-school-comparison-report"
            onClick={handleDownloadSchoolReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>School CSV</span>
          </button>
          <button
            onClick={handleDownloadHtmlReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 transition-all"
          >
            <FileBarChart className="w-3.5 h-3.5 text-slate-400" />
            <span>Interactive HTML</span>
          </button>
        </div>
      </div>

    </div>
  );
}
