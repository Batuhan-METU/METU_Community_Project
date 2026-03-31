import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/landing/Footer";
import { AuthProvider } from "../context/AuthContext";
import { ChatUnreadProvider } from "../context/ChatUnreadContext";
import { JoinedEventsProvider } from "../context/JoinedEventsContext";
import { RateEventModalProvider } from "../context/RateEventModalContext";
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
    "Discover and join university clubs and events at METU.",
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
        <AuthProvider>
          <ChatUnreadProvider>
            <JoinedEventsProvider>
              <RateEventModalProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </RateEventModalProvider>
            </JoinedEventsProvider>
          </ChatUnreadProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
