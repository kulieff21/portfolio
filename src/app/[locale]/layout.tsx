import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDict, isLocale, LOCALES } from "@/i18n/dict";
import "../globals.css";

// Geist for text: its ə/Ə match the alphabet (Instrument Sans's did not; compared by rendering).
const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist-sans" });
// Fraunces: a display serif whose Azerbaijani ə matches the rest of the alphabet
// (Instrument Serif's did not; checked by rendering, 2026-11-14).
const serif = Fraunces({ subsets: ["latin", "latin-ext"], axes: ["opsz"], style: ["normal", "italic"], variable: "--font-fraunces" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono" });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: { default: t.meta.title, template: `%s · ${t.name}` },
    description: t.meta.description,
    alternates: { canonical: `/${locale}`, languages: { az: "/az", en: "/en" } },
    openGraph: { title: t.meta.title, description: t.meta.description, locale, type: "website" },
  };
}

export default async function Layout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
