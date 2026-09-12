"use client";

import React from "react";
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
import { BarChart3 } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg bg-slate-900 border border-slate-700 p-3 shadow-xl text-xs space-y-1 z-50">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
          <span>Score {data.score}: {data.label}</span>
        </div>
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

export default function LikertDistributionChart({ distribution }) {
  if (!distribution || distribution.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Likert Score Frequency Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Number of students in each 5-point Likert performance category.
          </p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-56 sm:h-72 w-full">
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
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
