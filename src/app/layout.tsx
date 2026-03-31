import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "DTF Radar",
  description:
    "Competitor intelligence for DTF sellers: pricing, product launches, promotions, and messaging changes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-900">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
              <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950">
                DTF Radar
              </Link>
              <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
                <Link href="/" className="transition hover:text-zinc-950">
                  Home
                </Link>
                <Link href="/dashboard" className="transition hover:text-zinc-950">
                  Dashboard
                </Link>
                <Link href="/competitors" className="transition hover:text-zinc-950">
                  Competitors
                </Link>
                <Link href="/alerts" className="transition hover:text-zinc-950">
                  Alerts
                </Link>
              </nav>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
