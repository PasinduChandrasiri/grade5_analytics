"use client";

import React, { useState, useMemo } from "react";
import Papa from "papaparse";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CsvUploader from "@/components/CsvUploader";
import LikertDistributionChart from "@/components/LikertDistributionChart";
import SchoolComparisonChart from "@/components/SchoolComparisonChart";
import StudentDataTable from "@/components/StudentDataTable";
import ExportControls from "@/components/ExportControls";
import { parseAndCleanCsvData, aggregateEvaluationData } from "@/lib/likertEngine";
import { SAMPLE_CSV_DATA } from "@/lib/sampleData";
import { Filter, RotateCcw, AlertTriangle } from "lucide-react";

export default function HomePage() {
  const [records, setRecords] = useState(null);
  const [fileName, setFileName] = useState(null);

  // Cohort Filters
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

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
    setFileName(sourceName);
    setSelectedSubject("all");
    setSelectedGrade("all");
    setSelectedClass("all");
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
        handleDataLoaded(sampleRecords, "Sample_Universal_Evaluation.csv");
      },
    });
  };

  const handleReset = () => {
    setRecords(null);
    setFileName(null);
    setSelectedSubject("all");
    setSelectedGrade("all");
    setSelectedClass("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSelectedSubject("all");
    setSelectedGrade("all");
    setSelectedClass("all");
  };

  // Unique lists for dropdowns
  const uniqueSubjects = useMemo(() => {
    if (!records) return [];
    return Array.from(new Set(records.map((r) => r.subject))).filter(Boolean);
  }, [records]);

  const uniqueGrades = useMemo(() => {
    if (!records) return [];
    return Array.from(new Set(records.map((r) => r.grade))).filter(Boolean);
  }, [records]);

  const uniqueClasses = useMemo(() => {
    if (!records) return [];
    return Array.from(new Set(records.map((r) => r.class || r.classVal))).filter(Boolean);
  }, [records]);

  // Filtered Cohort Records
  const activeCohortRecords = useMemo(() => {
    if (!records) return [];
    return records.filter((r) => {
      const matchSubject = selectedSubject === "all" || r.subject === selectedSubject;
      const matchGrade = selectedGrade === "all" || r.grade === selectedGrade;
      const matchClass = selectedClass === "all" || (r.class || r.classVal) === selectedClass;
      return matchSubject && matchGrade && matchClass;
    });
  }, [records, selectedSubject, selectedGrade, selectedClass]);

  // Aggregated stats for the filtered cohort
  const cohortStats = useMemo(() => {
    return aggregateEvaluationData(activeCohortRecords);
  }, [activeCohortRecords]);

  const filterContext = useMemo(() => ({
    subject: selectedSubject,
    grade: selectedGrade,
    classVal: selectedClass,
  }), [selectedSubject, selectedGrade, selectedClass]);

  const isAnyFilterActive = selectedSubject !== "all" || selectedGrade !== "all" || selectedClass !== "all";

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">

      {/* Navbar */}
      <Navbar onLoadSample={handleLoadSample} hasData={!!records} onReset={handleReset} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* ── UPLOAD VIEW (Visible only when no CSV is loaded) ── */}
        {!records && (
          <div className="space-y-6 sm:space-y-8">
            <CsvUploader onDataLoaded={handleDataLoaded} onLoadSample={handleLoadSample} />

            {/* ── LIKERT SCALE REFERENCE ── */}
            <section aria-labelledby="scale-reference-heading" className="max-w-4xl mx-auto">
              <h2 id="scale-reference-heading" className="text-xs text-slate-500 text-center uppercase tracking-widest mb-3 font-semibold">
                Universal 5-Point Likert Performance Scale Reference
              </h2>
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
            </section>
          </div>
        )}

        {/* ── DASHBOARD VIEW ── */}
        {records && (
          <div id="dashboard-top" className="space-y-6 sm:space-y-8">

            {/* Status bar */}
            <header className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-400">Dataset:</span>
                <strong className="text-slate-200 font-mono">{fileName}</strong>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {records.length} total records
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                  {Array.from(new Set(records.map(r => r.school))).length} school(s)
                </span>
                {isAnyFilterActive && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                    Filtered: {activeCohortRecords.length} records
                  </span>
                )}
              </div>
              <button
                onClick={handleReset}
                aria-label="Upload a new CSV file"
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold transition-colors"
              >
                Upload New CSV
              </button>
            </header>

            {/* Cohort Filter Control Bar */}
            <section aria-labelledby="cohort-filters-heading" className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <h2 id="cohort-filters-heading" className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Cohort Scope Filters
                  </h2>
                  <span className="text-[11px] text-slate-400 hidden md:inline">
                    &bull; Charts and reports instantly update to the selected subject and grade
                  </span>
                </div>
                {isAnyFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    aria-label="Reset all cohort filters to default"
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Cohort Filters</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Subject Selector */}
                <div>
                  <label htmlFor="cohort-subject-select" className="block text-[11px] font-medium text-slate-400 mb-1">
                    Subject
                  </label>
                  <select
                    id="cohort-subject-select"
                    value={selectedSubject}
                    aria-label="Filter cohort by subject"
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="all">All Subjects ({uniqueSubjects.length})</option>
                    {uniqueSubjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Grade Selector */}
                <div>
                  <label htmlFor="cohort-grade-select" className="block text-[11px] font-medium text-slate-400 mb-1">
                    Grade Level
                  </label>
                  <select
                    id="cohort-grade-select"
                    value={selectedGrade}
                    aria-label="Filter cohort by grade level"
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="all">All Grades ({uniqueGrades.length})</option>
                    {uniqueGrades.map((gr) => (
                      <option key={gr} value={gr}>{gr}</option>
                    ))}
                  </select>
                </div>

                {/* Class Selector */}
                <div>
                  <label htmlFor="cohort-class-select" className="block text-[11px] font-medium text-slate-400 mb-1">
                    Class / Section
                  </label>
                  <select
                    id="cohort-class-select"
                    value={selectedClass}
                    aria-label="Filter cohort by class section"
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="all">All Classes ({uniqueClasses.length})</option>
                    {uniqueClasses.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Zero Records Warning */}
            {activeCohortRecords.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-200">No Student Records Found</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No records match the current combination of Subject, Grade, and Class. Try selecting different filter criteria or reset filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-colors"
                >
                  Reset Cohort Filters
                </button>
              </div>
            ) : cohortStats && (
              <>
                {/* Bar Chart: Frequency per Likert level */}
                <LikertDistributionChart
                  distribution={cohortStats.distribution}
                  stats={cohortStats}
                  fileName={fileName}
                  filterContext={filterContext}
                />

                {/* Education Zone & School Comparison Bar Chart + School Grade Cards */}
                <SchoolComparisonChart
                  schoolBreakdown={cohortStats.schoolBreakdown}
                  zoneBreakdown={cohortStats.zoneBreakdown}
                  stats={cohortStats}
                  fileName={fileName}
                  filterContext={filterContext}
                />

                {/* Student Data Table */}
                <StudentDataTable
                  records={activeCohortRecords}
                  stats={cohortStats}
                  fileName={fileName}
                  filterContext={filterContext}
                />

                {/* Export Controls */}
                <ExportControls
                  records={activeCohortRecords}
                  stats={cohortStats}
                  fileName={fileName}
                  filterContext={filterContext}
                />
              </>
            )}

          </div>
        )}

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
