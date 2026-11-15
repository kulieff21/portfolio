export const LOCALES = ["az", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

const az = {
  name: "Elmar Quliyev",
  role: "Full-stack developer",
  place: "Bakı",
  meta: {
    title: "Elmar Quliyev — Full-stack developer",
    description: "Next.js, React və Python ilə tam veb tətbiqlər. Hər layihənin yanında onun ölçülmüş nəticəsi.",
  },
  nav: { work: "İşlər", about: "Haqqımda", contact: "Əlaqə", cv: "CV (PDF)" },
  hero: {
    kicker: "Full-stack developer · Next.js, React, Python · Bakı",
    title: ["Hər layihənin yanında", "onun ", "ölçüsü", " var."],
    lead: "İnterfeysdən verilənlər bazasına qədər tam veb tətbiqlər qurub canlıya çıxarıram. Aşağıdakı göstəricilər bəzək deyil: hər biri layihənin öz nəticəsindən gəlir, bəziləri isə indi, canlı işləyir.",
    work: "İşlərə bax",
    cv: "CV-ni yüklə",
    measuring: "ölçülür",
  },
  strip: {
    baku: "Bakı vaxtı",
    rampa: "Rampa canlı",
    busy: (n: number) => `${n}/3 qaldırıcı məşğul`,
    closed: "servis bağlıdır",
    open: "Açıq iş təkliflərinə",
    status: "hazıram",
  },
  rack: {
    title: "İşlər",
    lead: "Yeddi modul, yeddi layihə. Hər modulun ekranı layihənin öz rəqəmlərini göstərir; mənbə linki layihənin öz səhifəsindədir.",
    measured: "ölçülüb",
    live: "canlı",
    open: "Ətraflı",
    site: "Sayt",
    code: "Kod",
  },
  rampa: {
    bay: "Qaldırıcı",
    free: "boş",
    until: (t: string) => `${t}-dək`,
    plan: "plan",
    loading: "Rampa-ya qoşulur…",
    offline: "Rampa cavab vermir",
    parts: {
      engine: "Mühərrik", battery: "Akkumulyator", ac: "Kondisioner", brakes: "Əyləclər",
      wheels: "Təkərlər", axles: "Oxlar", suspension: "Asqı", dash: "Elektronika",
    } as Record<string, string>,
  },
  ledger: { raw: "xam sətir", reconciled: "tutuşdurma", mismatch: "uyğunsuzluq", numbers: "rəqəm yoxlandı" },
  invoice: { scanned: "yoxlanıldı", caught: "qüsur tutuldu", ok: "qüsurlu 'ok'" },
  drift: { register: "Reyestr (Excel)", jira: "Jira", edit: "əl ilə dəyişiklik", drift: "drift", synced: "sinxron", writes: "yazma" },
  intake: {
    nodes: ["Form", "Yoxlama", "Dublikat", "Qayda balı", "LLM balı", "Təsdiq", "Cavab"],
    waiting: "insan təsdiqi gözlənilir",
    approved: "təsdiqləndi",
  },
  about: {
    title: "Haqqımda",
    body: [
      "İnformasiya təhlükəsizliyi üzrə bakalavram (ADNSU, 2026) və UNEC-də eyni ixtisas üzrə magistraturada oxuyuram.",
      "Veb tətbiqi başdan-sona qururam: interfeys, server tərəfi, verilənlər bazası, testlər və deploy. Təhlükəsizlik təhsilim sayəsində giriş nəzarəti, sessiyalar və SQL injection kimi riskləri kodu yazarkən nəzərə alıram.",
      "İşləmə qaydam sadədir: əvvəl nəyin ölçüləcəyini yazıram, sonra qururam, sonra ölçürəm. Bu saytdakı rəqəmlər də belə yaranıb.",
    ],
    education: "Təhsil",
    edu: [
      { what: "Magistratura, İnformasiya təhlükəsizliyi", where: "UNEC", when: "2026 – indiyədək" },
      { what: "Bakalavriat, İnformasiya təhlükəsizliyi", where: "ADNSU, dövlət sifarişli", when: "2022 – 2026" },
    ],
    skills: "Bacarıqlar",
    languages: "Dillər",
    langs: "Azərbaycan dili (ana dili) · türk dili (C2) · ingilis dili (B2)",
  },
  contact: {
    title: "Əlaqə",
    lead: "Full-stack və frontend vakansiyalarına açığam: Bakıda ofis və ya remote, tam və ya yarım ştat.",
    email: "E-poçt",
    github: "GitHub",
    cvAz: "CV · Azərbaycanca",
    cvEn: "CV · English",
  },
  case: {
    back: "Bütün işlər",
    problem: "Məsələ",
    did: "Nə etdim",
    role: "Rolum",
    results: "Nəticə",
    stack: "Texnologiyalar",
    source: "Rəqəmlərin mənbəyi",
    next: "Növbəti iş",
  },
  footer: "Bu sayt Next.js və React ilə qurulub, Vercel-də işləyir.",
};

export type Dict = typeof az;

const en: Dict = {
  name: "Elmar Guliyev",
  role: "Full-stack developer",
  place: "Baku",
  meta: {
    title: "Elmar Guliyev — Full-stack developer",
    description: "Complete web applications with Next.js, React and Python. Every project comes with its measured result.",
  },
  nav: { work: "Work", about: "About", contact: "Contact", cv: "CV (PDF)" },
  hero: {
    kicker: "Full-stack developer · Next.js, React, Python · Baku",
    title: ["Every project", "comes with its ", "measurement", "."],
    lead: "I build complete web applications, from the interface to the database, and ship them. The instruments below are not decoration: each shows a project's own result, and some of them are running live right now.",
    work: "See the work",
    cv: "Download CV",
    measuring: "measuring",
  },
  strip: {
    baku: "Baku time",
    rampa: "Rampa live",
    busy: (n: number) => `${n}/3 bays busy`,
    closed: "workshop closed",
    open: "Open to job offers",
    status: "available",
  },
  rack: {
    title: "Work",
    lead: "Seven modules, seven projects. Each screen shows the project's own numbers; the source link is on its case page.",
    measured: "measured",
    live: "live",
    open: "Open case",
    site: "Site",
    code: "Code",
  },
  rampa: {
    bay: "Bay",
    free: "free",
    until: (t: string) => `until ${t}`,
    plan: "plan",
    loading: "Connecting to Rampa…",
    offline: "Rampa is not answering",
    parts: {
      engine: "Engine", battery: "Battery", ac: "Air-con", brakes: "Brakes",
      wheels: "Wheels", axles: "Axles", suspension: "Suspension", dash: "Electronics",
    },
  },
  ledger: { raw: "raw lines", reconciled: "reconciled", mismatch: "mismatches", numbers: "numbers checked" },
  invoice: { scanned: "checked", caught: "defects caught", ok: "defective 'ok'" },
  drift: { register: "Register (Excel)", jira: "Jira", edit: "hand edit", drift: "drift", synced: "in sync", writes: "writes" },
  intake: {
    nodes: ["Form", "Validate", "Dedup", "Rule score", "LLM score", "Approve", "Reply"],
    waiting: "waiting for a human",
    approved: "approved",
  },
  about: {
    title: "About",
    body: [
      "I have a bachelor's degree in Information Security (ASOIU, 2026) and study for a master's in the same field at UNEC.",
      "I build web applications end to end: interface, server side, database, tests and deployment. My security background makes me think about access control, sessions and SQL injection while writing the code, not after.",
      "The way I work is simple: first write down what will be measured, then build, then measure. That is where the numbers on this site come from.",
    ],
    education: "Education",
    edu: [
      { what: "Master's, Information Security", where: "UNEC", when: "2026 – present" },
      { what: "Bachelor's, Information Security", where: "ASOIU, state-funded", when: "2022 – 2026" },
    ],
    skills: "Skills",
    languages: "Languages",
    langs: "Azerbaijani (native) · Turkish (C2) · English (B2)",
  },
  contact: {
    title: "Contact",
    lead: "Open to full-stack and frontend roles: office in Baku or remote, full or part time.",
    email: "E-mail",
    github: "GitHub",
    cvAz: "CV · Azerbaijani",
    cvEn: "CV · English",
  },
  case: {
    back: "All work",
    problem: "Problem",
    did: "What I did",
    role: "My role",
    results: "Result",
    stack: "Stack",
    source: "Source of the numbers",
    next: "Next project",
  },
  footer: "This site is built with Next.js and React and runs on Vercel.",
};

export const SKILLS: { group: { az: string; en: string }; items: string }[] = [
  { group: { az: "Frontend", en: "Frontend" }, items: "HTML, CSS, JavaScript, TypeScript, React, Next.js (App Router)" },
  { group: { az: "Backend", en: "Backend" }, items: "Node.js, Server Actions, Route Handlers, REST API, Python" },
  { group: { az: "Verilənlər bazası", en: "Databases" }, items: "PostgreSQL (Neon), SQLite, SQL" },
  { group: { az: "Test və deploy", en: "Test and deploy" }, items: "Vitest, Playwright, pytest, GitHub Actions, Vercel" },
  { group: { az: "Təhlükəsizlik", en: "Security" }, items: "OWASP Top 10, access control, SPF/DKIM/DMARC, TLS" },
];

export const dicts: Record<Locale, Dict> = { az, en };
export const getDict = (l: Locale) => dicts[l];
