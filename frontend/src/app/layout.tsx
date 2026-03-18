import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "METUCom",
  description:
    "Discover and join university communities and events at METU.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-gray-900 antialiased`}
            >
              <Navbar />
              <main>{children}</main>
            </body>
    </html>
  );
}
