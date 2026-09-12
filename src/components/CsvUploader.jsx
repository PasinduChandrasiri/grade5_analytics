"use client";

import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { UploadCloud, FileText, AlertCircle, Sparkles, FileCheck } from "lucide-react";
import { parseAndCleanCsvData } from "@/lib/likertEngine";

export default function CsvUploader({ onDataLoaded, onLoadSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setErrorMsg("Please select a valid .csv file format.");
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      comments: "#",
      dynamicTyping: false,
      complete: (results) => {
        setIsProcessing(false);
        if (!results.data || results.data.length === 0) {
          setErrorMsg("Uploaded CSV contains no valid data rows.");
          return;
        }

        const { records, errors } = parseAndCleanCsvData(results.data);

        if (records.length === 0) {
          setErrorMsg(
            errors.length > 0
              ? errors[0]
              : "Could not parse student scores. Ensure headers include 'Student_ID', 'Marks_Percentage', 'School_Name', and 'Education_Zone'."
          );
          return;
        }

        onDataLoaded(records, file.name);
      },
      error: (err) => {
        setIsProcessing(false);
        setErrorMsg(`CSV Parse Error: ${err.message}`);
      },
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Mathematics Evaluation CSV Uploader
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Upload your CSV file containing student marks to calculate Likert scale distribution, overall mean, and generate school comparison reports.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-cyan-400 bg-cyan-950/30 scale-[1.01] shadow-2xl shadow-cyan-500/20 animate-dropzone-glow"
              : "border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-950/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-lg">
                <UploadCloud className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-slate-900">
                <FileText className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <p className="text-base font-semibold text-slate-200">
                {isProcessing ? "Processing CSV Data..." : "Drag & Drop your .csv file here"}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center justify-center gap-1">
                <span>Expected CSV headers:</span>
                <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Student_ID</code>,
                <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Marks_Percentage</code>,
                <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">School_Name</code>,
                <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Education_Zone</code>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
              >
                Browse CSV File
              </button>
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Demo Data Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Need sample data to evaluate the application?</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLoadSample();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Demo Dataset</span>
          </button>
        </div>

      </div>
    </div>
  );
}
