# Elmar Guliyev — portfolio

**Live: [elmar-quliyev.vercel.app](https://elmar-quliyev.vercel.app)** · Azerbaijani and English

A portfolio built as a wall of instruments. Each project is a module, and each module's screen
shows that project's own measured result instead of a screenshot or a list of buzzwords:

| Module | What the screen shows | Source of the numbers |
| --- | --- | --- |
| Rampa | The car workshop's floor, **live**: which lift is busy and which part is being worked on, read every minute from Rampa's public API | [rampa-avtoservis](https://github.com/kulieff21/rampa-avtoservis) `/api/floor` |
| Web performance | Lighthouse needle 69 → 96, LCP 5.2 s → 1.6 s, 1332 KB → 93 KB | [saas-landing-perf-demo](https://github.com/kulieff21/saas-landing-perf-demo#result) |
| Data report | 1,067,371 raw lines split into their nine dispositions; 118 numbers, 0 mismatches | [reconciliation.json](https://github.com/kulieff21/retail-sales-report-demo/blob/main/results/reconciliation.json) |
| Invoice pipeline | 280 invoices scanned, 31 planted defects caught | [invoice-pipeline-demo](https://github.com/kulieff21/invoice-pipeline-demo#results) |
| Risk register → Jira | The live Jira run replayed: two hand edits, drift 2, two writes back | [audit log](https://github.com/kulieff21/risk-register-jira-sync/tree/main/results/audit) |
| Lead intake (n8n) | A lead moving through the workflow and stopping at the human approval gate | [lead-intake-n8n-demo](https://github.com/kulieff21/lead-intake-n8n-demo#results-dev-run) |
| Twenion | The four demo sites | [twenion.com](https://twenion.com) |

Every module opens a case page: problem, what I did, my role, result, stack and the source of
the numbers.

## Stack

Next.js 16 (App Router, Cache Components, `proxy.ts` for language), React 19, TypeScript,
Motion, CSS Modules, hand-drawn SVG. Static pages, prerendered in both languages; the only
runtime data is Rampa's floor, fetched in the browser.

Animations start when a module scrolls into view and respect `prefers-reduced-motion`. The
server HTML is complete and visible without JavaScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # content checks: totals add up, both languages complete, https links
npm run lint && npm run typecheck && npm run build
```

`tools/capture-demos.mjs` refreshes the Twenion screenshots (needs a Chromium in `CHROME_PATH`).

## License

MIT for the code. Project descriptions and CV files are © Elmar Guliyev.
