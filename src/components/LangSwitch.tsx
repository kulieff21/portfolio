"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/dict";

export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const rest = usePathname().split("/").slice(2).join("/");
  return (
    <div className={className} role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <Link key={l} href={`/${l}${rest ? `/${rest}` : ""}`} aria-current={l === locale ? "true" : undefined} hrefLang={l}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
