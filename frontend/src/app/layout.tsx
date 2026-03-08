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
  title: "METU Clubs — Campus Community Platform",
  description:
    "Discover university clubs, explore campus events, and join the communities that match your interests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <div className="relative min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-500/[0.07] blur-3xl" />
            <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/[0.05] blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.04] blur-3xl" />
          </div>
          <Navbar />
          <main className="pt-8 pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
