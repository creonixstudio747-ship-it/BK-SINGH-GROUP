import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "B.K. Singh Classes | Elite Academic Excellence",
  description:
    "India's premier learning ecosystem for Classes 9th–12th. Master your School Boards and Competitive Foundations with B.K. Singh Classes.",
  keywords: ["BK Singh Classes", "BSEB", "CBSE", "Bihar Board", "Class 9", "Class 10", "Class 11", "Class 12"],
  openGraph: {
    title: "B.K. Singh Classes",
    description: "The Gold Standard of Academic Excellence in Bihar.",
    url: "https://bksinghclasses.com",
    siteName: "B.K. Singh Classes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
