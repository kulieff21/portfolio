// Every project on the site, in both languages. Numbers come from each project's own
// README or results files (linked in `source`); nothing here is estimated.

export type L = { az: string; en: string };

export type Readout = { label: L; value: string | L; note?: L };

export type Project = {
  slug: string;
  index: string;
  name: string;
  title: L;
  tagline: L;
  live?: string;
  code?: string;
  source: string; // where the numbers on the site come from
  stack: string[];
  readouts: Readout[];
  problem: L;
  did: L[];
  role: L;
  results: L[];
};

export const DISPOSITIONS = [
  { key: "sale_product", rows: 1_003_357, label: { az: "Məhsul satışı", en: "Product sales" } },
  { key: "dup_cross_sheet", rows: 22_523, label: { az: "Vərəqlər arası dublikat", en: "Cross-sheet copies" } },
  { key: "cancel_product", rows: 17_915, label: { az: "Ləğv", en: "Cancellations" } },
  { key: "dup_exact", rows: 11_812, label: { az: "Dəqiq dublikat", en: "Exact duplicates" } },
  { key: "sale_non_product", rows: 4_555, label: { az: "Çatdırılma, haqqlar", en: "Postage and fees" } },
  { key: "stock_movement", rows: 3_393, label: { az: "Anbar hərəkəti", en: "Stock movements" } },
  { key: "zero_price", rows: 2_621, label: { az: "Sıfır qiymət", en: "Zero price" } },
  { key: "cancel_non_product", rows: 1_189, label: { az: "Digər ləğvlər", en: "Other cancellations" } },
  { key: "adjustment", rows: 6, label: { az: "Düzəliş", en: "Adjustments" } },
] as const;

export const RAW_ROWS = 1_067_371;

export const PROJECTS: Project[] = [
  {
    slug: "rampa",
    index: "01",
    name: "Rampa",
    title: { az: "Rampa: avtoservis üçün onlayn yazılış", en: "Rampa: online booking for a car workshop" },
    tagline: {
      az: "Next.js ilə tam veb tətbiq: canlı zal, 4 addımlı yazılış, admin panel, PostgreSQL.",
      en: "A complete Next.js app: live workshop floor, four-step booking, admin panel, PostgreSQL.",
    },
    live: "https://rampa-avtoservis.vercel.app",
    code: "https://github.com/kulieff21/rampa-avtoservis",
    source: "https://github.com/kulieff21/rampa-avtoservis#readme",
    stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL (Neon)", "Vercel", "Vitest", "Playwright"],
    readouts: [
      { label: { az: "Üst-üstə sifariş", en: "Double bookings" }, value: "0", note: { az: "DB constraint", en: "DB constraint" } },
      { label: { az: "Test", en: "Tests" }, value: "19 + e2e" },
      { label: { az: "Dil", en: "Languages" }, value: "AZ · EN" },
    ],
    problem: {
      az: "Avtoservisə yazılmaq üçün adətən zəng etmək lazımdır, qiymət isə əvvəlcədən bilinmir. Məqsəd: müştəri işi seçsin, sabit qiyməti görsün və yalnız həqiqətən boş olan vaxtı tutsun. İki müştəri eyni anda eyni vaxtı seçsə belə, iki sifariş yaranmamalıdır.",
      en: "Booking a car service usually means a phone call and no price up front. The goal: the customer picks the work, sees a fixed price and takes only a time that is really free. Even if two customers pick the same slot at the same moment, only one booking may exist.",
    },
    did: [
      {
        az: "Ana səhifədəki canlı zal real sifarişlərdən və saatdan hesablanır; servis bağlı olanda növbəti iş gününün planı sürətləndirilmiş göstərilir.",
        en: "The home page's live floor is computed from real bookings and the clock; when the workshop is closed, the next working day's plan plays fast.",
      },
      {
        az: "4 addımlı yazılış: iş, gün, saat, əlaqə. Boş vaxtlar REST API-dən gəlir; sifarişi Server Action yazır və server hər şeyi yenidən yoxlayır.",
        en: "Four-step booking: work, day, time, contact. Free times come from a REST API; a Server Action writes the booking and the server checks everything again.",
      },
      {
        az: "PostgreSQL EXCLUDE constraint eyni qaldırıcıda vaxtı üst-üstə düşən iki canlı sifarişi verilənlər bazası səviyyəsində qadağan edir; bunu test sübut edir.",
        en: "A PostgreSQL EXCLUDE constraint makes two overlapping live bookings on the same bay impossible at the database level; a test proves it.",
      },
      {
        az: "Admin panel: qaldırıcılar × saatlar lövhəsi, statuslar, qiymət və müddət redaktoru. Qiymət dəyişikliyi ictimai qiymət siyahısına dərhal düşür (updateTag).",
        en: "Admin panel: a bays × hours board, statuses, a price and duration editor. A price change reaches the public price list at once (updateTag).",
      },
      {
        az: "Səhifənin dəyişməyən hissəsi build zamanı hazırlanır, zamandan asılı hissələr stream olunur (Partial Prerendering).",
        en: "The unchanging part of each page is prerendered; the time-dependent parts stream in (Partial Prerendering).",
      },
    ],
    role: {
      az: "Fərdi layihə. Bütün hissələr: tələblər və dizayn, frontend, backend, verilənlər bazası, testlər, CI və deploy.",
      en: "Solo project. Every part: requirements and design, frontend, backend, database, tests, CI and deployment.",
    },
    results: [
      { az: "19 unit və DB testi, brauzerdə e2e test, hər push-da GitHub Actions CI.", en: "19 unit and database tests, a browser end-to-end test, GitHub Actions CI on every push." },
      { az: "Canlıdadır: Vercel (Frankfurt) və Neon Postgres.", en: "Live on Vercel (Frankfurt) with Neon Postgres." },
    ],
  },
  {
    slug: "web-performance",
    index: "02",
    name: "Perf",
    title: { az: "Veb performans: hazır şablonun sürətləndirilməsi", en: "Web performance: speeding up a ready-made template" },
    tagline: {
      az: "Açıq mənbəli SaaS landing şablonu ölçüldü, görünüşü dəyişmədən sürətləndirildi.",
      en: "An open-source SaaS landing template, measured as shipped and made fast without changing how it looks.",
    },
    live: "https://kulieff21.github.io/saas-landing-perf-demo/",
    code: "https://github.com/kulieff21/saas-landing-perf-demo",
    source: "https://github.com/kulieff21/saas-landing-perf-demo#result",
    stack: ["HTML", "CSS", "JavaScript", "AVIF/WebP", "Lighthouse"],
    readouts: [
      { label: { az: "Performance", en: "Performance" }, value: "69→96" },
      { label: { az: "LCP", en: "LCP" }, value: { az: "5,2→1,6 s", en: "5.2→1.6 s" } },
      { label: { az: "Ötürülən", en: "Transferred" }, value: "1332→93 KB" },
    ],
    problem: {
      az: "Şablon gözəl görünür, amma mobil telefonda ağır açılır: kəsilməmiş PNG-lər, render-i bloklayan 4 stil faylı, CDN-dən GSAP, 128 KB-lıq ikon şrifti.",
      en: "The template looks good but loads heavily on a phone: uncut PNGs, four render-blocking stylesheets, GSAP from a CDN, a 128 KB icon font.",
    },
    did: [
      { az: "Şəkillər ölçüyə görə AVIF və WebP variantlarına çevrildi, ölçüləri yazıldı, ekrandan aşağıdakılar lazy yüklənir.", en: "Images became responsive AVIF and WebP with explicit dimensions; below-the-fold images load lazily." },
      { az: "Stillər istifadə olunan markup-dan yenidən quruldu və inline edildi; şriftlər 3 çəkiyə və Latin-1-ə endirildi (39 KB), ikonlar SVG oldu.", en: "Styles were rebuilt from the real markup and inlined; fonts cut to 3 weights subset to Latin-1 (39 KB); icons became inline SVG." },
      { az: "GSAP əvəzinə IntersectionObserver və CSS scroll animasiyası; üçüncü tərəf sorğusu qalmadı.", en: "IntersectionObserver and a CSS scroll-driven animation replaced GSAP; no third-party requests remain." },
      { az: "SEO və əlçatanlıq: meta təsvir, bir h1, işləyən linklər, düymə kimi FAQ, klaviatura ilə bağlanan menyu.", en: "SEO and accessibility: a meta description, one h1, working links, a button-based FAQ, a menu that closes from the keyboard." },
    ],
    role: { az: "Fərdi layihə: ölçmə, optimallaşdırma, canlıda təkrar ölçmə.", en: "Solo project: measurement, optimisation, re-measurement on the live site." },
    results: [
      { az: "Canlı (mobil, 3 ölçmənin medianı): Performance 69 → 96, LCP 5,2 s → 1,6 s, 1332 KB → 93 KB.", en: "Live (mobile, median of 3 runs): Performance 69 → 96, LCP 5.2 s → 1.6 s, 1332 KB → 93 KB." },
      { az: "Lokal ölçmədə sorğu sayı 32 → 9; desktop SEO 82 → 100.", en: "In the local measurement, requests 32 → 9; desktop SEO 82 → 100." },
    ],
  },
  {
    slug: "data-report",
    index: "03",
    name: "Ledger",
    title: { az: "Təkrarlana bilən data hesabatı", en: "Reproducible data report" },
    tagline: {
      az: "1 067 371 sətirlik xam satış ixracı: hər sətir hesaba alınır, hər rəqəm ikinci dəfə müstəqil hesablanır.",
      en: "A 1,067,371-line raw sales export: every line accounted for, every number computed a second time independently.",
    },
    live: "https://kulieff21.github.io/retail-sales-report-demo/",
    code: "https://github.com/kulieff21/retail-sales-report-demo",
    source: "https://github.com/kulieff21/retail-sales-report-demo/blob/main/results/reconciliation.json",
    stack: ["Python", "pandas", "Jupyter", "openpyxl", "pytest"],
    readouts: [
      { label: { az: "Xam sətir", en: "Raw lines" }, value: "1 067 371" },
      { label: { az: "Yoxlanan rəqəm", en: "Numbers checked" }, value: "118" },
      { label: { az: "Uyğunsuzluq", en: "Mismatches" }, value: "0" },
    ],
    problem: {
      az: "Xam ixracda satışlar, ləğvlər, dublikatlar və haqqlar qarışıqdır. Hesabatın rəqəmlərinə inanmaq üçün hər sətrin hara getdiyi bilinməli və nəticə başqa yolla da alınmalıdır.",
      en: "A raw export mixes sales, cancellations, duplicates and fees. To trust a report's numbers, every line's fate must be known and the result must be reachable another way.",
    },
    did: [
      { az: "Təhlil planı heç bir rəqəm hesablanmamışdan əvvəl commit edildi; sonrakı hər dəyişiklik tarixli düzəlişdir.", en: "The analysis plan was committed before any number was computed; every later change is a dated amendment." },
      { az: "Hər xam sətir dəqiq bir kateqoriyaya düşür; sətir sayı və məbləğ xam cəmlə tam üst-üstə düşür.", en: "Every raw line gets exactly one disposition; row counts and values add back to the raw total exactly." },
      { az: "Yalnız standart kitabxana ilə yazılmış müstəqil ikinci implementasiya əsas koddan xəbərsiz eyni nəticələri verir.", en: "An independent second implementation in the standard library, written without reading the main code, reproduces the results." },
    ],
    role: { az: "Fərdi layihə: plan, kod, testlər, hesabat (veb, notebook, Excel, slayd).", en: "Solo project: plan, code, tests, report (web page, notebook, Excel, slide)." },
    results: [
      { az: "118 əsas rəqəm, 0 uyğunsuzluq; 1 067 371 sətrin hər biri müqayisə olundu.", en: "118 headline numbers, 0 mismatches; all 1,067,371 rows compared." },
    ],
  },
  {
    slug: "invoice-pipeline",
    index: "04",
    name: "Invoices",
    title: { az: "Faktura yoxlama pipeline-ı", en: "Invoice validation pipeline" },
    tagline: {
      az: "PDF və skan fakturalar Google Sheets-də yoxlanılmış sətirlərə çevrilir; şübhəli olan heç nə 'ok' kimi keçmir.",
      en: "PDF and scanned invoices become validated rows in Google Sheets; nothing doubtful passes as 'ok'.",
    },
    live: "https://kulieff21.github.io/invoice-pipeline-demo/",
    code: "https://github.com/kulieff21/invoice-pipeline-demo",
    source: "https://github.com/kulieff21/invoice-pipeline-demo#results",
    stack: ["Python", "SQLite", "Google Sheets API", "OCR", "pytest"],
    readouts: [
      { label: { az: "Qoyulmuş qüsur", en: "Planted defects" }, value: "31 / 31" },
      { label: { az: "Dublikat", en: "Re-sent copies" }, value: "4 / 4" },
      { label: { az: "Qüsurlu 'ok'", en: "Defective 'ok'" }, value: "0" },
    ],
    problem: {
      az: "Fakturalar fərqli şablonlarda, dillərdə və formatlarda gəlir, bəziləri skandır. Səhv məbləğli faktura cədvələ 'ok' kimi düşsə, səhv ödəniş olur.",
      en: "Invoices arrive in different layouts, languages and formats, some scanned. If a wrong one reaches the sheet as 'ok', someone pays the wrong amount.",
    },
    did: [
      { az: "Şablon koordinatları yox, 6 dildə etiket lüğəti; tanımadığı şablonlarda da işləyir.", en: "A label vocabulary in six languages instead of template coordinates, so unseen layouts still work." },
      { az: "Biznes qaydaları: sətir hesabı, vergi, tarixlər, vergi ID-lərinin yoxlama rəqəmləri, dublikatlar.", en: "Business rules: line arithmetic, tax, dates, tax-ID check digits, duplicates." },
      { az: "Çökməyə davamlı və idempotent: hər fayl bir tranzaksiya, Sheets-ə yazma açarla, təkrar cəhd ikiqat sətir yaratmır.", en: "Crash-safe and idempotent: one transaction per file, keyed upserts, retries never write a row twice." },
    ],
    role: { az: "Fərdi layihə: qaydalar, OCR emalı, testlər, ölçmə və izah səhifəsi.", en: "Solo project: rules, OCR handling, tests, measurement and the case page." },
    results: [
      { az: "280 sintetik fakturada qoyulmuş qüsurların 31/31-i tutuldu.", en: "31 of 31 planted defects caught across 280 synthetic invoices." },
      { az: "Görmədiyi şablonlarda 'ok' kimi keçən qüsurlu faktura: 0.", en: "On unseen layouts, defective invoices that passed as 'ok': 0." },
    ],
  },
  {
    slug: "risk-register",
    index: "05",
    name: "Drift",
    title: { az: "Risk reyestri → Jira sinxronizasiyası", en: "Risk register → Jira sync" },
    tagline: {
      az: "Excel-dəki ISO/IEC 27001 risk reyestri ilə Jira-dakı işi uyğun saxlayır və hər dəyişikliyin izini qoyur.",
      en: "Keeps an ISO/IEC 27001 risk register in Excel and the work in Jira consistent, with an audit trail of every change.",
    },
    live: "https://kulieff21.github.io/risk-register-jira-sync/",
    code: "https://github.com/kulieff21/risk-register-jira-sync",
    source: "https://github.com/kulieff21/risk-register-jira-sync#results",
    stack: ["Python", "Jira Cloud REST API", "openpyxl", "pytest"],
    readouts: [
      { label: { az: "Təkrar işə salma", en: "Unchanged rerun" }, value: { az: "0 yazma", en: "0 writes" } },
      { label: { az: "Əl dəyişikliyi", en: "Hand edits" }, value: "2 → drift 2" },
      { label: { az: "Test", en: "Tests" }, value: "105" },
    ],
    problem: {
      az: "Risk reyestri Excel-də, tədbirlər Jira-da yaşayır. Biri əl ilə dəyişəndə iki mənbə ayrılır və bunu heç kim görmür.",
      en: "The register lives in Excel, the treatment work in Jira. When someone edits one by hand, the two drift apart and nobody notices.",
    },
    did: [
      { az: "Hər sahənin bir sahibi var: məzmun reyestrə, status Jira-ya aiddir. Jira-da reyestr sahəsinin əl ilə dəyişməsi drift kimi göstərilir.", en: "Every field has one owner: content belongs to the register, status to Jira. A hand edit of a register field in Jira shows up as drift." },
      { az: "Yazmazdan əvvəl yoxlama, standart olaraq dry run, hər yazma üçün audit jurnalı; heç nə silinmir və bağlanmır.", en: "Validation before any write, dry run by default, an audit log for every write; nothing is deleted or closed." },
    ],
    role: { az: "Fərdi layihə: dizayn, kod, Jira API inteqrasiyası, canlı test.", en: "Solo project: design, code, Jira API integration, the live run." },
    results: [
      { az: "Canlı Jira: 24 issue yaradıldı; dəyişikliksiz təkrar işə salmada 0 yazma; 2 əl dəyişikliyi dəqiq 2 drift kimi tutuldu.", en: "Live Jira run: 24 issues created; 0 writes on an unchanged rerun; 2 hand edits caught as exactly 2 drifts." },
    ],
  },
  {
    slug: "lead-intake",
    index: "06",
    name: "Intake",
    title: { az: "İnsan təsdiqli müraciət qəbulu (n8n)", en: "Lead intake with human approval (n8n)" },
    tagline: {
      az: "Veb formdan gələn müraciət yoxlanılır, iki dəfə qiymətləndirilir və yalnız insan təsdiqindən sonra cavablanır.",
      en: "A web-form lead is validated, scored twice and answered only after a person approves.",
    },
    live: "https://kulieff21.github.io/lead-intake-n8n-demo/",
    code: "https://github.com/kulieff21/lead-intake-n8n-demo",
    source: "https://github.com/kulieff21/lead-intake-n8n-demo#results-dev-run",
    stack: ["n8n", "REST API", "Google Sheets", "Telegram Bot API", "LLM (JSON schema)"],
    readouts: [
      { label: { az: "E2E ssenari", en: "E2E scenarios" }, value: "10 / 10" },
      { label: { az: "Qəbul", en: "Accepted in" }, value: "77 ms" },
      { label: { az: "Səssiz itki", en: "Silent losses" }, value: "0" },
    ],
    problem: {
      az: "Formdan gələn müraciətlər itir, təkrarlanır və ya yoxlanılmadan cavablanır. Süni intellekt cavabı yaza bilər, amma göndərmə qərarı insanda qalmalıdır.",
      en: "Form leads get lost, duplicated or answered unchecked. An AI can draft the reply, but the decision to send must stay with a person.",
    },
    did: [
      { az: "Səhv müraciət bütün xətaları ilə 422 alır; honeypot spamı səssizcə atılır; təkrar müraciət eyni sətri yeniləyir.", en: "A bad submission gets 422 with every error; a honeypot drops spam quietly; a repeat updates the same row." },
      { az: "Qayda balı və strict JSON schema ilə LLM balı; fərq böyükdürsə Telegram mesajı bunu deyir. Göndərmə yalnız Telegram-da təsdiqdən sonra.", en: "A rule score and an LLM score under a strict JSON schema; a big gap is flagged in Telegram. Sending happens only after approval there." },
      { az: "Hər xəta xəbərdarlıq və jurnal sətri ilə bitir; formdakı mətn modelə təlimat yox, data kimi gedir.", en: "Every failure ends in an alert and an errors row; form text reaches the model as data, not instructions." },
    ],
    role: { az: "Fərdi layihə: workflow dizaynı, inteqrasiyalar, e2e testlər.", en: "Solo project: workflow design, integrations, end-to-end tests." },
    results: [{ az: "10 ssenarinin hamısı keçir: səhv giriş, spam, təsdiq, rədd, dublikat, prompt injection, LLM və poçt xətaları, vaxtı keçmə.", en: "All 10 scenarios pass: invalid input, spam, approve, reject, duplicate, prompt injection, LLM and mail failures, expiry." }],
  },
  {
    slug: "twenion",
    index: "07",
    name: "Twenion",
    title: { az: "Twenion: veb studiya və demo saytlar", en: "Twenion: web studio and demo sites" },
    tagline: {
      az: "Studiya saytı və hər biri öz işinə görə qurulmuş dörd demo sayt.",
      en: "The studio site and four demo sites, each shaped by the job it does.",
    },
    live: "https://twenion.com",
    source: "https://twenion.com",
    stack: ["HTML", "CSS", "JavaScript", "Cloudflare Pages", "GitHub Pages", "axe", "Lighthouse"],
    readouts: [
      { label: { az: "Demo sayt", en: "Demo sites" }, value: "4" },
      { label: { az: "Dil", en: "Languages" }, value: "AZ · EN" },
      { label: { az: "Domen e-poçtu", en: "Domain e-mail" }, value: "SPF · DKIM · DMARC" },
    ],
    problem: {
      az: "Kiçik biznesin saytı şablona bənzəyir. Hər demo sahənin öz işindən çıxan bir formadadır: izləmə, katalog, bron təqvimi, qiymət kalkulyatoru.",
      en: "Small-business sites look like templates. Each demo takes its shape from the trade's own job: tracking, a catalogue, a booking calendar, a quote calculator.",
    },
    did: [
      { az: "Xəzər Ekspres: kargo izləmə zolağı və göndəriş qeydi.", en: "Xəzər Ekspres: a parcel tracking strip and a shipment record." },
      { az: "Zərrə: kosmetika kataloqu, səbət və sifariş.", en: "Zərrə: a cosmetics catalogue, cart and checkout." },
      { az: "Qırx Pəncərə: Şəki qonaq evi üçün 365 gecəlik qiymət təqvimi və bron forması.", en: "Qırx Pəncərə: 365 published nightly prices and a booking form for a Shaki guesthouse." },
      { az: "Kəsim: metal emalı üçün canlı qiymət kalkulyatoru və təbəqə yerləşdirmə sxemi.", en: "Kəsim: a live quote calculator and sheet-nesting diagram for metalwork." },
    ],
    role: { az: "Bütün hissələr: konsept, dizayn, HTML/CSS/JavaScript, iki dilli məzmun, əlçatanlıq və performans yoxlamaları, deploy.", en: "Every part: concept, design, HTML/CSS/JavaScript, bilingual content, accessibility and performance checks, deployment." },
    results: [{ az: "Hamısı canlıdır və ödəniş və ya şəxsi məlumat qəbul etmir; markalar uydurmadır.", en: "All live; none takes payments or personal data; the brands are fictional." }],
  },
];

export const DEMOS = [
  { slug: "cargo", url: "https://twenion.github.io/cargo-site-demo/", name: "Xəzər Ekspres", kind: { az: "Kargo izləmə", en: "Parcel tracking" } },
  { slug: "ecommerce", url: "https://twenion.github.io/ecommerce-site-demo/", name: "Zərrə", kind: { az: "Kataloq və səbət", en: "Catalogue and cart" } },
  { slug: "hotel", url: "https://twenion.github.io/hotel-site-demo/", name: "Qırx Pəncərə", kind: { az: "Bron təqvimi", en: "Booking calendar" } },
  { slug: "manufacturing", url: "https://twenion.github.io/manufacturing-site-demo/", name: "Kəsim", kind: { az: "Qiymət kalkulyatoru", en: "Quote calculator" } },
] as const;

export const text = (v: string | L, locale: "az" | "en") => (typeof v === "string" ? v : v[locale]);

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
