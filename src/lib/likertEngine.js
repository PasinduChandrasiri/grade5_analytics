/**
 * Likert Scale Engine for Mathematics Test Performance Evaluation
 * 
 * Likert Scale Mapping (based on Marks_Percentage):
 * 81 – 100% = 5 (Excellent)
 * 61 – 80%  = 4 (Good)
 * 41 – 60%  = 3 (Satisfactory)
 * 21 – 40%  = 2 (Poor)
 * 0  – 20%  = 1 (Very Poor)
 * 
 * Grading Scale (based on Mean Likert Score):
 * 4.50 – 5.00 = A+
 * 4.00 – 4.49 = A
 * 3.50 – 3.99 = B
 * 3.00 – 3.49 = C
 * 2.50 – 2.99 = D
 * Below 2.50  = E
 */

export const LIKERT_LEVELS = [
  {
    score: 5,
    label: "Excellent",
    shortLabel: "Excellent",
    rangeLabel: "81–100%",
    range: [81, 100],
    color: "#10B981", // Emerald
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  {
    score: 4,
    label: "Good",
    shortLabel: "Good",
    rangeLabel: "61–80%",
    range: [61, 80],
    color: "#06B6D4", // Cyan
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  },
  {
    score: 3,
    label: "Satisfactory",
    shortLabel: "Satisfactory",
    rangeLabel: "41–60%",
    range: [41, 60],
    color: "#6366F1", // Indigo
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  },
  {
    score: 2,
    label: "Poor",
    shortLabel: "Poor",
    rangeLabel: "21–40%",
    range: [21, 40],
    color: "#F59E0B", // Amber
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    score: 1,
    label: "Very Poor",
    shortLabel: "Very Poor",
    rangeLabel: "0–20%",
    range: [0, 20],
    color: "#EF4444", // Rose/Red
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  },
];

/**
 * Maps percentage marks (0-100) to corresponding 5-Point Likert details.
 */
export function getLikertDetail(percentage) {
  const val = Math.max(0, Math.min(100, Number(percentage) || 0));
  if (val >= 81) return LIKERT_LEVELS[0];
  if (val >= 61) return LIKERT_LEVELS[1];
  if (val >= 41) return LIKERT_LEVELS[2];
  if (val >= 21) return LIKERT_LEVELS[3];
  return LIKERT_LEVELS[4];
}

/**
 * Maps Mean Likert Score (1.00 - 5.00) to strict Letter Grade.
 * 4.50 – 5.00 = A+
 * 4.00 – 4.49 = A
 * 3.50 – 3.99 = B
 * 3.00 – 3.49 = C
 * 2.50 – 2.99 = D
 * Below 2.50  = E
 */
export function getSchoolGrade(meanLikert) {
  const val = Number(meanLikert) || 0;
  if (val >= 4.50) return "A+";
  if (val >= 4.00) return "A";
  if (val >= 3.50) return "B";
  if (val >= 3.00) return "C";
  if (val >= 2.50) return "D";
  return "E";
}

/**
 * Class Performance Interpretation text based on Mean Likert Score.
 */
export function getClassInterpretation(meanLikert) {
  const val = Number(meanLikert) || 0;
  if (val >= 4.50) return "Excellent";
  if (val >= 4.00) return "Very Good";
  if (val >= 3.50) return "Good";
  if (val >= 3.00) return "Satisfactory";
  if (val >= 2.50) return "Poor";
  return "Very Poor";
}

/**
 * Clean & map raw CSV rows into standardized student evaluation records.
 * Required headers: Student_ID, Marks_Percentage, School_Name, (optional Zone_Name)
 */
export function parseAndCleanCsvData(rawRows) {
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    return { records: [], errors: ["CSV file appears to be empty."] };
  }

  const records = [];
  const errors = [];

  rawRows.forEach((row, idx) => {
    if (!row || typeof row !== "object") return;

    const keys = Object.keys(row);

    // Find keys flexibly
    const idKey = keys.find(k => /student[_\s]?id|id|roll[_\s]?no|index/i.test(k.trim())) || keys[0];
    const marksKey = keys.find(k => /marks[_\s]?percentage|marks|score|percentage|percent|math[s]?/i.test(k.trim())) || keys[1];
    const schoolKey = keys.find(k => /school[_\s]?name|school|institution|center/i.test(k.trim())) || keys[2];
    const zoneKey = keys.find(k => /zone[_\s]?name|zone|education[_\s]?zone/i.test(k.trim()));

    const rawId = row[idKey];
    const rawMarks = row[marksKey];
    const rawSchool = row[schoolKey];
    const rawZone = zoneKey ? row[zoneKey] : null;

    if (!rawId && (rawMarks === undefined || rawMarks === null || rawMarks === "")) {
      return;
    }

    let cleanMarksStr = String(rawMarks ?? "").replace(/%/g, "").trim();
    let numMarks = parseFloat(cleanMarksStr);

    if (isNaN(numMarks)) {
      errors.push(`Row ${idx + 2}: Invalid marks percentage "${rawMarks}" for Student ID "${rawId || 'Unknown'}".`);
      return;
    }

    numMarks = Math.max(0, Math.min(100, numMarks));
    const likertObj = getLikertDetail(numMarks);
    const studentId = String(rawId || `STD-${String(records.length + 1).padStart(3, "0")}`).trim();
    const schoolName = String(rawSchool || "Default School").trim();
    const zoneName = String(rawZone || "Central Zone").trim();

    records.push({
      id: studentId,
      marks: Math.round(numMarks * 100) / 100,
      school: schoolName,
      zoneName: zoneName || "Central Zone",
      likertScore: likertObj.score,
      likertLabel: likertObj.label,
      color: likertObj.color,
      badgeBg: likertObj.badgeBg,
    });
  });

  return { records, errors };
}

/**
 * Calculate overall aggregated metrics for dashboard display.
 */
export function aggregateEvaluationData(records) {
  if (!records || records.length === 0) {
    return null;
  }

  const n = records.length;
  const totalMarks = records.reduce((acc, r) => acc + r.marks, 0);
  const meanMarks = totalMarks / n;

  const totalLikert = records.reduce((acc, r) => acc + r.likertScore, 0);
  const meanLikert = totalLikert / n;

  const grade = getSchoolGrade(meanLikert);
  const interpretation = getClassInterpretation(meanLikert);

  // Frequency count for the 5 Likert categories
  const freqMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  records.forEach(r => {
    freqMap[r.likertScore] = (freqMap[r.likertScore] || 0) + 1;
  });

  const distribution = LIKERT_LEVELS.map(level => {
    const count = freqMap[level.score] || 0;
    const percentage = n > 0 ? (count / n) * 100 : 0;
    return {
      score: level.score,
      label: level.label,
      rangeLabel: level.rangeLabel,
      count,
      percentage: Math.round(percentage * 10) / 10,
      color: level.color,
    };
  });

  const marksList = records.map(r => r.marks);
  const minMark = Math.min(...marksList);
  const maxMark = Math.max(...marksList);

  // School breakdown
  const schoolsMap = {};
  records.forEach((r) => {
    const key = r.school;
    if (!schoolsMap[key]) {
      schoolsMap[key] = { schoolName: r.school, zoneName: r.zoneName || "Central Zone", list: [] };
    }
    schoolsMap[key].list.push(r);
  });

  const schoolBreakdown = Object.values(schoolsMap).map((sObj) => {
    const list = sObj.list;
    const sampleSize = list.length;
    const totalL = list.reduce((acc, r) => acc + r.likertScore, 0);
    const mLikert = totalL / sampleSize;
    const totalM = list.reduce((acc, r) => acc + r.marks, 0);
    const mMarks = totalM / sampleSize;
    const passCount = list.filter(r => r.marks >= 40).length;
    const passRate = (passCount / sampleSize) * 100;
    const gradeLetter = getSchoolGrade(mLikert);

    const gradeBadgeColor = {
      "A+": "text-emerald-300 bg-emerald-500/15 border-emerald-500/40",
      "A":  "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      "B":  "text-cyan-400    bg-cyan-500/10    border-cyan-500/30",
      "C":  "text-indigo-400  bg-indigo-500/10  border-indigo-500/30",
      "D":  "text-amber-400   bg-amber-500/10   border-amber-500/30",
      "E":  "text-rose-400    bg-rose-500/10    border-rose-500/30",
    }[gradeLetter] || "text-slate-300 bg-slate-700/30 border-slate-600/30";

    return {
      schoolName: sObj.schoolName,
      zoneName: sObj.zoneName,
      sampleSize,
      meanLikert: Math.round(mLikert * 100) / 100,
      meanMarks: Math.round(mMarks * 100) / 100,
      passRate: Math.round(passRate * 10) / 10,
      grade: { letter: gradeLetter, color: gradeBadgeColor },
    };
  });

  // Zone breakdown
  const zonesMap = {};
  records.forEach((r) => {
    const zName = r.zoneName || "Central Zone";
    if (!zonesMap[zName]) {
      zonesMap[zName] = [];
    }
    zonesMap[zName].push(r);
  });

  const zoneBreakdown = Object.keys(zonesMap).map((zName) => {
    const list = zonesMap[zName];
    const sampleSize = list.length;
    const totalL = list.reduce((acc, r) => acc + r.likertScore, 0);
    const mLikert = totalL / sampleSize;
    const passCount = list.filter(r => r.marks >= 40).length;
    const passRate = (passCount / sampleSize) * 100;
    const gradeLetter = getSchoolGrade(mLikert);

    const zoneSchools = schoolBreakdown.filter(s => s.zoneName === zName);
    const topSchool = zoneSchools.length > 0
      ? [...zoneSchools].sort((a, b) => b.meanLikert - a.meanLikert)[0]
      : null;

    const gradeBadgeColor = {
      "A+": "text-emerald-300 bg-emerald-500/15 border-emerald-500/40",
      "A":  "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      "B":  "text-cyan-400    bg-cyan-500/10    border-cyan-500/30",
      "C":  "text-indigo-400  bg-indigo-500/10  border-indigo-500/30",
      "D":  "text-amber-400   bg-amber-500/10   border-amber-500/30",
      "E":  "text-rose-400    bg-rose-500/10    border-rose-500/30",
    }[gradeLetter] || "text-slate-300 bg-slate-700/30 border-slate-600/30";

    return {
      zoneName: zName,
      schoolCount: zoneSchools.length,
      sampleSize,
      meanLikert: Math.round(mLikert * 100) / 100,
      passRate: Math.round(passRate * 10) / 10,
      grade: { letter: gradeLetter, color: gradeBadgeColor },
      topSchool,
    };
  });

  // Calculate zone variance per school
  schoolBreakdown.forEach((s) => {
    const zObj = zoneBreakdown.find(z => z.zoneName === s.zoneName);
    const zMean = zObj ? zObj.meanLikert : meanLikert;
    s.zoneDiffLikert = Math.round((s.meanLikert - zMean) * 100) / 100;
  });

  schoolBreakdown.sort((a, b) => b.meanLikert - a.meanLikert);

  return {
    sampleSize: n,
    meanLikert: Math.round(meanLikert * 100) / 100,
    meanMarks: Math.round(meanMarks * 100) / 100,
    minMark: Math.round(minMark * 100) / 100,
    maxMark: Math.round(maxMark * 100) / 100,
    grade,
    interpretation,
    distribution,
    schoolBreakdown,
    zoneBreakdown,
  };
}

/**
 * Generate School Comparison Report CSV String.
 * CSV Headers:
 * School, Sample Size, Mean, Grade, Rank, Excellent(5), Good(4), Satisfactory(3), Poor(2), Very Poor(1)
 */
export function generateSchoolComparisonCsv(records) {
  if (!records || records.length === 0) return "";

  // Group records by School_Name
  const schoolsMap = {};
  records.forEach((r) => {
    if (!schoolsMap[r.school]) {
      schoolsMap[r.school] = [];
    }
    schoolsMap[r.school].push(r);
  });

  // Calculate stats per school
  const schoolStats = Object.keys(schoolsMap).map((schoolName) => {
    const list = schoolsMap[schoolName];
    const sampleSize = list.length;
    const totalLikert = list.reduce((acc, r) => acc + r.likertScore, 0);
    const mean = totalLikert / sampleSize;
    const roundedMean = Math.round(mean * 100) / 100;
    const grade = getSchoolGrade(roundedMean);

    // Count per Likert level
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((r) => {
      counts[r.likertScore] = (counts[r.likertScore] || 0) + 1;
    });

    return {
      schoolName,
      sampleSize,
      mean: roundedMean,
      grade,
      counts,
    };
  });

  // Sort by Mean score descending
  schoolStats.sort((a, b) => b.mean - a.mean);

  // Build CSV content with counts (excluding text bar graph column)
  let csv = "School, Sample Size, Mean, Grade, Rank, Excellent(5), Good(4), Satisfactory(3), Poor(2), Very Poor(1)\n";
  schoolStats.forEach((item, index) => {
    const rank = index + 1;
    // Escape school name if it contains commas
    const escapedSchool = item.schoolName.includes(",") ? `"${item.schoolName}"` : item.schoolName;
    csv += `${escapedSchool}, ${item.sampleSize}, ${item.mean.toFixed(2)}, ${item.grade}, ${rank}, ${item.counts[5]}, ${item.counts[4]}, ${item.counts[3]}, ${item.counts[2]}, ${item.counts[1]}\n`;
  });

  return csv;
}
