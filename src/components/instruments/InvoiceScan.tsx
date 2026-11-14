"use client";

// 280 synthetic invoices, 31 with a planted defect. A scan passes over the grid:
// clean invoices dim, defective ones are caught and marked. Counts are the real result.

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getDict, type Locale } from "@/i18n/dict";
import s from "./instruments.module.css";

const COLS = 20;
const ROWS = 14;
const TOTAL = COLS * ROWS; // 280
const DEFECTS = 31;

function defectSet() {
  // deterministic spread (no Math.random: server and client must agree)
  const set = new Set<number>();
  let h = 2166136261;
  while (set.size < DEFECTS) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    set.add(h % TOTAL);
  }
  return set;
}

const DEFECT_SET = defectSet();

export function InvoiceScan({ locale }: { locale: Locale }) {
  const t = getDict(locale).invoice;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const defects = DEFECT_SET;
  const [pos, setPos] = useState(reduce ? TOTAL : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setPos((p) => (p >= TOTAL + 120 ? 0 : p + 2)), 24);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const done = Math.min(pos, TOTAL);
  let caught = 0;
  defects.forEach((d) => {
    if (d < done) caught++;
  });
  // the grid is scanned column by column, like a reader moving across a stack
  const order = (i: number) => (i % COLS) * ROWS + Math.floor(i / COLS);

  return (
    <div ref={ref} className={`${s.flow} ${s.pad}`}>
      <svg viewBox={`0 0 ${COLS * 14} ${ROWS * 14}`} className={s.grid} aria-hidden>
        {Array.from({ length: TOTAL }, (_, i) => {
          const k = order(i);
          const seen = k < done;
          const bad = defects.has(k);
          return (
            <rect
              key={i}
              x={(i % COLS) * 14 + 1}
              y={Math.floor(i / COLS) * 14 + 1}
              width="11"
              height="11"
              rx="2"
              className={!seen ? s.cell : bad ? s.cellBad : s.cellOk}
            />
          );
        })}
        {pos < TOTAL && <rect x={Math.floor(done / ROWS) * 14 - 1} y="0" width="2" height={ROWS * 14} className={s.scanLine} />}
      </svg>
      <div className={s.counters}>
        <span>
          <b>{done}</b>/280 {t.scanned}
        </span>
        <span className={s.hot}>
          <b>{caught}</b>/31 {t.caught}
        </span>
        <span>
          <b>0</b> {t.ok}
        </span>
      </div>
    </div>
  );
}
