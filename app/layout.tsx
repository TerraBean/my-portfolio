import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import { ToastProvider } from "./components/ui/toast";

// Initialize services on server startup
if (typeof window === 'undefined') {
  import('../lib/startup').then(({ initializeServices }) => {
    initializeServices();
  }).catch(console.error);
}

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain in production
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
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Analytics />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
