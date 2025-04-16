import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: "Adams Mujahid | Full Stack Developer",
  description: "Full Stack Developer specializing in web and mobile development using Next.js, Flutter, and Firebase",
  keywords: ["Full Stack Developer", "Web Development", "Mobile Development", "Next.js", "Flutter"],
  authors: [{ name: "Adams Mujahid" }],
  openGraph: {
    title: "Adams Mujahid | Full Stack Developer",
    description: "Full Stack Developer specializing in web and mobile development",
    url: "https://your-portfolio-url.com",
    siteName: "Adams Mujahid Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
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
    <html lang="en">
      
      <body className={inter.className}>
      <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
