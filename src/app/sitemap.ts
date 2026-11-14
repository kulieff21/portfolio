import type { MetadataRoute } from "next";
import { PROJECTS } from "@/content/work";
import { LOCALES } from "@/i18n/dict";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const paths = ["", ...PROJECTS.map((p) => `/work/${p.slug}`)];
  return LOCALES.flatMap((l) =>
    paths.map((path) => ({
      url: `${base}/${l}${path}`,
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${base}/${x}${path}`])) },
    })),
  );
}
