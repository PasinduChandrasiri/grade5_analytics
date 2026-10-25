import "./globals.css";

export const metadata = {
  title: "Universal Educational Performance Evaluator | Likert Scale Analytics",
  description: "Comprehensive multi-subject educational evaluation and analytics platform calculating 5-point Likert scale metrics, institutional letter grades, and school benchmarks.",
  keywords: ["Universal Evaluation", "Educational Performance", "Likert Scale", "Grade 9", "Grade 10", "Mathematics", "Science", "School Analytics", "Next.js", "Recharts"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
