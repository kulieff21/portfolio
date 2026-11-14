"use client";

// The row ledger of the retail report: 1,067,371 raw lines, each with exactly one
// disposition. The counter runs up, the bar splits into the nine dispositions (the small
// ones magnified below), then the independent check lamp turns green.

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DISPOSITIONS, RAW_ROWS } from "@/content/work";
import { getDict, type Locale } from "@/i18n/dict";
import s from "./instruments.module.css";

const MAIN = DISPOSITIONS[0].rows;
const REST = RAW_ROWS - MAIN;

export function Ledger({ locale }: { locale: Locale }) {
  const t = getDict(locale).ledger;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const n = useMotionValue(reduce ? RAW_ROWS : 0);
  const fmt = (x: number) => Math.round(x).toLocaleString(locale === "az" ? "fr-FR" : "en-US");
  const text = useTransform(n, fmt);
  const [phase, setPhase] = useState(reduce ? 2 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(n, RAW_ROWS, { duration: 1.6, ease: [0.3, 0.9, 0.3, 1] });
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 2900);
    return () => {
      c.stop();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, reduce, n]);

  return (
    <div ref={ref} className={`${s.flow} ${s.pad}`}>
      <div className={s.ledgerTop}>
        <motion.span className={s.counter}>{text}</motion.span>
        <span className={s.monoDim}>{t.raw}</span>
      </div>

      <div className={s.stack} aria-hidden>
        {DISPOSITIONS.map((d, i) => (
          <span
            key={d.key}
            className={i === 0 ? s.segMain : s.segSmall}
            style={{ width: phase >= 1 ? `${(d.rows / RAW_ROWS) * 100}%` : i === 0 ? "100%" : "0%", transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      <div className={s.legendMain}>
        <span>{DISPOSITIONS[0].label[locale]}</span>
        <span className={s.mono}>{fmt(MAIN)}</span>
      </div>

      <div className={s.zoomLabel}>
        <span className={s.monoDim}>×16</span>
        <span className={s.monoDim}>{fmt(REST)}</span>
      </div>
      <div className={s.zoom}>
        {DISPOSITIONS.slice(1).map((d, i) => (
          <span
            key={d.key}
            className={s.zoomSeg}
            data-i={i}
            title={`${d.label[locale]}: ${fmt(d.rows)}`}
            style={{ width: phase >= 1 ? `${(d.rows / REST) * 100}%` : "0%", transitionDelay: `${300 + i * 90}ms` }}
          />
        ))}
      </div>
      <ul className={s.legend}>
        {DISPOSITIONS.slice(1, 6).map((d, i) => (
          <li key={d.key}>
            <i data-i={i} /> {d.label[locale]} <b>{fmt(d.rows)}</b>
          </li>
        ))}
      </ul>

      <div className={s.lampRow} data-on={phase >= 2}>
        <i />
        <span>
          <b>0</b> {t.mismatch} · <b>118</b> {t.numbers}
        </span>
      </div>
    </div>
  );
}
