import type { Metadata } from "next";
import "@/styles/globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LumiFit | AI Personal Stylist & Virtual Try-On",
  description: "Experience fashion confidence with LumiFit - an AI-powered styling and virtual try-on platform that finds the perfect fit and colors for your skin tone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans antialiased scroll-smooth", outfit.variable)}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
