import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { headers } from "next/headers";
import "./globals.css";
import { resolveLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { swapLocaleInPath, withLocale } from "@/lib/i18n/runtime";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const searchParamsLang = headerStore.get("x-invoke-query-lang");
  const pathname = headerStore.get("x-invoke-pathname") || "/";
  const search = headerStore.get("x-invoke-query") || "";
  const currentPath = search ? `${pathname}?${search}` : pathname;
  const locale = resolveLocale(searchParamsLang);
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
                  href={swapLocaleInPath(currentPath, "en")}
                  className={`rounded-full px-3 py-1 ${locale === "en" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"}`}
                >
                  EN
                </Link>
                <Link
                  href={swapLocaleInPath(currentPath, "zh-Hans")}
                  className={`rounded-full px-3 py-1 ${locale === "zh-Hans" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"}`}
                >
                  简中
                </Link>
                <Link
                  href={swapLocaleInPath(currentPath, "zh-Hant")}
                  className={`rounded-full px-3 py-1 ${locale === "zh-Hant" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"}`}
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
