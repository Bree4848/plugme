import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import AuthListener from '@/components/AuthListener'
import { ThemeProvider } from "@/components/ThemeProvider";
// 1. IMPORT the Script component
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlugMe - Local Business Directory",
  description: "Find and post local businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
  <head>
    {/* 2. ADD the AdSense script inside the <head> */}
    {/* Use 'afterInteractive' so it doesn't slow down your Supabase data fetching */}
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3150303085572679"
 crossOrigin="anonymous"></script>
    {/* PlugMe_Home_Top */}
    <ins className="adsbygoogle"
 style={{display: "block"}}
 data-ad-client="ca-pub-3150303085572679"
 data-ad-slot="5263056924"
 data-ad-format="auto"
 data-full-width-responsive="true"></ins>
    <script>
 (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <AuthListener />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}