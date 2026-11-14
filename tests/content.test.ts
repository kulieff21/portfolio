// The site shows numbers taken from other projects; these tests keep the copy honest
// and complete: totals add up, both languages are filled in, links are https.

import { describe, expect, it } from "vitest";
import { DEMOS, DISPOSITIONS, PROJECTS, RAW_ROWS } from "../src/content/work";
import { dicts } from "../src/i18n/dict";

describe("numbers", () => {
  it("the nine dispositions add up to the raw export, as in reconciliation.json", () => {
    expect(DISPOSITIONS.reduce((sum, d) => sum + d.rows, 0)).toBe(RAW_ROWS);
    expect(RAW_ROWS).toBe(1_067_371);
  });
});

describe("projects", () => {
  it("have unique slugs and indexes in order", () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    expect(PROJECTS.map((p) => p.index)).toEqual(PROJECTS.map((_, i) => String(i + 1).padStart(2, "0")));
  });

  it.each(PROJECTS.map((p) => [p.slug, p] as const))("%s is complete in both languages", (_, p) => {
    for (const field of [p.title, p.tagline, p.problem, p.role]) {
      expect(field.az.trim()).not.toBe("");
      expect(field.en.trim()).not.toBe("");
      expect(field.az).not.toBe(field.en);
    }
    expect(p.did.length).toBeGreaterThan(0);
    expect(p.results.length).toBeGreaterThan(0);
    expect(p.readouts).toHaveLength(3);
    for (const l of [...p.did, ...p.results]) expect(l.az && l.en).toBeTruthy();
  });

  it("link only to https pages", () => {
    const urls = PROJECTS.flatMap((p) => [p.live, p.code, p.source]).concat(DEMOS.map((d) => d.url));
    for (const u of urls.filter(Boolean)) expect(u).toMatch(/^https:\/\//);
  });
});

describe("dictionaries", () => {
  const shape = (o: unknown): unknown =>
    typeof o === "object" && o !== null
      ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, shape(v)]))
      : typeof o;
  it("az and en have the same keys", () => {
    expect(shape(dicts.en)).toEqual(shape(dicts.az));
  });
});
