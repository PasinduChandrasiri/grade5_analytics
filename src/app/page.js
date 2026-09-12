"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import CsvUploader from "@/components/CsvUploader";
import LikertDistributionChart from "@/components/LikertDistributionChart";
import SchoolComparisonChart from "@/components/SchoolComparisonChart";
import StudentDataTable from "@/components/StudentDataTable";
import ExportControls from "@/components/ExportControls";
import { parseAndCleanCsvData, aggregateEvaluationData } from "@/lib/likertEngine";
import { SAMPLE_CSV_DATA } from "@/lib/sampleData";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const [records, setRecords] = useState(null);
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState(null);

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#06B6D4", "#6366F1"],
    });
  };

  const handleDataLoaded = (newRecords, sourceName = "Uploaded File") => {
    setRecords(newRecords);
    const aggStats = aggregateEvaluationData(newRecords);
    setStats(aggStats);
    setFileName(sourceName);
    triggerCelebration();
    // Scroll to dashboard after short delay
    setTimeout(() => {
      document.getElementById("dashboard-top")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleLoadSample = () => {
    Papa.parse(SAMPLE_CSV_DATA, {
      header: true,
      skipEmptyLines: true,
      comments: "#",
      complete: (results) => {
        const { records: sampleRecords } = parseAndCleanCsvData(results.data);
        handleDataLoaded(sampleRecords, "Sample_Math_Evaluation.csv");
      },
    });
  };

  const handleReset = () => {
    setRecords(null);
    setStats(null);
    setFileName(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">

      {/* Navbar */}
      <Navbar onLoadSample={handleLoadSample} hasData={!!records} onReset={handleReset} />

      {/* Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* ── UPLOAD VIEW (Visible only when no CSV is loaded) ── */}
        {!records && (
          <div className="space-y-6 sm:space-y-8">
            <CsvUploader onDataLoaded={handleDataLoaded} onLoadSample={handleLoadSample} />

            {/* ── LIKERT SCALE REFERENCE ── */}
            <div className="max-w-4xl mx-auto">
              <p className="text-xs text-slate-500 text-center uppercase tracking-widest mb-3 font-semibold">
                5-Point Likert Scale Reference
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { score: 5, range: "81–100%", label: "Excellent",    color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
                  { score: 4, range: "61–80%",  label: "Good",         color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" },
                  { score: 3, range: "41–60%",  label: "Satisfactory", color: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10" },
                  { score: 2, range: "21–40%",  label: "Poor",         color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
                  { score: 1, range: "0–20%",   label: "Very Poor",    color: "border-rose-500/40 text-rose-400 bg-rose-500/10" },
                ].map((item) => (
                  <div key={item.score} className={`p-3 rounded-xl border ${item.color} text-center space-y-0.5`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">Score {item.score}</span>
                    <div className="text-sm font-black">{item.label}</div>
                    <div className="text-[11px] font-mono opacity-75">{item.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {records && stats && (
          <div id="dashboard-top" className="space-y-8">

            {/* Status bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-400">Dataset:</span>
                <strong className="text-slate-200 font-mono">{fileName}</strong>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {records.length} records
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                  {Array.from(new Set(records.map(r => r.school))).length} school(s)
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold transition-colors"
              >
                Upload New CSV
              </button>
            </div>

            {/* Bar Chart: Frequency per Likert level */}
            <LikertDistributionChart
              distribution={stats.distribution}
              stats={stats}
              fileName={fileName}
            />

            {/* Education Zone & School Comparison Bar Chart + School Grade Cards */}
            <SchoolComparisonChart
              schoolBreakdown={stats.schoolBreakdown}
              zoneBreakdown={stats.zoneBreakdown}
              stats={stats}
              fileName={fileName}
            />

            {/* Student Data Table */}
            <StudentDataTable
              records={records}
              stats={stats}
              fileName={fileName}
            />

            {/* Export Controls */}
            <ExportControls
              records={records}
              stats={stats}
              fileName={fileName}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Mathematics Likert Performance Evaluator &copy; {new Date().getFullYear()}</span>
          <span>Next.js App Router &bull; Vercel Ready</span>
        </div>
      </footer>

    </div>
  );
}
