import "./globals.css";

export const metadata = {
  title: "Math Performance 5-Point Likert Scale Visualizer",
  description: "Client-side web application that calculates and visualizes a 5-point Likert-type performance scale for mathematics test scores based on CSV data.",
  keywords: ["Mathematics", "Likert Scale", "Performance Evaluation", "Next.js", "Recharts", "Data Visualization"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090D16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
