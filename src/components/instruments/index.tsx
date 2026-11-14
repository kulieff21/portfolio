import type { Locale } from "@/i18n/dict";
import { DemoScreens } from "./DemoScreens";
import { DriftSync } from "./DriftSync";
import { IntakeFlow } from "./IntakeFlow";
import { InvoiceScan } from "./InvoiceScan";
import { Ledger } from "./Ledger";
import { PerfGauge } from "./PerfGauge";
import { RampaFloor } from "./RampaFloor";

/** Each project's instrument, by slug. Layout (span, screen height) lives with it. */
export const INSTRUMENTS: Record<
  string,
  { Component: (p: { locale: Locale }) => React.ReactNode; span: 4 | 5 | 6 | 7 | 8 | 12; screen: number; live?: boolean }
> = {
  rampa: { Component: RampaFloor, span: 8, screen: 300, live: true },
  "web-performance": { Component: PerfGauge, span: 4, screen: 300 },
  "data-report": { Component: Ledger, span: 6, screen: 290 },
  "invoice-pipeline": { Component: InvoiceScan, span: 6, screen: 290 },
  "risk-register": { Component: DriftSync, span: 6, screen: 250 },
  "lead-intake": { Component: IntakeFlow, span: 6, screen: 250 },
  twenion: { Component: DemoScreens, span: 12, screen: 240 },
};
