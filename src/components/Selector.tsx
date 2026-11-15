"use client";

// The hero's bench instrument: a rotary channel selector with one channel per project.
// It turns to the next project, the screen measures, and the readings settle on that
// project's own numbers (the same readouts as its module, from content/work.ts).
// Click a channel to take it over; it goes back to AUTO after a while.

import { animate, useMotionValue, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS, text } from "@/content/work";
import { getDict, type Locale } from "@/i18n/dict";
import s from "./Selector.module.css";

const N = PROJECTS.length; // 7 channels, 45° apart, from -135° to +135°
const STEP = 270 / (N - 1);
const angleOf = (i: number) => -135 + i * STEP;

// viewBox of the dial; the bottom gap (between the last and first channel) is cropped
const VB = { x: -34, y: 30, w: 468, h: 318 };
const C = 200;
const LABEL_R = 150;

const HOLD_MS = 3400; // settled reading on screen
const MEASURE_MS = 950; // digits searching
const TURN_MS = 520; // knob travel before the screen starts measuring
const MANUAL_MS = 14000; // after a click, AUTO resumes after this

function polar(deg: number, r: number) {
  const a = (deg * Math.PI) / 180;
  // rounded so the server and the browser print identical attributes (hydration)
  const round = (v: number) => Math.round(v * 100) / 100;
  return { x: round(C + r * Math.sin(a)), y: round(C - r * Math.cos(a)) };
}

// Replace digits that are not locked yet with random ones; locks run left to right.
function scramble(value: string, progress: number) {
  const digits = [...value].filter((ch) => /\d/.test(ch)).length;
  const locked = Math.floor(progress * (digits + 1));
  let seen = 0;
  return [...value]
    .map((ch) => {
      if (!/\d/.test(ch)) return ch;
      seen += 1;
      return seen <= locked ? ch : String(Math.floor(Math.random() * 10));
    })
    .join("");
}

type Phase = "measuring" | "settled";

export function Selector({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const reduce = useReducedMotion();
  const [ch, setCh] = useState(0);
  const [phase, setPhase] = useState<Phase>("settled");
  const [progress, setProgress] = useState(1);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rot = useMotionValue(angleOf(0));
  const rootRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<SVGGElement>(null);
  const manualTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // the knob's transform is written directly (no re-render per frame, same markup as the server)
  useEffect(
    () =>
      rot.on("change", (v) => {
        knobRef.current?.setAttribute("transform", `rotate(${v.toFixed(2)} ${C} ${C})`);
      }),
    [rot],
  );

  // pause when the instrument is off screen or the tab is hidden
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const vis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // turn the knob to the channel (spring with a little overshoot, like a detent)
  const turnTo = useCallback(
    (i: number) => {
      if (reduce) {
        rot.set(angleOf(i));
        return;
      }
      animate(rot, angleOf(i), { type: "spring", stiffness: 210, damping: 15, mass: 0.9 });
    },
    [reduce, rot],
  );

  // measuring: digits search, then lock left to right
  useEffect(() => {
    if (phase !== "measuring") return;
    let raf = 0;
    let start = 0;
    const delay = setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / MEASURE_MS);
        setProgress(p);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setPhase("settled");
      };
      raf = requestAnimationFrame(tick);
    }, TURN_MS);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, [phase, ch]);

  const select = useCallback(
    (i: number) => {
      setCh(i);
      turnTo(i);
      // reduced motion: the reading changes, nothing searches or spins
      setProgress(reduce ? 1 : 0);
      setPhase(reduce ? "settled" : "measuring");
    },
    [turnTo, reduce],
  );

  // AUTO: hold the reading, then go to the next channel
  useEffect(() => {
    if (reduce || !auto || paused || !visible || phase !== "settled") return;
    const id = setTimeout(() => select((ch + 1) % N), HOLD_MS);
    return () => clearTimeout(id);
  }, [reduce, auto, paused, visible, phase, ch, select]);

  useEffect(() => () => {
    if (manualTimer.current) clearTimeout(manualTimer.current);
  }, []);

  const pick = (i: number) => {
    setAuto(false);
    if (manualTimer.current) clearTimeout(manualTimer.current);
    manualTimer.current = setTimeout(() => setAuto(true), MANUAL_MS);
    if (i !== ch || phase === "settled") select(i);
  };

  const p = PROJECTS[ch];
  const [main, ...rest] = p.readouts;
  const show = (v: string) => (phase === "measuring" ? scramble(v, progress) : v);
  const searching = phase === "measuring" && progress === 0;

  return (
    <div
      ref={rootRef}
      className={s.unit}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className={s.screw} data-pos="tl" aria-hidden />
      <span className={s.screw} data-pos="tr" aria-hidden />
      <span className={s.screw} data-pos="bl" aria-hidden />
      <span className={s.screw} data-pos="br" aria-hidden />

      <div className={s.screen} data-phase={phase}>
        <div className={s.top}>
          <span className={s.chan}>
            CH {p.index}/{String(N).padStart(2, "0")} · {p.name.toUpperCase()}
          </span>
          <span className={s.state} data-phase={phase}>
            <i aria-hidden />
            {phase === "measuring" ? t.hero.measuring : t.rack.measured}
          </span>
        </div>

        <div className={s.main}>
          <span className={s.value} data-searching={searching}>
            {searching ? "– – –" : show(text(main.value, locale))}
          </span>
          <span className={s.label}>{main.label[locale]}</span>
        </div>

        <dl className={s.rest}>
          {rest.map((r) => (
            <div key={r.label.en}>
              <dt>{r.label[locale]}</dt>
              <dd>{searching ? "–" : show(text(r.value, locale))}</dd>
            </div>
          ))}
        </dl>

        <div className={s.foot}>
          <span className={s.probe} aria-hidden>
            <i style={{ transform: `scaleX(${phase === "measuring" ? progress : 1})` }} />
          </span>
          <Link href={`/${locale}/work/${p.slug}`} className={s.open}>
            {t.rack.open} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className={s.dial}>
        <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className={s.svg} aria-hidden>
          <defs>
            <radialGradient id="sel-body" cx="38%" cy="32%" r="80%">
              <stop offset="0" stopColor="#5a5f67" />
              <stop offset="0.55" stopColor="#3a3e44" />
              <stop offset="1" stopColor="#24272b" />
            </radialGradient>
            <radialGradient id="sel-face" cx="40%" cy="30%" r="85%">
              <stop offset="0" stopColor="#4b5057" />
              <stop offset="1" stopColor="#2c2f34" />
            </radialGradient>
          </defs>

          {/* scale: fine ticks between channels, channel ticks, lit arc up to the channel */}
          {Array.from({ length: (N - 1) * 5 + 1 }, (_, k) => {
            const a = -135 + k * (STEP / 5);
            const major = k % 5 === 0;
            const p1 = polar(a, major ? 120 : 124);
            const p2 = polar(a, 132);
            const lit = a <= angleOf(ch) + 0.01; // the scale lights up to the selected channel
            return (
              <line
                key={k}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className={major ? s.tickMajor : s.tick}
                data-lit={lit}
              />
            );
          })}
          <circle cx={C} cy={C} r={112} className={s.well} />

          <g ref={knobRef} transform={`rotate(${angleOf(0)} ${C} ${C})`}>
            <circle cx={C} cy={C} r={100} fill="url(#sel-body)" />
            {Array.from({ length: 64 }, (_, k) => {
              const a = (k * 360) / 64;
              const p1 = polar(a, 92);
              const p2 = polar(a, 100);
              return <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className={s.knurl} />;
            })}
            <circle cx={C} cy={C} r={84} fill="url(#sel-face)" className={s.face} />
            {[70, 56, 42, 28].map((r) => (
              <circle key={r} cx={C} cy={C} r={r} className={s.machined} />
            ))}
            <line x1={C} y1={C - 34} x2={C} y2={C - 78} className={s.pointer} />
            <circle cx={C} cy={C - 88} r={3.2} className={s.pointerDot} />
          </g>
          <circle cx={C} cy={C} r={9} className={s.cap} />
        </svg>

        {PROJECTS.map((proj, i) => {
          const a = angleOf(i);
          const pos = polar(a, LABEL_R);
          const side = a < -20 ? "end" : a > 20 ? "start" : "middle";
          return (
            <button
              key={proj.slug}
              type="button"
              className={s.chLabel}
              data-side={side}
              aria-pressed={i === ch}
              style={{
                left: `${((pos.x - VB.x) / VB.w) * 100}%`,
                top: `${((pos.y - VB.y) / VB.h) * 100}%`,
              }}
              onClick={() => pick(i)}
            >
              <b>{proj.index}</b> {proj.name.toUpperCase()}
            </button>
          );
        })}

        <span className={s.mode} data-auto={auto && !reduce}>
          <i aria-hidden />
          {auto && !reduce ? "AUTO" : "MAN"}
        </span>
      </div>
    </div>
  );
}
