"use client";

// The live Jira run of risk-register-jira-sync (2026-10-08), replayed: someone edits
// R-005's priority and R-013's due date by hand in Jira, the dry run reports exactly
// two drifts, --apply writes the register's values back (2 writes). Values are real.

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getDict, type Locale } from "@/i18n/dict";
import s from "./instruments.module.css";

const ROWS = [
  { id: "R-001", key: "RISK-1", risk: "Leaver accounts", prio: "High", due: "2026-09-15" },
  { id: "R-005", key: "RISK-5", risk: "Phishing", prio: "Highest", due: "2026-10-31", edit: { field: "prio", value: "Low", at: 1 } },
  { id: "R-009", key: "RISK-9", risk: "Cloud storage", prio: "Medium", due: "2026-10-20" },
  { id: "R-013", key: "RISK-13", risk: "Merchant portal", prio: "High", due: "2026-11-30", edit: { field: "due", value: "2026-12-03", at: 2 } },
] as const;

// 0 in sync · 1 R-005 edited · 2 R-013 edited · 3 dry run: drift 2 · 4 apply · 5 in sync, 2 writes
const STEPS = 6;

export function DriftSync({ locale }: { locale: Locale }) {
  const t = getDict(locale).drift;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStep((x) => (x + 1) % STEPS), 1500);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const edited = (r: (typeof ROWS)[number], field: "prio" | "due") =>
    "edit" in r && r.edit.field === field && step >= r.edit.at && step < 5;

  const status =
    step === 3 ? { cls: s.lampWarn, text: `${t.drift} 2` } :
    step === 4 ? { cls: s.lampWarn, text: "--apply" } :
    step === 5 ? { cls: s.lampOk, text: `${t.synced} · 2 ${t.writes}` } :
    step === 0 ? { cls: s.lampOk, text: `${t.synced} · 0 ${t.writes}` } :
    { cls: s.lampIdle, text: t.edit };

  return (
    <div ref={ref} className={`${s.flow} ${s.pad}`}>
      <div className={s.twoTables}>
        <table className={s.table}>
          <caption className={s.monoDim}>{t.register}</caption>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id}>
                <td className={s.dim}>{r.id}</td>
                <td>{r.risk}</td>
                <td>{r.prio}</td>
                <td>{r.due.slice(5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={s.links} aria-hidden>
          {ROWS.map((r) => (
            <span key={r.id} data-drift={edited(r, "prio") || edited(r, "due")} data-fix={step === 4 && "edit" in r} />
          ))}
        </div>
        <table className={s.table}>
          <caption className={s.monoDim}>{t.jira}</caption>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <td className={s.dim}>{r.key}</td>
                <td className={edited(r, "prio") ? s.cellEdit : step === 5 && "edit" in r && r.edit.field === "prio" ? s.cellFixed : ""}>
                  {edited(r, "prio") && "edit" in r ? r.edit.value : r.prio}
                </td>
                <td className={edited(r, "due") ? s.cellEdit : step === 5 && "edit" in r && r.edit.field === "due" ? s.cellFixed : ""}>
                  {(edited(r, "due") && "edit" in r ? r.edit.value : r.due).slice(5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`${s.lampRow} ${status.cls}`} data-on="true">
        <i />
        <span>{status.text}</span>
      </div>
    </div>
  );
}
