"use client";

// The n8n lead-intake workflow: a lead moves node by node, is scored twice in parallel,
// and stops at the approval gate until a human clicks. Only then is the reply sent.

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getDict, type Locale } from "@/i18n/dict";
import s from "./instruments.module.css";

// x, y of each node; 3 and 4 run in parallel
const NODES = [
  { x: 46, y: 110 },
  { x: 132, y: 110 },
  { x: 218, y: 110 },
  { x: 310, y: 70 },
  { x: 310, y: 150 },
  { x: 410, y: 110 },
  { x: 506, y: 110 },
];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6]];
// the lead's position over time; 5 repeats = waiting for the human
const SEQ = [0, 1, 2, 3, 5, 5, 5, 5, 6, 6];

export function IntakeFlow({ locale }: { locale: Locale }) {
  const t = getDict(locale).intake;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(reduce ? 7 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % SEQ.length), 700);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const at = SEQ[i];
  const waiting = at === 5 && i < 7;
  const approved = i >= 7;
  const reached = (n: number) => (n === 4 ? at >= 3 : SEQ.slice(0, i + 1).includes(n));
  const pos = at === 3 ? { x: 310, y: 110 } : NODES[at];

  return (
    <div ref={ref} className={s.fill}>
      <svg viewBox="0 0 560 230" className={s.svg} role="img" aria-label="n8n workflow">
        {EDGES.map(([a, b]) => (
          <path
            key={`${a}-${b}`}
            d={`M${NODES[a].x} ${NODES[a].y} C${(NODES[a].x + NODES[b].x) / 2} ${NODES[a].y}, ${(NODES[a].x + NODES[b].x) / 2} ${NODES[b].y}, ${NODES[b].x} ${NODES[b].y}`}
            className={reached(b) ? s.edgeOn : s.edge}
          />
        ))}
        {NODES.map((n, k) => (
          <g key={k} transform={`translate(${n.x} ${n.y})`}>
            <rect
              x="-34"
              y="-15"
              width="68"
              height="30"
              rx="8"
              className={k === 5 && waiting ? s.nodeWait : reached(k) ? s.nodeOn : s.node}
            />
            <text y="4" textAnchor="middle" className={s.nodeText}>
              {t.nodes[k]}
            </text>
          </g>
        ))}
        <circle cx={pos.x} cy={pos.y - 22} r="5" className={s.pulse} style={{ transition: "cx 600ms ease, cy 600ms ease" }} />
        <text x="446" y="146" textAnchor="middle" className={waiting ? s.monoHot : approved ? s.monoOk : s.monoDim}>
          {waiting ? t.waiting : approved ? t.approved : "Telegram"}
        </text>
        <text x="20" y="214" className={s.monoDim}>
          422 · honeypot · dedup · JSON schema · 48 h
        </text>
      </svg>
    </div>
  );
}
