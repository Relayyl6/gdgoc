import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://gdgoc-six.vercel.app"),
  title: "GDGOC UNIBEN | Google Developer Groups on Campus",
  description: "Join the Google Developer Groups on Campus at the University of Benin. Learn, build, and grow with a modern, tech-forward community platform.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "GDGOC UNIBEN",
    description: "Google Developer Groups on Campus at the University of Benin.",
    url: "https://gdgoc-six.vercel.app",
    siteName: "GDGOC UNIBEN",
    images: [
      {
        url: "/gdgoc-social-share.png", 
        width: 1200,
        height: 630,
        alt: "GDGOC Social Share",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-200">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
