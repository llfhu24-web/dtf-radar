import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getMessages } from "@/lib/i18n/messages";
import { withLocale } from "@/lib/i18n/runtime";

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
  const locale = "en" as const;
  const t = getMessages(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-900">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
              <Link href={withLocale("/", locale)} className="text-lg font-semibold tracking-tight text-zinc-950">
                {t.siteTitle}
              </Link>
              <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
                <Link href={withLocale("/", locale)} className="transition hover:text-zinc-950">
                  {t.nav.home}
                </Link>
                <Link href={withLocale("/dashboard", locale)} className="transition hover:text-zinc-950">
                  {t.nav.dashboard}
                </Link>
                <Link href={withLocale("/competitors", locale)} className="transition hover:text-zinc-950">
                  {t.nav.competitors}
                </Link>
                <Link href={withLocale("/alerts", locale)} className="transition hover:text-zinc-950">
                  {t.nav.alerts}
                </Link>
              </nav>
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href="/?lang=en"
                  className="rounded-full bg-zinc-950 px-3 py-1 text-white"
                >
                  EN
                </Link>
                <Link
                  href="/?lang=zh-Hans"
                  className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700"
                >
                  简中
                </Link>
                <Link
                  href="/?lang=zh-Hant"
                  className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700"
                >
                  繁中
                </Link>
              </div>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
