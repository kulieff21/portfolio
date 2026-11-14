"use client";

// Lighthouse mobile Performance on the live site: 69 (template as shipped) → 96 (fixed).
// The needle waits on the old score, then sweeps; LCP and transfer bars shrink with it.

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/dict";
import s from "./instruments.module.css";

const CX = 200;
const CY = 182;
const R = 140;

function polar(v: number, r = R) {
  const a = Math.PI - (v / 100) * Math.PI;
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
}
function arc(from: number, to: number, r = R) {
  const a = polar(from, r);
  const b = polar(to, r);
  return `M${a.x} ${a.y} A${r} ${r} 0 0 1 ${b.x} ${b.y}`;
}

export function PerfGauge({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const v = useMotionValue(reduce ? 96 : 69);
  const x2 = useTransform(v, (x) => polar(x, R - 26).x);
  const y2 = useTransform(v, (x) => polar(x, R - 26).y);
  const label = useTransform(v, (x) => String(Math.round(x)));
  const progress = useTransform(v, [69, 96], [0, 1]);
  const lcpW = useTransform(progress, [0, 1], [150, (150 * 1.6) / 5.2]);
  const kbW = useTransform(progress, [0, 1], [150, (150 * 93) / 1332]);
  const lcpText = useTransform(progress, (p) => (5.2 - p * 3.6).toFixed(1).replace(".", locale === "az" ? "," : ".") + " s");
  const kbText = useTransform(progress, (p) => `${Math.round(1332 - p * 1239)} KB`);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(v, 96, { duration: 1.8, delay: 0.7, ease: [0.25, 0.9, 0.3, 1] });
    return () => c.stop();
  }, [inView, reduce, v]);

  return (
    <div ref={ref} className={s.fill}>
      <svg viewBox="0 0 400 300" className={s.svg} role="img" aria-label="Lighthouse Performance 69 → 96">
        <path d={arc(0, 49.5)} className={s.zoneBad} />
        <path d={arc(50.5, 89.5)} className={s.zoneMid} />
        <path d={arc(90.5, 100)} className={s.zoneGood} />
        {Array.from({ length: 11 }, (_, i) => {
          const a = polar(i * 10, R - 14);
          const b = polar(i * 10, R - 6);
          const t = polar(i * 10, R - 30);
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={s.tick} />
              {i % 5 === 0 && (
                <text x={t.x} y={t.y + 4} textAnchor="middle" className={s.monoDim}>
                  {i * 10}
                </text>
              )}
            </g>
          );
        })}
        <circle cx={polar(69, R - 14).x} cy={polar(69, R - 14).y} r="3" className={s.ghostMark} />
        <motion.line x1={CX} y1={CY} x2={x2} y2={y2} className={s.needle} />
        <circle cx={CX} cy={CY} r="7" className={s.hub} />
        <motion.text x={CX} y={CY - 42} textAnchor="middle" className={s.bigNum}>
          {label}
        </motion.text>
        <text x={CX} y={CY - 22} textAnchor="middle" className={s.monoDim}>
          PERFORMANCE · MOBILE
        </text>

        <g transform="translate(40 222)">
          <text className={s.monoDim}>LCP</text>
          <rect x="70" y="-9" width="150" height="10" rx="2" className={s.track} />
          <motion.rect x="70" y="-9" width={lcpW} height="10" rx="2" className={s.barHot} />
          <motion.text x="232" y="0" className={s.mono}>
            {lcpText}
          </motion.text>
        </g>
        <g transform="translate(40 252)">
          <text className={s.monoDim}>KB</text>
          <rect x="70" y="-9" width="150" height="10" rx="2" className={s.track} />
          <motion.rect x="70" y="-9" width={kbW} height="10" rx="2" className={s.barHot} />
          <motion.text x="232" y="0" className={s.mono}>
            {kbText}
          </motion.text>
        </g>
      </svg>
    </div>
  );
}
