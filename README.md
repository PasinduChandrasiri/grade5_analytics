# Universal Educational Performance Evaluator

An educational evaluation and analytics platform built with **Next.js**, designed for schools, teachers, and educational administrative zones across all academic subjects (e.g. Mathematics, Science, Health, Languages). This application automates the conversion of raw student test percentages into standardized **5-Point Likert Scale** metrics, institutional **Letter Grades**, and comprehensive multi-subject performance reports.

> **Implemented by**: D.M.S. Dassanayake

---

## 🎯 What Does This Application Do?

Evaluating student test scores across multiple classrooms, subjects, grades, and educational zones often involves disparate spreadsheets and tedious manual calculations. This application solves that problem by providing a fast, client-side analytics suite that:

1. **Universal Multi-Subject CSV Ingestion**: Accepts CSV files of student marks across any subject (Mathematics, Science, Health, etc.) and grade levels (Grade 9, Grade 10, etc.), automatically identifying columns and validating records.
2. **Standardizes Performance with a 5-Point Likert Scale**: Translates numeric percentages into an educational 5-point Likert performance model (from *Very Poor* to *Excellent*).
3. **Cohort Filtering (Subject, Grade, Class)**: Dynamically filters cohort metrics, distributions, and school rankings by Subject, Grade, and Class.
4. **Calculates School & Zone Benchmarks**: Automatically aggregates cohort statistics, computes pass rates ($\ge 40\%$), ranks participating schools, and evaluates performance against educational zone averages.
5. **Visualizes Cohort Distribution**: Generates interactive charts illustrating how students are distributed across performance tiers with context indicators.
6. **Generates Executive Reports**: Exports presentation-ready PDF reports (Distribution, School Comparison, and Student Register with Subject/Grade/Class) and filtered CSV summary registers for administrative use.

---

## 📊 Evaluation & Grading Methodology

### 1. 5-Point Likert Scale Mapping (Per Student)

Each student's test score percentage is mapped directly to a Likert level:

| Likert Score | Level | Score Range | Color Code | Description |
|:---:|:---|:---:|:---:|:---|
| **5** | **Excellent** | 81% – 100% | Emerald | Outstanding mastery of subject competencies |
| **4** | **Good** | 61% – 80% | Cyan | Above-average proficiency and comprehension |
| **3** | **Satisfactory** | 41% – 60% | Indigo | Meets basic curriculum grade-level standards |
| **2** | **Poor** | 21% – 40% | Amber | Requires targeted academic intervention |
| **1** | **Very Poor** | 0% – 20% | Rose | Critical deficiency requiring remedial support |

---

### 2. Institutional Letter Grading (Per School / Zone / Cohort)

Based on the calculated **Mean Likert Score** (ranging from 1.00 to 5.00), the system assigns an institutional letter grade and qualitative performance descriptor:

| Mean Likert Score Range | Institutional Grade | Class Interpretation |
|:---:|:---:|:---|
| **4.50 – 5.00** | **A+** | Excellent |
| **4.00 – 4.49** | **A** | Very Good |
| **3.50 – 3.99** | **B** | Good |
| **3.00 – 3.49** | **C** | Satisfactory |
| **2.50 – 2.99** | **D** | Poor |
| **Below 2.50** | **E** | Very Poor |

---

## 🚀 Key Features

- **Universal Multi-Subject CSV Upload**:
  - Drag-and-drop or file picker support.
  - Flexible header detection (supports variations like `Student_ID`, `Marks_Percentage`, `School_Name`, `Zone_Name`, `Grade`, `Class`, `Subject`).
  - Pre-packaged multi-subject sample dataset (`Sample_Universal_Evaluation.csv`) for instant one-click demonstration.
  - Downloadable CSV starter template (`universal_evaluation_template.csv`).

- **Dynamic Cohort Scope Filtering**:
  - Filter entire dashboard by **Subject** (e.g., Mathematics, Science, Health).
  - Filter by **Grade Level** (e.g., Grade 9, Grade 10).
  - Filter by **Class / Section** (e.g., Class A, Class B).
  - All charts, metrics, and exports immediately reflect the selected cohort.

- **Interactive Visualizations**:
  - **Likert Distribution Chart**: Frequency count and percentage distribution bar charts with subject/grade context labels and custom tooltips.
  - **School & Zone Comparison Chart**: Comparative bar chart benchmarking schools side-by-side, filterable by educational zone with variance indicators against the zone mean.

- **KPI Metric Highlights**:
  - Overall Sample Size, Mean Likert Score, Average Percentage, Cohort Pass Rate ($\ge 40\%$), and Min/Max Score boundaries.

- **Searchable Student Data Register**:
  - Paginated table of individual student results displaying `Student ID`, `School Name`, `Subject`, `Grade`, `Class`, `Marks (%)`, `Likert Score`, and `Performance Level`.
  - Search by Student ID, School Name, Subject, Grade, or Class.
  - Multi-column sorting (Student ID, School, Subject, Grade, Class, Marks, Likert Score).

- **Executive PDF & CSV Export Suite**:
  - **Likert Distribution PDF Report**: Executive summary including cohort statistics and embedded visual chart canvas with dynamic naming (e.g. `[Subject] Performance Report - [Grade]`).
  - **Zone & School Comparison PDF Report**: Comparative performance scorecards, rankings, pass rates, and zone variance tables.
  - **Student Evaluation Register PDF**: Full multi-page tabular register including `Subject`, `Grade`, and `Class` columns.
  - **School Comparison CSV**: Machine-readable aggregated benchmark report reflecting active cohort filters.

---

## 📁 CSV Data Format

The application expects a comma-separated values (`.csv`) file with the following 7 headers:

```csv
Student_ID,Marks_Percentage,School_Name,Zone_Name,Grade,Class,Subject
STD-101,94.5,St. Peter High School,Central Zone,Grade 10,Class A,Mathematics
STD-102,88.0,St. Peter High School,Central Zone,Grade 10,Class A,Mathematics
STD-103,76.5,St. Peter High School,Central Zone,Grade 10,Class B,Science
STD-104,42.0,Oakridge Model School,North Zone,Grade 9,Class A,Health
```

*Note: If `Grade`, `Class`, `Subject`, or `Zone_Name` are omitted in a legacy CSV, the system applies safe default fallbacks automatically.*

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts & Graphics**: [Recharts](https://recharts.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF), [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable), and [html2canvas](https://html2canvas.hertzen.com/)
- **CSV Engine**: [PapaParse](https://www.papaparse.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation & Run

1. Clone or open the repository:
   ```bash
   cd "school evaluation"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Click **"Load Demo Data"** to explore the multi-subject dashboard immediately, or upload your own CSV file.
