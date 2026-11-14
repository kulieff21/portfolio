"use client";

// Four Twenion demo sites as small screens; one lights up at a time.

import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEMOS } from "@/content/work";
import type { Locale } from "@/i18n/dict";
import s from "./instruments.module.css";

export function DemoScreens({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [on, setOn] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setOn((x) => (x + 1) % DEMOS.length), 2200);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <div ref={ref} className={`${s.pad} ${s.demos}`}>
      {DEMOS.map((d, i) => (
        <a
          key={d.slug}
          href={d.url}
          target="_blank"
          rel="noreferrer"
          className={s.demo}
          data-on={i === on}
          onMouseEnter={() => setOn(i)}
          onFocus={() => setOn(i)}
        >
          <span className={s.demoBar}>
            <i />
            <i />
            <i />
            <em>{d.url.replace("https://", "")}</em>
          </span>
          <span className={s.demoShot}>
            <Image src={`/work/demo-${d.slug}.jpg`} alt={d.name} fill sizes="(max-width: 980px) 50vw, 280px" />
          </span>
          <span className={s.demoCap}>
            <b>{d.name}</b> {d.kind[locale]}
          </span>
        </a>
      ))}
    </div>
  );
}
