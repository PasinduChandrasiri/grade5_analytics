import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://universal-educational-performance-evaluator.vercel.app"),
  title: "Universal Educational Performance Evaluator | Student Grading & Analytics Dashboard",
  description:
    "Analyze and evaluate student academic performance across any school, zone, or subject. Convert test percentages into 5-point Likert scales, calculate average metrics, view interactive charts, and export executive PDF reports instantly.",
  keywords: [
    "education analytics",
    "student performance evaluator",
    "5-point Likert scale grading",
    "school benchmarking tool",
    "multi-subject student grading",
    "CSV grade uploader",
  ],
  authors: [{ name: "D.M.S. Dassanayake" }],
  creator: "D.M.S. Dassanayake",
  publisher: "D.M.S. Dassanayake",
  openGraph: {
    title: "Universal Educational Performance Evaluator | Student Grading & Analytics Dashboard",
    description:
      "Analyze and evaluate student academic performance across any school, zone, or subject. Convert test percentages into 5-point Likert scales, calculate average metrics, view interactive charts, and export executive PDF reports instantly.",
    url: "https://universal-educational-performance-evaluator.vercel.app",
    siteName: "Universal Educational Performance Evaluator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Educational Performance Evaluator | Student Grading & Analytics Dashboard",
    description:
      "Analyze and evaluate student academic performance across any school, zone, or subject. Convert test percentages into 5-point Likert scales, calculate average metrics, view interactive charts, and export executive PDF reports instantly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "adGaiElxXcpfnJZdXa6t5jwFyh9tmH-kdZq5ORLmUAA",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Universal Educational Performance Evaluator",
  operatingSystem: "Web Browser",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Analyze and evaluate student academic performance across any school, zone, or subject. Convert test percentages into 5-point Likert scales, calculate average metrics, view interactive charts, and export executive PDF reports instantly.",
  author: {
    "@type": "Person",
    name: "D.M.S. Dassanayake",
  },
  featureList: [
    "Universal multi-subject student performance evaluation",
    "5-Point Likert scale mapping",
    "Institutional letter grading (A+ to E)",
    "Dynamic cohort filtering by Subject, Grade, and Class",
    "Interactive Likert distribution and school comparison charts",
    "Searchable and sortable student data register",
    "Client-side executive PDF and CSV reporting suite",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
