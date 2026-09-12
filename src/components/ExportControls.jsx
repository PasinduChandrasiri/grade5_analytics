"use client";

import React from "react";
import { Download, FileBarChart } from "lucide-react";
import { generateSchoolComparisonCsv, aggregateEvaluationData } from "@/lib/likertEngine";
import { downloadCsvFile } from "@/lib/sampleData";

export default function ExportControls({ records }) {
  if (!records || records.length === 0) return null;

  const handleDownloadSchoolReport = () => {
    const csvContent = generateSchoolComparisonCsv(records);
    downloadCsvFile(csvContent, "School_Comparison_Report.csv");
  };

  const handleDownloadHtmlReport = () => {
    const stats = aggregateEvaluationData(records);
    if (!stats) return;

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
    <div class="kpi-box"><div class="kpi-val">${stats.meanLikert.toFixed(2)}</div><div>Overall Likert Mean</div></div>
    <div class="kpi-box"><div class="kpi-val">${stats.meanMarks.toFixed(1)}%</div><div>Mean Marks</div></div>
    <div class="kpi-box"><div class="kpi-val">${stats.interpretation}</div><div>Class Interpretation</div></div>
    <div class="kpi-box"><div class="kpi-val">${stats.grade}</div><div>Assigned Grade</div></div>
  </div>

  <div class="card">
    <h2>Likert Category Distribution</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr><th>Likert Score</th><th>Label</th><th>Range</th><th>Count</th><th>Percentage</th><th>Bar Graph</th></tr>
        </thead>
        <tbody>
          ${stats.distribution.map(d => `
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

  ${stats.schoolBreakdown && stats.schoolBreakdown.length > 0 ? `
  <div class="card">
    <h2>School Comparison Report</h2>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr><th>Rank</th><th>School Name</th><th>Zone</th><th>Likert Mean</th><th>Grade</th><th>Pass Rate</th><th>Likert Bar Graph</th></tr>
        </thead>
        <tbody>
          ${stats.schoolBreakdown.map((s, idx) => `
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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 pb-4 w-full">
      <button
        id="download-school-comparison-report"
        onClick={handleDownloadSchoolReport}
        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-100 w-full sm:w-auto"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Download CSV Report</span>
      </button>

      <button
        onClick={handleDownloadHtmlReport}
        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-200 shadow-md transition-all hover:scale-[1.02] active:scale-100 w-full sm:w-auto"
      >
        <FileBarChart className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Download HTML Visual Report</span>
      </button>
    </div>
  );
}
