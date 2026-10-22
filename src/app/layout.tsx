import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  title: "Morphly — Universal File Converter, Image Studio & Code Beautifier",
  description:
    "An all-in-one studio-grade web utility prioritizing extreme speed, zero data retention, and client-side processing for documents, images, and source code. Free, private, and unlimited.",
  keywords: [
    "Morphly",
    "PDF to Word",
    "DOCX converter",
    "Image Compressor",
    "WebP Converter",
    "AVIF encoder",
    "Code Formatter",
    "Monaco Editor",
    "Prettier online",
    "Zero retention converter",
    "Privacy file tools",
    "Sarkari exam photo resizer",
  ],
  authors: [{ name: "Morphly Team" }],
  metadataBase: new URL("https://morphly.pro"),
  openGraph: {
    title: "Morphly — Universal Document Converter & Image Studio",
    description:
      "Convert documents to any format, compress images in all modes, and format multi-language code. 100% ephemeral and client-side processing.",
    url: "https://morphly.pro",
    siteName: "Morphly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morphly — Universal Utility Studio",
    description: "Convert any file, compress images, and format code with zero data retention.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Google AdSense Script (Loads asynchronously when Client ID is configured) */}
        {ADSENSE_CLIENT_ID && (
          <Script
            id="google-adsense"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-[#fafbfc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-600 selection:text-white font-sans transition-colors duration-200">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
