"use client";

// Three live readings under the headline: Baku time (ticks every second), how many of
// Rampa's lifts are busy right now (from its public API), and availability.

import { useEffect, useState } from "react";
import { getDict, type Locale } from "@/i18n/dict";
import { bakuNow, useRampaFloor } from "@/lib/rampa";
import styles from "./Site.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function LiveStrip({ locale }: { locale: Locale }) {
  const t = getDict(locale).strip;
  const { status, floor } = useRampaFloor();
  const [clock, setClock] = useState<{ minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const tick = () => setClock(bakuNow());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  let rampa = "…";
  if (status === "error") rampa = "—";
  else if (floor && clock) {
    if (!floor.isToday) rampa = t.closed;
    else rampa = t.busy(floor.jobs.filter((j) => j.start <= clock.minutes && clock.minutes < j.end).length);
  }

  return (
    <dl className={styles.strip}>
      <div>
        <dt>{t.baku}</dt>
        <dd className={styles.clock}>
          {clock ? `${pad(Math.floor(clock.minutes / 60))}:${pad(clock.minutes % 60)}:${pad(clock.seconds)}` : "--:--:--"}
        </dd>
      </div>
      <div>
        <dt>
          <i className={styles.dotLive} aria-hidden /> {t.rampa}
        </dt>
        <dd>{rampa}</dd>
      </div>
      <div>
        <dt>{t.open}</dt>
        <dd>
          <i className={styles.dotOk} aria-hidden /> {t.status}
        </dd>
      </div>
    </dl>
  );
}
