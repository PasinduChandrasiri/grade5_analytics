import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

/**
 * Format current timestamp for reports
 */
function getReportTimestamp() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Draw a standardized, elegant executive header on a PDF page
 */
function drawReportHeader(doc, { title, subtitle, fileName, stats, totalRecords }) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top accent bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFillColor(6, 182, 212); // cyan-500 line
  doc.rect(0, 27, pageWidth, 1.5, "F");

  // System Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 182, 212);
  doc.text("MATHEMATICS PERFORMANCE EVALUATION SYSTEM", 14, 9);

  // Report Section Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 14, 18);

  // Subtitle / Scope
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(subtitle || "Official Performance Evaluation Report", 14, 24);

  // Metadata block (right aligned)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateStr = `Generated: ${getReportTimestamp()}`;
  const fileStr = `Dataset: ${fileName || "Evaluation_Data.csv"}`;
  const countStr = `Total Students: ${totalRecords ?? stats?.sampleSize ?? "N/A"}`;
  
  doc.text(dateStr, pageWidth - 14, 9, { align: "right" });
  doc.text(fileStr, pageWidth - 14, 15, { align: "right" });
  doc.text(countStr, pageWidth - 14, 21, { align: "right" });
}

/**
 * Add running page numbers and confidentiality footer on every page
 */
function addPageFooters(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(
      "Mathematics Likert Performance Evaluator • Confidential Educational Record",
      14,
      pageHeight - 7
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: "right" });
  }
}

/**
 * Helper to capture a DOM element as PNG data URL
 */
async function captureElementImage(elementId) {
  if (typeof window === "undefined" || !elementId) return null;
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#090d16",
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("Failed to capture chart canvas image:", err);
    return null;
  }
}

/**
 * ────────────────────────────────────────────────────────────
 * PART 1: EXPORT LIKERT SCORE FREQUENCY DISTRIBUTION AS PDF
 * ────────────────────────────────────────────────────────────
 */
export async function exportLikertDistributionPdf({ distribution, stats, fileName, chartElementId }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  drawReportHeader(doc, {
    title: "Likert Score Frequency Distribution Report",
    subtitle: "5-Point Likert Performance Distribution & Cohort Frequency Analysis",
    fileName,
    stats,
    totalRecords: stats?.sampleSize,
  });

  let currentY = 35;

  // Executive KPI summary boxes
  if (stats) {
    const boxWidth = (pageWidth - 28 - 9) / 4;
    const boxHeight = 16;
    const kpis = [
      { label: "OVERALL MEAN LIKERT", value: stats.meanLikert.toFixed(2) + " / 5.00", color: [6, 182, 212] },
      { label: "MEAN PERCENTAGE", value: stats.meanMarks.toFixed(1) + "%", color: [16, 185, 129] },
      { label: "CLASS GRADE", value: `Grade ${stats.grade}`, color: [99, 102, 241] },
      { label: "EVALUATION", value: stats.interpretation, color: [245, 158, 11] },
    ];

    kpis.forEach((kpi, index) => {
      const x = 14 + index * (boxWidth + 3);
      // Box background
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(x, currentY, boxWidth, boxHeight, 2, 2, "FD");

      // Accent border line at left
      doc.setFillColor(...kpi.color);
      doc.rect(x, currentY, 1.5, boxHeight, "F");

      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.label, x + 3.5, currentY + 5);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(kpi.value, x + 3.5, currentY + 12);
    });

    currentY += boxHeight + 8;
  }

  // Visual Chart Capture
  if (chartElementId) {
    const chartImg = await captureElementImage(chartElementId);
    if (chartImg) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("Frequency Distribution Visualization", 14, currentY);
      currentY += 4;

      const imgWidth = pageWidth - 28;
      const imgHeight = 65; // Fixed height in mm
      doc.addImage(chartImg, "PNG", 14, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 8;
    }
  }

  // Distribution Frequency Breakdown Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Likert Category Breakdown & Statistics", 14, currentY);
  currentY += 4;

  let cumulativeCount = 0;
  const tableData = (distribution || []).map((item) => {
    cumulativeCount += item.count;
    const cumPct = stats?.sampleSize ? ((cumulativeCount / stats.sampleSize) * 100).toFixed(1) : "-";
    return [
      `Score ${item.score}`,
      item.label,
      item.rangeLabel,
      String(item.count),
      `${item.percentage.toFixed(1)}%`,
      `${cumPct}%`,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Likert Score", "Category Label", "Marks Range", "Student Count", "Cohort Proportion", "Cumulative %"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: "bold", width: 26 },
      1: { fontStyle: "bold", width: 32 },
      2: { width: 28 },
      3: { halign: "center", fontStyle: "bold", width: 26 },
      4: { halign: "center", fontStyle: "bold", width: 34 },
      5: { halign: "center", width: 34 },
    },
    styles: {
      cellPadding: 2.5,
      lineWidth: 0.2,
      lineColor: [226, 232, 240],
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Performance Interpretation Note box
  if (currentY < doc.internal.pageSize.getHeight() - 30) {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(14, currentY, pageWidth - 28, 18, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Official Grading Reference Scale:", 18, currentY + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(71, 85, 105);
    const gradingText =
      "Grade A+ (4.50-5.00: Excellent) | Grade A (4.00-4.49: Very Good) | Grade B (3.50-3.99: Good)\n" +
      "Grade C (3.00-3.49: Satisfactory) | Grade D (2.50-2.99: Poor) | Grade E (Below 2.50: Very Poor)";
    doc.text(gradingText, 18, currentY + 10.5);
  }

  // Page footers
  addPageFooters(doc);

  // Save
  doc.save("Likert_Score_Frequency_Distribution.pdf");
}

/**
 * ────────────────────────────────────────────────────────────
 * PART 2: EXPORT EDUCATION ZONE & SCHOOL COMPARISON AS PDF
 * ────────────────────────────────────────────────────────────
 */
export async function exportSchoolComparisonPdf({ schoolBreakdown, zoneBreakdown, stats, fileName, chartElementId }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  drawReportHeader(doc, {
    title: "Education Zone & School Performance Comparison",
    subtitle: "Comparative Benchmarking of School & Zone Likert Mean Performance",
    fileName,
    stats,
    totalRecords: stats?.sampleSize,
  });

  let currentY = 35;

  // Summary Metrics
  const totalSchools = schoolBreakdown?.length || 0;
  const totalZones = zoneBreakdown?.length || 0;
  const topSchool = schoolBreakdown && schoolBreakdown.length > 0 ? schoolBreakdown[0] : null;

  const boxWidth = (pageWidth - 28 - 9) / 4;
  const boxHeight = 16;
  const kpis = [
    { label: "TOTAL ZONES", value: `${totalZones} Zone${totalZones !== 1 ? "s" : ""}`, color: [99, 102, 241] },
    { label: "TOTAL SCHOOLS", value: `${totalSchools} School${totalSchools !== 1 ? "s" : ""}`, color: [6, 182, 212] },
    { label: "COHORT MEAN", value: stats ? `${stats.meanLikert.toFixed(2)} / 5.00` : "N/A", color: [16, 185, 129] },
    { label: "TOP PERFORMER", value: topSchool ? topSchool.schoolName : "N/A", color: [245, 158, 11] },
  ];

  kpis.forEach((kpi, index) => {
    const x = 14 + index * (boxWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFillColor(...kpi.color);
    doc.rect(x, currentY, 1.5, boxHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3.5, currentY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    // Truncate long school name if needed
    const truncatedVal = doc.splitTextToSize(kpi.value, boxWidth - 5)[0];
    doc.text(truncatedVal, x + 3.5, currentY + 12);
  });

  currentY += boxHeight + 8;

  // Education Zone Breakdown Table
  if (zoneBreakdown && zoneBreakdown.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Education Zone Benchmarks", 14, currentY);
    currentY += 4;

    const zoneTableData = zoneBreakdown.map((z) => [
      z.zoneName,
      String(z.schoolCount),
      String(z.sampleSize),
      z.meanLikert.toFixed(2),
      `Grade ${z.grade.letter}`,
      `${z.passRate.toFixed(1)}%`,
      z.topSchool ? z.topSchool.schoolName : "N/A",
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Zone Name", "Schools", "Students", "Likert Mean", "Zone Grade", "Pass Rate", "Leading School"]],
      body: zoneTableData,
      theme: "striped",
      headStyles: {
        fillColor: [30, 41, 59], // slate-800
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { fontStyle: "bold", width: 34 },
        1: { halign: "center", width: 18 },
        2: { halign: "center", width: 20 },
        3: { halign: "center", fontStyle: "bold", width: 24 },
        4: { halign: "center", fontStyle: "bold", width: 24 },
        5: { halign: "center", width: 22 },
        6: { width: 40 },
      },
      styles: {
        cellPadding: 2,
        lineWidth: 0.2,
        lineColor: [226, 232, 240],
      },
      margin: { left: 14, right: 14 },
    });

    currentY = doc.lastAutoTable.finalY + 8;
  }

  // Optional Visual Chart capture if present and space permits
  if (chartElementId) {
    const chartImg = await captureElementImage(chartElementId);
    if (chartImg) {
      if (currentY > 180) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("School Performance vs Zone Benchmark Chart", 14, currentY);
      currentY += 4;

      const imgWidth = pageWidth - 28;
      const imgHeight = 55;
      doc.addImage(chartImg, "PNG", 14, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 8;
    }
  }

  // Detailed School Comparison Rankings Table
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Comprehensive School Performance Ranking Register", 14, currentY);
  currentY += 4;

  const schoolTableData = (schoolBreakdown || []).map((s, idx) => {
    const varianceStr = s.zoneDiffLikert >= 0 ? `+${s.zoneDiffLikert.toFixed(2)}` : `${s.zoneDiffLikert.toFixed(2)}`;
    return [
      `#${idx + 1}`,
      s.schoolName,
      s.zoneName,
      String(s.sampleSize),
      s.meanLikert.toFixed(2),
      `${s.meanMarks.toFixed(1)}%`,
      `Grade ${s.grade.letter}`,
      `${s.passRate.toFixed(1)}%`,
      varianceStr,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Rank", "School Name", "Zone", "Students", "Likert Mean", "Mean Marks", "Grade", "Pass Rate", "vs Zone"]],
    body: schoolTableData,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: "bold", halign: "center", width: 14 },
      1: { fontStyle: "bold", width: 44 },
      2: { width: 30 },
      3: { halign: "center", width: 16 },
      4: { halign: "center", fontStyle: "bold", width: 20 },
      5: { halign: "center", width: 20 },
      6: { halign: "center", fontStyle: "bold", width: 16 },
      7: { halign: "center", width: 18 },
      8: { halign: "center", fontStyle: "bold", width: 18 },
    },
    styles: {
      cellPadding: 2,
      lineWidth: 0.2,
      lineColor: [226, 232, 240],
    },
    margin: { left: 14, right: 14 },
  });

  // Page footers
  addPageFooters(doc);

  // Save
  doc.save("Education_Zone_and_School_Performance_Comparison.pdf");
}

/**
 * ────────────────────────────────────────────────────────────
 * PART 3: EXPORT STUDENT EVALUATION REGISTER AS PDF
 * ────────────────────────────────────────────────────────────
 */
export async function exportStudentRegisterPdf({ records, fileName, stats, filterSummary }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  drawReportHeader(doc, {
    title: "Student Evaluation Register",
    subtitle: filterSummary ? `Filtered Register • ${filterSummary}` : "Complete Official Student Performance Register",
    fileName,
    stats,
    totalRecords: records?.length,
  });

  let currentY = 35;

  // Summary Metrics Banner
  const totalCount = records?.length || 0;
  const totalMarks = records ? records.reduce((acc, r) => acc + (Number(r.marks) || 0), 0) : 0;
  const avgMarks = totalCount > 0 ? (totalMarks / totalCount).toFixed(1) : "0.0";
  const totalLikert = records ? records.reduce((acc, r) => acc + (Number(r.likertScore) || 0), 0) : 0;
  const avgLikert = totalCount > 0 ? (totalLikert / totalCount).toFixed(2) : "0.00";
  const passCount = records ? records.filter((r) => r.marks >= 40).length : 0;
  const passRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : "0.0";

  const boxWidth = (pageWidth - 28 - 9) / 4;
  const boxHeight = 15;
  const kpis = [
    { label: "STUDENTS IN REGISTER", value: `${totalCount} Record${totalCount !== 1 ? "s" : ""}`, color: [6, 182, 212] },
    { label: "AVERAGE MARKS", value: `${avgMarks}%`, color: [16, 185, 129] },
    { label: "AVERAGE LIKERT", value: `${avgLikert} / 5.00`, color: [99, 102, 241] },
    { label: "PASS RATE (>=40%)", value: `${passRate}% (${passCount})`, color: [245, 158, 11] },
  ];

  kpis.forEach((kpi, index) => {
    const x = 14 + index * (boxWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFillColor(...kpi.color);
    doc.rect(x, currentY, 1.5, boxHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3.5, currentY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, x + 3.5, currentY + 11);
  });

  currentY += boxHeight + 8;

  // Complete Student Evaluation Register Table
  const tableData = (records || []).map((r, index) => [
    String(index + 1),
    r.id,
    r.school,
    r.zoneName || "N/A",
    `${Number(r.marks).toFixed(1)}%`,
    `Score ${r.likertScore}`,
    r.likertLabel,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["#", "Student ID", "School Name", "Education Zone", "Marks (%)", "Likert Score", "Performance Level"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: "center", width: 12, textColor: [100, 116, 139] },
      1: { fontStyle: "bold", width: 28 },
      2: { width: 44 },
      3: { width: 34 },
      4: { halign: "center", fontStyle: "bold", width: 20 },
      5: { halign: "center", fontStyle: "bold", width: 22 },
      6: { halign: "center", fontStyle: "bold", width: 26 },
    },
    styles: {
      cellPadding: 2,
      lineWidth: 0.2,
      lineColor: [226, 232, 240],
    },
    margin: { left: 14, right: 14 },
    didDrawCell: (data) => {
      // Colorize Likert Score text in table
      if (data.section === "body" && data.column.index === 5) {
        const text = data.cell.raw;
        if (text.includes("5")) doc.setTextColor(16, 185, 129);
        else if (text.includes("4")) doc.setTextColor(6, 182, 212);
        else if (text.includes("3")) doc.setTextColor(99, 102, 241);
        else if (text.includes("2")) doc.setTextColor(245, 158, 11);
        else if (text.includes("1")) doc.setTextColor(239, 68, 68);
      }
    },
  });

  // Page footers
  addPageFooters(doc);

  // Save
  doc.save("Student_Evaluation_Register.pdf");
}
