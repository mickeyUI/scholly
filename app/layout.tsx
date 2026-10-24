import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";
import { SavedProvider } from "./lib/saved-context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Scholly — AI-Powered University & Scholarship Discovery Platform",
  description: "Discover verified universities, degree programs, and full-ride scholarships worldwide with inline official source citations and AI research assistance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F5] text-zinc-900 selection:bg-[#FEF3C7] selection:text-[#92400E]">
        <AuthProvider>
          <SavedProvider>
            <Suspense fallback={<header className="h-16 bg-white border-b border-[#EDE4D3]" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1 flex flex-col">
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8"><div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin" /></div>}>
                {children}
              </Suspense>
            </main>
            <Footer />
            <AuthModal />
          </SavedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
