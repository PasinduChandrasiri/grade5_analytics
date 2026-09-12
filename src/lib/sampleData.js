/**
 * Sample dataset generator for Mathematics Evaluation
 * Expected Headers: Student_ID, Marks_Percentage, School_Name
 */

export const SAMPLE_CSV_DATA = `Student_ID,Marks_Percentage,School_Name,Zone_Name
STD-101,94.5,St. Peter High School,Central Zone
STD-102,88.0,St. Peter High School,Central Zone
STD-103,76.5,St. Peter High School,Central Zone
STD-104,82.0,St. Peter High School,Central Zone
STD-105,65.0,St. Peter High School,Central Zone
STD-106,59.0,St. Peter High School,Central Zone
STD-107,43.5,St. Peter High School,Central Zone
STD-108,34.0,St. Peter High School,Central Zone
STD-109,18.5,St. Peter High School,Central Zone
STD-110,91.0,St. Peter High School,Central Zone
STD-111,72.0,Apex Science Academy,Central Zone
STD-112,68.5,Apex Science Academy,Central Zone
STD-113,85.0,Apex Science Academy,Central Zone
STD-114,48.0,Apex Science Academy,Central Zone
STD-115,54.5,Apex Science Academy,Central Zone
STD-116,39.0,Apex Science Academy,Central Zone
STD-117,28.0,Apex Science Academy,Central Zone
STD-118,63.0,Apex Science Academy,Central Zone
STD-119,89.5,Apex Science Academy,Central Zone
STD-120,77.0,Apex Science Academy,Central Zone
STD-121,52.0,Oakridge Model School,North Zone
STD-122,44.0,Oakridge Model School,North Zone
STD-123,38.5,Oakridge Model School,North Zone
STD-124,25.0,Oakridge Model School,North Zone
STD-125,14.0,Oakridge Model School,North Zone
STD-126,67.0,Oakridge Model School,North Zone
STD-127,71.5,Oakridge Model School,North Zone
STD-128,83.0,Oakridge Model School,North Zone
STD-129,49.0,Oakridge Model School,North Zone
STD-130,56.0,Oakridge Model School,North Zone`;

export const TEMPLATE_CSV_CONTENT = `Student_ID,Marks_Percentage,School_Name,Zone_Name
STD-001,85,Central High School,Central Zone
STD-002,72,Central High School,Central Zone
STD-003,58,Central High School,Central Zone
STD-004,36,Central High School,Central Zone
STD-005,19,Central High School,Central Zone`;

/**
 * Trigger file download for CSV content.
 */
export function downloadCsvFile(content, filename = "School_Comparison_Report.csv") {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
