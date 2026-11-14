"use client";

// Rampa's workshop floor, read live from rampa-avtoservis.vercel.app/api/floor.
// Open hours: the real clock. Closed: the next working day's bookings play fast.

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { getDict, type Locale } from "@/i18n/dict";
import { bakuNow, hhmm, useRampaFloor, type FloorJob } from "@/lib/rampa";
import s from "./instruments.module.css";

const OPEN = 540;
const CLOSE = 1140;
const BAYS = [1, 2, 3];
const BAY_W = 180;
const bayX = (i: number) => 22 + i * (BAY_W + 9);

export function RampaFloor({ locale }: { locale: Locale }) {
  const t = getDict(locale).rampa;
  const { status, floor } = useRampaFloor();
  const reduce = useReducedMotion();
  const [now, setNow] = useState(OPEN + 90);

  useEffect(() => {
    if (!floor) return;
    if (floor.isToday) {
      const tick = () => setNow(bakuNow().minutes);
      tick();
      const id = setInterval(tick, 15_000);
      return () => clearInterval(id);
    }
    if (reduce) return;
    // plan mode: 10 hours in 30 seconds, starting at the busiest moment
    const start = busiest(floor.jobs);
    let m = start;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the simulated clock
    setNow(m);
    const id = setInterval(() => {
      m = m + 5 >= CLOSE ? OPEN : m + 5;
      setNow(m);
    }, 250);
    return () => clearInterval(id);
  }, [floor, reduce]);

  const jobs = floor?.jobs ?? [];
  const current = (bay: number) => jobs.find((j) => j.bay === bay && j.start <= now && now < j.end);
  const pct = (m: number) => ((m - OPEN) / (CLOSE - OPEN)) * 560;

  return (
    <div className={s.fill}>
      <svg viewBox="0 0 600 302" className={s.svg} role="img" aria-label="Rampa">
        <text x="22" y="20" className={s.mono}>
          {status === "error" ? t.offline : status === "loading" ? t.loading : floor?.isToday ? hhmm(now) : `${t.plan} · ${hhmm(now)}`}
        </text>
        {BAYS.map((bay, i) => {
          const x = bayX(i);
          const job = current(bay);
          return (
            <g key={bay}>
              <rect x={x} y="30" width={BAY_W} height="174" rx="6" className={s.bay} />
              <line x1={x + 8} y1="30" x2={x + BAY_W - 8} y2="30" className={s.bayMouth} />
              <circle cx={x + BAY_W - 12} cy="44" r="3.5" className={job ? s.ledBusy : s.ledFree} />
              <AnimatePresence>
                {job && (
                  <motion.g
                    key={job.code}
                    initial={reduce ? { opacity: 0 } : { y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { y: -200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  >
                    <g transform={`translate(${x + BAY_W / 2 - 40} 40) scale(0.8)`}>
                      <CarMini parts={job.parts} />
                    </g>
                  </motion.g>
                )}
              </AnimatePresence>
              <text x={x + 4} y="224" className={s.monoDim}>
                {t.bay} {bay}
              </text>
              <text x={x + 4} y="239" className={job ? s.monoHot : s.monoOk}>
                {job ? label(job, t.parts) : t.free}
              </text>
              {job && (
                <text x={x + 4} y="253" className={s.monoDim}>
                  {t.until(hhmm(job.end))}
                </text>
              )}
            </g>
          );
        })}
        {/* timeline */}
        {BAYS.map((bay, i) => (
          <g key={bay} transform={`translate(22 ${266 + i * 10})`}>
            <rect width="560" height="6" rx="3" className={s.track} />
            {jobs
              .filter((j) => j.bay === bay)
              .map((j) => (
                <rect
                  key={j.code}
                  x={pct(j.start)}
                  width={Math.max(2, pct(j.end) - pct(j.start) - 1)}
                  height="6"
                  rx="3"
                  className={j.end <= now ? s.jobPast : j.start <= now ? s.jobNow : s.jobNext}
                />
              ))}
          </g>
        ))}
        {now >= OPEN && now <= CLOSE && <rect x={22 + pct(now) - 0.75} y="262" width="1.5" height="34" className={s.nowLine} />}
      </svg>
    </div>
  );
}

function label(job: FloorJob, names: Record<string, string>) {
  return job.parts.slice(0, 2).map((p) => names[p] ?? p).join(" + ");
}

function busiest(jobs: FloorJob[]) {
  let best = OPEN + 90;
  let count = 0;
  for (const j of jobs) {
    const m = j.start + 10;
    const c = jobs.filter((k) => k.start <= m && m < k.end).length;
    if (c > count) [best, count] = [m, c];
  }
  return best;
}

/** A small top-down car; the parts being worked on glow. 100 × 200 units. */
function CarMini({ parts }: { parts: string[] }) {
  const on = (p: string) => (parts.includes(p) ? s.partOn : s.part);
  return (
    <g>
      <g className={on("wheels")}>
        <rect x="4" y="30" width="9" height="30" rx="3" />
        <rect x="87" y="30" width="9" height="30" rx="3" />
        <rect x="4" y="140" width="9" height="30" rx="3" />
        <rect x="87" y="140" width="9" height="30" rx="3" />
      </g>
      <rect x="12" y="6" width="76" height="188" rx="32" className={s.carBody} />
      <path d="M24 64 Q50 56 76 64 L72 84 Q50 78 28 84Z" className={s.carGlass} />
      <rect x="26" y="88" width="48" height="56" rx="6" className={s.carGlass} />
      <path d="M28 150 Q50 154 72 150 L68 166 Q50 170 32 166Z" className={s.carGlass} />
      <rect x="32" y="9" width="36" height="5" rx="2" className={on("ac")} />
      <rect x="32" y="20" width="32" height="30" rx="4" className={on("engine")} />
      <rect x="67" y="20" width="11" height="13" rx="2" className={on("battery")} />
      <g className={on("brakes")}>
        <rect x="14" y="37" width="5" height="16" rx="1.5" />
        <rect x="81" y="37" width="5" height="16" rx="1.5" />
        <rect x="14" y="147" width="5" height="16" rx="1.5" />
        <rect x="81" y="147" width="5" height="16" rx="1.5" />
      </g>
      <g className={on("suspension")}>
        <rect x="21" y="34" width="5" height="22" rx="1.5" />
        <rect x="74" y="34" width="5" height="22" rx="1.5" />
        <rect x="21" y="144" width="5" height="22" rx="1.5" />
        <rect x="74" y="144" width="5" height="22" rx="1.5" />
      </g>
      <g className={on("axles")}>
        <rect x="13" y="44" width="74" height="2.5" rx="1" />
        <rect x="13" y="154" width="74" height="2.5" rx="1" />
      </g>
      <rect x="28" y="90" width="44" height="6" rx="2" className={on("dash")} />
    </g>
  );
}
