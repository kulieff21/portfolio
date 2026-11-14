"use client";

// Live data from Rampa's public /api/floor, shared by every component that shows it.
// One small store + useSyncExternalStore: components subscribe, one fetch serves all,
// and the data refreshes every minute while someone is subscribed.

import { useSyncExternalStore } from "react";

export const RAMPA_URL = "https://rampa-avtoservis.vercel.app";

export type FloorJob = { code: string; bay: number; start: number; end: number; parts: string[]; services: string[] };
export type Floor = { date: string; isToday: boolean; now: number; jobs: FloorJob[] };
export type FloorState = { status: "loading" | "ok" | "error"; floor: Floor | null; at: number };

let state: FloorState = { status: "loading", floor: null, at: 0 };
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let inflight = false;

async function load() {
  if (inflight) return;
  inflight = true;
  try {
    const res = await fetch(`${RAMPA_URL}/api/floor`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    state = { status: "ok", floor: (await res.json()) as Floor, at: Date.now() };
  } catch {
    state = { ...state, status: state.floor ? "ok" : "error", at: Date.now() };
  } finally {
    inflight = false;
    listeners.forEach((l) => l());
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (Date.now() - state.at > 30_000) void load();
  timer ??= setInterval(load, 60_000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const SERVER: FloorState = { status: "loading", floor: null, at: 0 };

export function useRampaFloor(): FloorState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

/** Baku is UTC+4 all year. */
export function bakuNow() {
  const t = new Date(Date.now() + 4 * 3600_000);
  return { date: t.toISOString().slice(0, 10), minutes: t.getUTCHours() * 60 + t.getUTCMinutes(), seconds: t.getUTCSeconds() };
}

export const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
