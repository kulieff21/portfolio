// Page chrome and the home page sections (server components).

import Link from "next/link";
import { Suspense } from "react";
import { PROJECTS } from "@/content/work";
import { getDict, LOCALES, SKILLS, type Locale } from "@/i18n/dict";
import { INSTRUMENTS } from "./instruments";
import { LangSwitch } from "./LangSwitch";
import { LiveStrip } from "./LiveStrip";
import { Module } from "./Module";
import { Reveal } from "./Reveal";
import { Selector } from "./Selector";
import styles from "./Site.module.css";

export const CV_FILES = { az: "/cv/Elmar_Quliyev_CV_AZ.pdf", en: "/cv/Elmar_Guliyev_CV_EN.pdf" } as const;
export const EMAIL = "kulieff21@gmail.com";
export const GITHUB = "https://github.com/kulieff21";

export function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href={`/${locale}`} className={styles.brand}>
          <span className={styles.mark} aria-hidden>
            <i />
          </span>
          {t.name}
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <a href={`/${locale}#work`}>{t.nav.work}</a>
          <a href={`/${locale}#about`}>{t.nav.about}</a>
          <a href={`/${locale}#contact`}>{t.nav.contact}</a>
        </nav>
        <div className={styles.actions}>
          <Suspense
            fallback={
              <div className={styles.lang}>
                {LOCALES.map((l) => (
                  <Link key={l} href={`/${l}`} aria-current={l === locale ? "true" : undefined}>
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
            }
          >
            <LangSwitch locale={locale} className={styles.lang} />
          </Suspense>
          <a href={CV_FILES[locale]} className={`btn ${styles.cvBtn}`} download>
            {t.nav.cv}
          </a>
        </div>
      </div>
    </header>
  );
}

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale).hero;
  const [a, b, em, c] = t.title;
  return (
    <section className={`container ${styles.hero}`}>
      <div className={styles.heroGrid}>
        <div className={styles.heroText}>
          <p className="label">{t.kicker}</p>
          <h1 className={styles.title}>
            <span className={styles.line}>{a}</span>
            <span className={styles.line}>
              {b}
              <em>{em}</em>
              {c}
            </span>
          </h1>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.ctas}>
            <a href="#work" className="btn">
              {t.work} <span aria-hidden>↓</span>
            </a>
            <a href={CV_FILES[locale]} className="btn btnGhost" download>
              {t.cv}
            </a>
          </div>
        </div>
        <Selector locale={locale} />
      </div>
      <LiveStrip locale={locale} />
    </section>
  );
}

export function Rack({ locale }: { locale: Locale }) {
  const t = getDict(locale).rack;
  return (
    <section id="work" className={styles.rackSection}>
      <div className="container">
        <header className={styles.sectionHead}>
          <span className={styles.count}>{String(PROJECTS.length).padStart(2, "0")}</span>
          <h2>{t.title}</h2>
          <p>{t.lead}</p>
        </header>
        <div className={styles.rack}>
          {PROJECTS.map((p, i) => {
            const ins = INSTRUMENTS[p.slug];
            return (
              <Reveal key={p.slug} delay={(i % 2) * 0.08} span={ins.span}>
                <Module project={p} locale={locale} live={ins.live} span={12} screen={ins.screen}>
                  <ins.Component locale={locale} />
                </Module>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function About({ locale }: { locale: Locale }) {
  const t = getDict(locale).about;
  return (
    <section id="about" className={`container ${styles.about}`}>
      <header className={styles.sectionHead}>
        <h2>{t.title}</h2>
      </header>
      <div className={styles.aboutGrid}>
        <div className={styles.aboutText}>
          {t.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className={styles.facts}>
          <h3 className="label">{t.education}</h3>
          <ul className={styles.edu}>
            {t.edu.map((e) => (
              <li key={e.what}>
                <b>{e.what}</b>
                <span>{e.where}</span>
                <span className={styles.when}>{e.when}</span>
              </li>
            ))}
          </ul>
          <h3 className="label">{t.skills}</h3>
          <dl className={styles.skills}>
            {SKILLS.map((s) => (
              <div key={s.group.en}>
                <dt>{s.group[locale]}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
          <h3 className="label">{t.languages}</h3>
          <p className={styles.langs}>{t.langs}</p>
        </div>
      </div>
    </section>
  );
}

export function Contact({ locale }: { locale: Locale }) {
  const t = getDict(locale).contact;
  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <p className="label">{t.title}</p>
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
        <p className={styles.contactLead}>{t.lead}</p>
        <div className={styles.contactLinks}>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="btn btnGhost">
            {t.github} ↗
          </a>
          <a href={CV_FILES.az} className="btn btnGhost" download>
            {t.cvAz}
          </a>
          <a href={CV_FILES.en} className="btn btnGhost" download>
            {t.cvEn}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <span>© 2026 {t.name}</span>
        <span>{t.footer}</span>
      </div>
    </footer>
  );
}
