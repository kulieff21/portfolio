// One instrument module in the rack: label plate, screen, readouts, links.
// The screen (children) is the project's own instrument.

import Link from "next/link";
import type { ReactNode } from "react";
import { text, type Project } from "@/content/work";
import { getDict, type Locale } from "@/i18n/dict";
import styles from "./Module.module.css";

export function Module({
  project,
  locale,
  live = false,
  span = 6,
  screen = 260,
  children,
}: {
  project: Project;
  locale: Locale;
  live?: boolean;
  span?: 4 | 5 | 6 | 7 | 8 | 12;
  screen?: number; // minimum screen height in px
  children: ReactNode;
}) {
  const t = getDict(locale).rack;
  return (
    <article className={styles.module} style={{ ["--span" as string]: span }}>
      <span className={styles.screw} data-pos="tl" aria-hidden />
      <span className={styles.screw} data-pos="tr" aria-hidden />
      <span className={styles.screw} data-pos="bl" aria-hidden />
      <span className={styles.screw} data-pos="br" aria-hidden />

      <header className={styles.plate}>
        <span className={styles.index}>{project.index}</span>
        <h3 className={styles.name}>
          <Link href={`/${locale}/work/${project.slug}`}>{project.title[locale]}</Link>
        </h3>
        <span className={styles.led} data-live={live}>
          <i aria-hidden />
          {live ? t.live : t.measured}
        </span>
      </header>

      <div className={styles.screen} style={{ minHeight: screen }}>
        {children}
      </div>

      <dl className={styles.readouts}>
        {project.readouts.map((r) => (
          <div key={r.label.en}>
            <dt>{r.label[locale]}</dt>
            <dd>{text(r.value, locale)}</dd>
          </div>
        ))}
      </dl>

      <footer className={styles.foot}>
        <Link href={`/${locale}/work/${project.slug}`} className={styles.open}>
          {t.open} <span aria-hidden>→</span>
        </Link>
        <span className={styles.ext}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer">
              {t.site} ↗
            </a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noreferrer">
              {t.code} ↗
            </a>
          )}
        </span>
      </footer>
    </article>
  );
}
