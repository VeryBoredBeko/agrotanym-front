import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import { Toaster } from "@/components/ui/sonner"
import { Navbar1 } from "@/components/layout/navbar-burger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agrotanym",
  description: "Егіншілер үшін арналған",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
        mx-auto w-full md:max-w-[1280px] sm:max-w-[640px]`}
      >
        <header className="">
          {/* <Navbar /> */}
          <Navbar1 />
        </header>
        <main className="overflow-auto">{children}</main>
        <Toaster richColors closeButton />
        <footer className="mt-20">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
