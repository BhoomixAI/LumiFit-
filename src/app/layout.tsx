import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Personal Style Profile | LumiFit AI",
  description: "Enter your body dimensions and color seasonal palette so our AI stylist can curate perfect fashion recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col text-slate-800 selection:bg-[#90CDF4]/40 selection:text-sky-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
