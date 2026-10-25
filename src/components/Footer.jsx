"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="font-semibold text-slate-300">
            Universal Educational Performance Evaluator
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-500">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-medium text-xs shadow-sm">
          <span>Implemented by - D.M.S. Dassanayake</span>
        </div>
      </div>
    </footer>
  );
}
