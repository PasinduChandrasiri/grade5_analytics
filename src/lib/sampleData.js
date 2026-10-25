/**
 * Universal dataset generator and templates for Educational Evaluation
 * Expected Headers: Student_ID,Marks_Percentage,School_Name,Zone_Name,Grade,Class,Subject
 */

export const SAMPLE_CSV_DATA = `Student_ID,Marks_Percentage,School_Name,Zone_Name,Grade,Class,Subject
STD-101,94.5,St. Peter High School,Central Zone,Grade 10,Class A,Mathematics
STD-102,88.0,St. Peter High School,Central Zone,Grade 10,Class A,Mathematics
STD-103,76.5,St. Peter High School,Central Zone,Grade 10,Class B,Mathematics
STD-104,82.0,St. Peter High School,Central Zone,Grade 10,Class B,Science
STD-105,65.0,St. Peter High School,Central Zone,Grade 9,Class A,Science
STD-106,59.0,St. Peter High School,Central Zone,Grade 9,Class A,Mathematics
STD-107,43.5,St. Peter High School,Central Zone,Grade 9,Class B,Health
STD-108,34.0,St. Peter High School,Central Zone,Grade 9,Class B,Health
STD-109,18.5,St. Peter High School,Central Zone,Grade 10,Class A,Health
STD-110,91.0,St. Peter High School,Central Zone,Grade 10,Class A,Science
STD-111,72.0,Apex Science Academy,Central Zone,Grade 10,Class A,Science
STD-112,68.5,Apex Science Academy,Central Zone,Grade 10,Class A,Mathematics
STD-113,85.0,Apex Science Academy,Central Zone,Grade 10,Class B,Mathematics
STD-114,48.0,Apex Science Academy,Central Zone,Grade 10,Class B,Science
STD-115,54.5,Apex Science Academy,Central Zone,Grade 9,Class A,Health
STD-116,39.0,Apex Science Academy,Central Zone,Grade 9,Class A,Health
STD-117,28.0,Apex Science Academy,Central Zone,Grade 9,Class B,Mathematics
STD-118,63.0,Apex Science Academy,Central Zone,Grade 9,Class B,Science
STD-119,89.5,Apex Science Academy,Central Zone,Grade 10,Class A,Health
STD-120,77.0,Apex Science Academy,Central Zone,Grade 10,Class B,Mathematics
STD-121,52.0,Oakridge Model School,North Zone,Grade 10,Class A,Mathematics
STD-122,44.0,Oakridge Model School,North Zone,Grade 10,Class A,Science
STD-123,38.5,Oakridge Model School,North Zone,Grade 10,Class B,Science
STD-124,25.0,Oakridge Model School,North Zone,Grade 9,Class A,Mathematics
STD-125,14.0,Oakridge Model School,North Zone,Grade 9,Class A,Health
STD-126,67.0,Oakridge Model School,North Zone,Grade 9,Class B,Health
STD-127,71.5,Oakridge Model School,North Zone,Grade 9,Class B,Mathematics
STD-128,83.0,Oakridge Model School,North Zone,Grade 10,Class A,Health
STD-129,49.0,Oakridge Model School,North Zone,Grade 10,Class B,Science
STD-130,56.0,Oakridge Model School,North Zone,Grade 10,Class B,Health
STD-131,92.0,Apex Science Academy,Central Zone,Grade 9,Class A,Mathematics
STD-132,84.0,Oakridge Model School,North Zone,Grade 10,Class A,Mathematics
STD-133,78.5,St. Peter High School,Central Zone,Grade 9,Class B,Science
STD-134,62.0,St. Peter High School,Central Zone,Grade 10,Class B,Health
STD-135,31.0,Oakridge Model School,North Zone,Grade 9,Class B,Science`;

export const TEMPLATE_CSV_CONTENT = `Student_ID,Marks_Percentage,School_Name,Zone_Name,Grade,Class,Subject
STD-001,88,Central High School,Central Zone,Grade 10,Class A,Mathematics
STD-002,74,Central High School,Central Zone,Grade 10,Class A,Science
STD-003,59,Central High School,Central Zone,Grade 9,Class B,Health
STD-004,38,Central High School,Central Zone,Grade 9,Class A,Mathematics
STD-005,19,Central High School,Central Zone,Grade 10,Class B,Science`;

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
