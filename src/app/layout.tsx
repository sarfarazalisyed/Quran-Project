import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quran Project — Read, Listen, Memorize & Understand the Holy Quran",
    template: "%s | Quran Project",
  },
  description:
    "A beautiful, open-source Quran web application. Read with stunning Arabic typography, listen to 600+ reciters, memorize with spaced repetition, track daily goals, and explore Duas & Athkar.",
  keywords: [
    "Quran",
    "Islam",
    "Recitation",
    "Memorization",
    "Hifz",
    "Dua",
    "Arabic",
    "Tafsir",
    "Quran Online",
    "Read Quran",
    "Quran Audio",
  ],
  authors: [{ name: "Quran Project" }],
  openGraph: {
    title: "Quran Project — Read, Listen, Memorize & Understand",
    description:
      "A free, open-source platform to read, listen, memorize, and understand the Holy Quran.",
    type: "website",
    siteName: "Quran Project",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Project",
    description: "Read, Listen, Memorize & Understand the Holy Quran",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <TooltipProvider>
          <Navbar />
          <main className="flex-1 pt-16 pb-20 md:pb-0">{children}</main>
        </TooltipProvider>

        {/* JSON-LD Structured Data for AEO / SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Quran Project",
              description:
                "A free, open-source platform to read, listen, memorize, and understand the Holy Quran.",
              applicationCategory: "ReligiousApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "Quran Project" },
            }),
          }}
        />
      </body>
    </html>
  );
}
