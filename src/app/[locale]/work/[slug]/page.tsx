// One project's case page: the instrument large, then problem, what I did, my role,
// result, stack and where the numbers come from.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { INSTRUMENTS } from "@/components/instruments";
import { Module } from "@/components/Module";
import { Contact, Footer, Header } from "@/components/Site";
import { getProject, PROJECTS } from "@/content/work";
import { getDict, isLocale, LOCALES } from "@/i18n/dict";
import styles from "./case.module.css";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => PROJECTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLocale(locale)) return {};
  return {
    title: p.title[locale],
    description: p.tagline[locale],
    alternates: { canonical: `/${locale}/work/${slug}`, languages: { az: `/az/work/${slug}`, en: `/en/work/${slug}` } },
  };
}

// The URL (locale, slug) is read inside <Suspense>, so a client navigation can show the
// shared page shell instantly while the case streams in. Every case is still prerendered.
export default function CasePage({ params }: PageProps<"/[locale]/work/[slug]">) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <Case params={params} />
    </Suspense>
  );
}

async function Case({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLocale(locale)) notFound();
  const t = getDict(locale);
  const ins = INSTRUMENTS[p.slug];
  const next = PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];

  return (
    <>
      <Header locale={locale} />
      <main className={`container ${styles.page}`}>
        <Link href={`/${locale}#work`} className={styles.back}>
          ← {t.case.back}
        </Link>
        <header className={styles.head}>
          <span className={styles.index}>{p.index}</span>
          <h1>{p.title[locale]}</h1>
          <p className={styles.tagline}>{p.tagline[locale]}</p>
          <div className={styles.links}>
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="btn">
                {t.rack.site} ↗
              </a>
            )}
            {p.code && (
              <a href={p.code} target="_blank" rel="noreferrer" className="btn btnGhost">
                {t.rack.code} ↗
              </a>
            )}
          </div>
        </header>

        <div className={styles.instrument}>
          <Module project={p} locale={locale} live={ins.live} span={12} screen={Math.round(ins.screen * 1.25)}>
            <ins.Component locale={locale} />
          </Module>
        </div>

        <div className={styles.body}>
          <section>
            <h2 className="label">{t.case.problem}</h2>
            <p className={styles.problem}>{p.problem[locale]}</p>
          </section>
          <section>
            <h2 className="label">{t.case.did}</h2>
            <ol className={styles.did}>
              {p.did.map((d) => (
                <li key={d.en}>{d[locale]}</li>
              ))}
            </ol>
          </section>
          <section className={styles.side}>
            <h2 className="label">{t.case.role}</h2>
            <p>{p.role[locale]}</p>
            <h2 className="label">{t.case.results}</h2>
            <ul className={styles.results}>
              {p.results.map((r) => (
                <li key={r.en}>{r[locale]}</li>
              ))}
            </ul>
            <h2 className="label">{t.case.stack}</h2>
            <ul className={styles.stack}>
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h2 className="label">{t.case.source}</h2>
            <a href={p.source} target="_blank" rel="noreferrer" className={styles.source}>
              {p.source.replace("https://", "")}
            </a>
          </section>
        </div>

        <Link href={`/${locale}/work/${next.slug}`} className={styles.next}>
          <span className="label">{t.case.next}</span>
          <span className={styles.nextTitle}>
            {next.title[locale]} <span aria-hidden>→</span>
          </span>
        </Link>
      </main>
      <Contact locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
