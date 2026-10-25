"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Users, Download, Loader2 } from "lucide-react";
import { exportStudentRegisterPdf } from "@/lib/pdfExport";

export default function StudentDataTable({ records, stats, fileName, filterContext = {} }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLikert, setSelectedLikert] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortField, setSortField] = useState("marks");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const pageSize = 10;

  const uniqueSchools = useMemo(() => {
    if (!records) return [];
    return Array.from(new Set(records.map((r) => r.school))).filter(Boolean);
  }, [records]);

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

  const filteredRecords = useMemo(() => {
    if (!records) return [];
    return records
      .filter((r) => {
        const q = searchTerm.toLowerCase().trim();
        const matchSearch =
          !q ||
          r.id.toLowerCase().includes(q) ||
          r.school.toLowerCase().includes(q) ||
          (r.subject && r.subject.toLowerCase().includes(q)) ||
          (r.grade && r.grade.toLowerCase().includes(q)) ||
          ((r.class || r.classVal) && (r.class || r.classVal).toLowerCase().includes(q));

        const matchLikert = selectedLikert === "all" || r.likertScore === Number(selectedLikert);
        const matchSchool = selectedSchool === "all" || r.school === selectedSchool;
        const matchSubject = selectedSubject === "all" || r.subject === selectedSubject;
        const matchGrade = selectedGrade === "all" || r.grade === selectedGrade;
        const matchClass = selectedClass === "all" || (r.class || r.classVal) === selectedClass;

        return matchSearch && matchLikert && matchSchool && matchSubject && matchGrade && matchClass;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    records,
    searchTerm,
    selectedLikert,
    selectedSchool,
    selectedSubject,
    selectedGrade,
    selectedClass,
    sortField,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const activeFilters = [];
      if (selectedSubject !== "all") activeFilters.push(`Subject: ${selectedSubject}`);
      if (selectedGrade !== "all") activeFilters.push(`Grade: ${selectedGrade}`);
      if (selectedClass !== "all") activeFilters.push(`Class: ${selectedClass}`);
      if (selectedSchool !== "all") activeFilters.push(`School: ${selectedSchool}`);
      if (selectedLikert !== "all") activeFilters.push(`Score: ${selectedLikert}`);
      if (searchTerm.trim()) activeFilters.push(`Search: "${searchTerm.trim()}"`);
      const filterSummary = activeFilters.length > 0 ? activeFilters.join(" | ") : "All Students";

      await exportStudentRegisterPdf({
        records: filteredRecords,
        fileName,
        stats,
        filterSummary,
        filterContext: {
          ...filterContext,
          subject: selectedSubject !== "all" ? selectedSubject : filterContext.subject,
          grade: selectedGrade !== "all" ? selectedGrade : filterContext.grade,
          classVal: selectedClass !== "all" ? selectedClass : filterContext.classVal,
        },
      });
    } catch (error) {
      console.error("Failed to export Student Register PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!records || records.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">

      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400 shrink-0" />
            Student Evaluation Register
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual student marks and assigned Likert performance ratings ({filteredRecords.length} records).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, School, Subject..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 w-full sm:w-48"
            />
          </div>

          {/* Subject filter (if multiple) */}
          {uniqueSubjects.length > 1 && (
            <select
              value={selectedSubject}
              onChange={(e) => { setSelectedSubject(e.target.value); setCurrentPage(1); }}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}

          {/* Grade filter (if multiple) */}
          {uniqueGrades.length > 1 && (
            <select
              value={selectedGrade}
              onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
            >
              <option value="all">All Grades</option>
              {uniqueGrades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}

          {/* Class filter (if multiple) */}
          {uniqueClasses.length > 1 && (
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* School filter */}
          {uniqueSchools.length > 1 && (
            <select
              value={selectedSchool}
              onChange={(e) => { setSelectedSchool(e.target.value); setCurrentPage(1); }}
              className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto max-w-full sm:max-w-[140px]"
            >
              <option value="all">All Schools</option>
              {uniqueSchools.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {/* Likert filter */}
          <select
            value={selectedLikert}
            onChange={(e) => { setSelectedLikert(e.target.value); setCurrentPage(1); }}
            className="py-1.5 px-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
          >
            <option value="all">All Likert</option>
            <option value="5">Score 5 – Excellent</option>
            <option value="4">Score 4 – Good</option>
            <option value="3">Score 3 – Satisfactory</option>
            <option value="2">Score 2 – Poor</option>
            <option value="1">Score 1 – Very Poor</option>
          </select>

          {/* Download PDF Button */}
          <button
            id="export-register-pdf-btn"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/50 shadow-sm transition-all disabled:opacity-50 shrink-0"
            title="Download Student Evaluation Register as PDF"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download PDF ({filteredRecords.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table (Responsive Horizontal Scroll) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 -mx-1 sm:mx-0">
        <table className="w-full text-left text-xs text-slate-300 min-w-[720px]">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 sm:px-4">#</th>
              <th
                onClick={() => handleSort("id")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">Student ID <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th
                onClick={() => handleSort("school")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">School Name <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th
                onClick={() => handleSort("subject")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">Subject <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th
                onClick={() => handleSort("grade")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">Grade <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th
                onClick={() => handleSort("class")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">Class <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th
                onClick={() => handleSort("marks")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">Marks (%) <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th
                onClick={() => handleSort("likertScore")}
                className="py-2.5 px-3 sm:px-4 cursor-pointer hover:text-slate-100 transition-colors select-none"
              >
                <div className="flex items-center gap-1">Likert Score <ArrowUpDown className="w-3 h-3 text-slate-600" /></div>
              </th>
              <th className="py-2.5 px-3 sm:px-4">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((item, idx) => (
                <tr key={`${item.id}-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 font-mono text-[11px]">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-200">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-400 max-w-[140px] truncate" title={item.school}>
                    {item.school}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium text-[11px]">
                      {item.subject || "General"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-300 font-medium">
                    {item.grade || "Grade 10"}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-400 font-mono">
                    {item.class || item.classVal || "Class A"}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-slate-100">
                    {Number(item.marks).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-lg font-black text-xs border"
                      style={{
                        backgroundColor: `${item.color}18`,
                        color: item.color,
                        borderColor: `${item.color}45`,
                      }}
                    >
                      {item.likertScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${item.badgeBg}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.likertLabel}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500 text-xs">
                  No student records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-slate-400">
        <span>
          Showing page <strong className="text-slate-200">{currentPage}</strong> of{" "}
          <strong className="text-slate-200">{totalPages}</strong> &bull; {filteredRecords.length} records total
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-slate-300 tabular-nums">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
