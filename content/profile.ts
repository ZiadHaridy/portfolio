/**
 * Single source of truth for the whole site.
 * Edit this file to update copy — every section (and /api/profile.json) reads from here.
 */

export const profile = {
  name: "Ziad Ahmed",
  firstName: "Ziad",
  initials: "ZA",
  role: "Senior Software Engineer",
  // Square photo at /public/ziad.jpg. If the file is missing, the hero falls back to the "ZA." monogram.
  photo: "/ziad.jpg" as string | null,
  location: "Egypt",
  timezone: "Africa/Cairo",
  openToWork: true,
  email: "IZiadHaridy@gmail.com",
  phone: "+201097438893",
  whatsapp: "https://wa.me/201097438893",
  cv: "/Ziad_Ahmed_CV.pdf",
  links: {
    github: "https://github.com/ZiadHaridy",
    linkedin: "https://www.linkedin.com/in/ziad-ahmed-6147b5235/",
    youtube: "https://www.youtube.com/@Ziad-Ahmed-Mohamed",
    kodb: "https://github.com/ZiadHaridy/KO-DB",
  },
  rotatingWords: ["scale.", "stay up.", "cost less.", "go 115× faster.", "survive 3am."],
  summary:
    "Senior software engineer who designs, builds and runs production systems end to end, from AWS infrastructure and CI/CD to Node.js/TypeScript backends (NestJS, PostgreSQL, MongoDB, Redis, BullMQ, SQS/SNS) and React/Next.js frontends. I currently lead a 14-person engineering team across Egypt and India, build a healthcare-AI transcription platform, and I'm founding a salon & barber booking startup.",
};

export type Metric = { value: number; prefix?: string; suffix: string; label: string; note: string; where: string; decimals?: number; display?: string };

export const metrics: Metric[] = [
  { value: 115, suffix: "×", label: "faster Order List API", note: "MongoDB index utilization restored — zero schema changes", where: "Nugttah" },
  { value: 98, suffix: "%", label: "less memory on exports", note: "100,000+ record export pipeline, no timeouts", where: "Nugttah" },
  { value: 140, suffix: "×", label: "faster transcript rebuild", note: "42 s → 0.3 s of event-loop time at the 120-chunk cap", where: "Nuxera" },
  { value: 2, prefix: "~$", suffix: "K/yr", label: "cut from AWS spend", note: "RDS upgrade, idle EC2s, unused Elastic IPs", where: "Proven Solution" },
  { value: 153, suffix: "", label: "REST APIs, solo-built", note: "~85K lines of TypeScript · 629 commits · 9 months", where: "Solid Ground" },
  { value: 1, display: "804 → 1", suffix: "", label: "project loads per save", note: "~1,600 redundant queries and 10K log lines gone; the platform stopped stalling", where: "Proven Solution" },
];

export type Lens = "recruiter" | "engineer" | "student";

export const lenses: Record<Lens, { label: string; emoji: string; title: string; lead: string; bullets: string[]; cta: { label: string; href: string } }> = {
  recruiter: {
    label: "Recruiter",
    emoji: "🧑‍💼",
    title: "The 30-second version",
    lead: "Senior software engineer, 5+ years, backend-heavy and full-stack, open to work. Solo-built the backend of a US voice-AI SaaS end to end, and has the production numbers to show for it.",
    bullets: [
      "Owns systems end to end: APIs, billing, queues, AWS cost & security, deployment",
      "Ships and runs it: built CI/CD from scratch (7 pipelines, 2 AWS regions) and led outage response",
      "Measurable wins: 115× faster API · 140× faster transcript rebuild · 98% less memory · ~$2K/yr AWS savings",
      "Security by reflex: closed privilege escalation, locked down biometric endpoints, kept patient data out of logs",
      "Calm in incidents: region evacuation with zero data loss, leaked-key response",
      "Leads teams: Project Lead of a 14-person team at Proven Solution; also led hiring interviews, wrote an engineering playbook, and teaches at university",
    ],
    cta: { label: "Download CV", href: "/Ziad_Ahmed_CV.pdf" },
  },
  engineer: {
    label: "Engineer",
    emoji: "🛠️",
    title: "Skip the adjectives, run the code",
    lead: "Scroll down to the Systems Lab: a fair-share call dispatcher (Deficit Round Robin + Redis leader election), a KV database with WAL recovery and sharding, and replays of real performance fixes.",
    bullets: [
      "Redis + Lua leader election, per-tenant capacity limits",
      "Event-driven workflows on SQS/SNS, BullMQ job processing",
      "Mongo/Postgres query tuning: from COLLSCAN to IXSCAN",
      "Spring Cloud on AWS: commit-tagged deploys with Flyway boot checks",
      "Clean Architecture refactors and an adopted engineering playbook",
    ],
    cta: { label: "Open the Systems Lab", href: "#lab" },
  },
  student: {
    label: "Student",
    emoji: "🎓",
    title: "Hi! I was literally in your seat",
    lead: "B.Sc. CS at AASTMT (GPA 3.72, ranked 3rd), now a teaching assistant there for Software Component Design and Software Architecture. I build things from scratch, like a database in Go, and explain them on YouTube.",
    bullets: [
      "Watch the KO-DB build: storage, WAL, TCP layer, sharding",
      "Play with the KO-DB terminal right here on the page",
      "Read my backend roadmap: the path I'd take again",
      "Books on my shelf: DDIA, Software Architecture in Practice, Clean Architecture, Clean Code, Dive Into Design Patterns",
      "Questions? My inbox is open",
    ],
    cta: { label: "Go to the student corner", href: "#students" },
  },
};

// logo: file in /public/logos. Without a logo the marquee shows a monogram.
export const companies: { name: string; tag: string; logo?: string; wide?: boolean }[] = [
  { name: "Proven Solution", tag: "Real estate CRM · AWS", logo: "/logos/proven.png" },
  { name: "Nuxera", tag: "Healthcare AI", logo: "/logos/nuxera.png", wide: true },
  { name: "Solid Ground Solutions", tag: "US · Voice AI SaaS" },
  { name: "Nugttah", tag: "Loyalty & F&B", logo: "/logos/nugttah.png" },
  { name: "Botit", tag: "E-commerce & delivery", logo: "/logos/botit.png" },
  { name: "Sonbola · السنبلة", tag: "Customs clearance · Alexandria", logo: "/logos/sonbola.png" },
  { name: "AASTMT", tag: "Teaching", logo: "/logos/aastmt.png" },
];

export const techMarquee = [
  "Node.js", "TypeScript", "NestJS", "Go", "Java", "Spring Boot", "PostgreSQL", "MongoDB", "Redis",
  "AWS", "Docker", "Kubernetes", "Terraform", "BullMQ", "SQS / SNS", "Kafka", "RabbitMQ",
  "React", "Next.js", "React Native", "Stripe", "Twilio", "gRPC", "GraphQL",
];

export const experience = [
  {
    role: "Founder",
    company: "Salon & barber booking startup",
    period: "2026 – Present",
    type: "Own product · Egypt",
    domain: "Customer app, partner app, admin panel & dashboards",
    stack: ["React Native", "Node.js", "MongoDB", "Redis", "AWS", "Cloudflare"],
  },
  {
    role: "Project Lead & Senior Software Engineer",
    company: "Proven Solution",
    period: "Sep 2026 – Present",
    type: "Contract · Remote · 14-person team",
    domain: "Real estate agency & CRM platform",
    stack: ["Java", "Spring Boot", "Spring Cloud", "MySQL", "React", "Docker", "AWS"],
  },
  {
    role: "Senior Software Engineer",
    company: "Nuxera",
    period: "Aug 2026 – Present",
    type: "Contract · Remote (KSA)",
    domain: "Medical transcription & clinical documentation (CDI) platform",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "BullMQ"],
  },
  {
    role: "Senior Backend Engineer",
    company: "Nugttah",
    period: "Jul 2025 – Jul 2026",
    type: "Full-time",
    domain: "Loyalty & rewards platform · F&B",
    stack: ["Node.js", "Go", "MongoDB", "AWS"],
  },
  {
    role: "Senior Backend & Platform Engineer",
    company: "Solid Ground Solutions LLC",
    period: "Jan 2025 – Apr 2026",
    type: "Contract · Remote (US)",
    domain: "AI voice-agent SaaS calling platform",
    stack: ["Next.js", "Node.js", "Redis", "MongoDB", "PostgreSQL", "AWS", "Stripe"],
  },
  {
    role: "Teaching Assistant",
    company: "AASTMT",
    period: "Feb 2026 – Present",
    type: "Part-time",
    domain: "Software Engineering Department",
    stack: ["Software Component Design", "Software Architecture", "Java", "OOP", "SQL"],
  },
  {
    role: "Backend Engineer (Mid-level)",
    company: "Botit",
    period: "Sep 2023 – Sep 2025",
    type: "Full-time",
    domain: "E-commerce / delivery platform",
    stack: ["Node.js", "MongoDB", "Shopify", "GitHub Actions"],
  },
  {
    role: "Freelance Software Engineer",
    company: "Sonbola (السنبلة)",
    period: "",
    type: "Freelance · Customs clearance · Alexandria",
    domain: "Customs & clearance operations system",
    stack: [],
  },
];

export const work = [
  {
    id: "01",
    title: "Healthcare AI transcription & CDI platform",
    featured: true,
    company: "Nuxera",
    period: "",
    kicker: "Secure, measured, honest with data",
    stats: [
      { k: "Commits", v: "300" },
      { k: "Repos", v: "7" },
      { k: "Throughput", v: "3.7×" },
      { k: "Rebuild", v: "42s → 0.3s" },
    ],
    summary:
      "Backend core of a medical transcription and clinical-documentation platform used by doctors. I made it faster, closed its security holes, and stopped it from showing fake numbers.",
    bullets: [
      "Audio pipeline: async ffmpeg and one probe per chunk, for 3.7× throughput and 74–118 ms less event-loop blocking per chunk",
      "Transcript rebuild at the 120-chunk cap: 42 s → 0.3 s of event-loop time, with Arabic-aware numeral matching",
      "Security: closed four privilege-escalation paths and locked down unauthenticated voice-biometric endpoints",
      "Honest analytics: every metric is live | partial | proposed, so the UI says “not instrumented” instead of a fake 0",
    ],
    integrations: ["PostgreSQL", "OpenAI", "ffmpeg", "Opus", "ONNX", "React Query"],
    stack: ["Node.js", "TypeScript", "PostgreSQL", "React", "ffmpeg", "ONNX"],
    diagram: "health",
  },
  {
    id: "02",
    title: "Real estate CRM platform on Spring Cloud & AWS",
    featured: true,
    company: "Proven Solution",
    period: "Sep 2026 – Present",
    kicker: "Project Lead · 14 engineers, two countries",
    stats: [
      { k: "Engineers led", v: "14" },
      { k: "Repos split", v: "1 → 5" },
      { k: "Loads per save", v: "804 → 1" },
      { k: "AWS spend", v: "−$2K/yr" },
    ],
    summary:
      "I lead a real estate agency CRM as Project Lead, coordinating 14 engineers across Egypt and India, and I own its AWS account, delivery pipeline and performance.",
    bullets: [
      "One of two AWS admins: everyone else gets scoped, least-privilege access; a leaked key was revoked and replaced with per-engineer IAM users",
      "Split the monorepo into 5 repos with their own CI/CD pipelines; deploys dropped from 14 to 4.2 minutes",
      "One project load per save instead of 804, removing ~1,600 redundant queries that kept stalling the platform",
      "Cut AWS spend by ~$2,000/year and fixed a production RDS outage caused by leaking database connections",
    ],
    integrations: ["Twilio", "Telnyx", "Facebook Lead Ads", "Mailchimp", "Outlook", "Google Calendar", "Google Analytics", "BigQuery"],
    stack: ["Java", "Spring Boot", "Spring Cloud", "MySQL", "React", "Docker", "AWS"],
    diagram: "crm",
  },
  {
    id: "03",
    title: "AI voice-agent calling platform",
    featured: true,
    company: "Solid Ground Solutions · US",
    period: "2025 – 2026",
    kicker: "Solo backend, end to end",
    stats: [
      { k: "REST APIs", v: "153" },
      { k: "Lines of TS", v: "~85K" },
      { k: "Commits", v: "629" },
      { k: "Months", v: "9" },
    ],
    summary:
      "Sole backend engineer on an outbound AI-calling SaaS: campaigns, billing, real-time call monitoring, multi-agent call routing and containerized deployment.",
    bullets: [
      "Redis Deficit Round Robin dispatcher with atomic Lua leader election and per-user capacity limits",
      "Billing end to end with Stripe: real-time credit deduction, auto-recharge, auto-pausing campaigns, Twilio subaccounts",
      "Replaced Zapier with an internal workflow tool, saving about $300/month",
      "Multi-agent “Squads” routing (AI-to-AI transfers), voice cloning on S3, Clean Architecture refactor and the team playbook",
    ],
    integrations: ["Stripe", "Twilio", "S3", "Docker"],
    stack: ["Node.js", "TypeScript", "Redis", "MongoDB", "PostgreSQL", "AWS", "Docker", "Next.js"],
    diagram: "voice",
  },
  {
    id: "04",
    title: "Loyalty & rewards platform",
    company: "Nugttah",
    period: "2025 – 2026",
    kicker: "Performance & resilience",
    stats: [
      { k: "Order List API", v: "115×" },
      { k: "Export memory", v: "−98%" },
      { k: "Startup time", v: "−97%" },
      { k: "Data lost", v: "0" },
    ],
    summary:
      "Made a production F&B loyalty platform faster, leaner and more resilient, including an emergency cross-region migration.",
    bullets: [
      "115× faster Order List API by fixing MongoDB queries to fully restore index utilization, with zero schema changes",
      "Re-architected the order export pipeline to handle 100,000+ records without timeouts, 98% less memory, correct Arabic text rendering",
      "Cut server startup time by 97%: async processing, no queue blocking, reliable lost-message handling",
      "Resolved MongoDB replication race conditions with primary–secondary synchronization",
      "Led the emergency Bahrain → Mumbai infrastructure migration with zero data loss",
    ],
    integrations: [],
    stack: ["Node.js", "Go", "MongoDB", "AWS", "Cloudflare"],
    diagram: "perf",
  },
  {
    id: "05",
    title: "E-commerce & delivery platform",
    company: "Botit",
    period: "2023 – 2025",
    kicker: "Integrations & velocity",
    stats: [
      { k: "Query perf", v: "+30–42%" },
      { k: "Deploy speed", v: "+45%" },
      { k: "Push", v: "APNs + FCM" },
      { k: "Retool", v: "Replaced" },
    ],
    summary:
      "Real-time Shopify integrations and an event-driven notification service, plus a faster CI/CD pipeline and a custom internal dashboard.",
    bullets: [
      "Real-time Shopify integrations + notification service (APNs, Firebase) for event-driven data sync",
      "Boosted query performance by 30–42% and deployment speed by 45% on GitHub Actions",
      "Unit & integration tests, Swagger/OpenAPI docs, threat modeling and input sanitization",
      "Replaced Retool with a custom internal dashboard; ran code reviews and led the engineering interview process",
    ],
    integrations: ["Shopify", "APNs", "Firebase"],
    stack: ["Node.js", "MongoDB", "GitHub Actions", "Swagger"],
    diagram: "events",
  },
  {
    id: "06",
    title: "Customs clearance operations system",
    company: "Sonbola (السنبلة) · Alexandria",
    period: "Freelance",
    kicker: "Freelance · real-world logistics, end to end",
    stats: [
      { k: "Domain", v: "Customs clearance" },
      { k: "Port", v: "Alexandria" },
      { k: "Shipping lines", v: "CMA CGM · MSC · TARROS" },
    ],
    summary:
      "A freelance build for a large customs-clearance company in Alexandria: the clearance workflow for shipments from lines like CMA CGM, MSC and TARROS, plus the departments and staff around it.",
    bullets: [
      "Customs & clearance: each shipment's clearance process, tied to its shipping line (CMA CGM, MSC, TARROS and others)",
      "Messages department: a dedicated module for the department that handles clearance messages",
      "Custodies (عُهد): tracking the cash and items entrusted to employees so every custody is accounted for",
      "Employee navigation: tracking where staff are sent across clearance jobs",
    ],
    integrations: [],
    stack: [],
    diagram: "customs",
  },
  {
    id: "08",
    title: "Salon & barber booking platform",
    featured: true,
    company: "Founder · own startup",
    period: "2026 – Present",
    kicker: "Founder, designed and running the whole stack",
    stats: [
      { k: "Apps", v: "2 mobile" },
      { k: "Web apps", v: "3" },
      { k: "AWS services", v: "10" },
      { k: "Open ports", v: "80 · 443" },
    ],
    summary:
      "An appointment-booking platform in Egypt for salons and home-visit barbers: a customer app, a partner app for salons and barbers, an admin panel and dashboards. I designed and run the infrastructure below.",
    bullets: [
      "Customer app shipped with gamification (free haircuts, coupons) and safety verification for home visits",
      "Lean, locked-down AWS: one ARM EC2 behind Caddy, no SSH (Session Manager only), secrets in Parameter Store",
      "Private ID files behind signed links; public photos through CloudFront; Cloudflare Zero Trust in front of the admin",
      "GitHub Actions builds ARM images to ECR and deploys with Run Command; web apps ship on Cloudflare Pages",
    ],
    integrations: ["MongoDB Atlas", "Expo push", "SMS OTP", "Google Sign-In", "Apple Sign-In", "SES", "Cloudflare"],
    stack: ["React Native", "Node.js", "TypeScript", "Express", "MongoDB", "Redis", "AWS", "Docker", "Cloudflare"],
    diagram: "booking",
    architecture: {
      src: "/architecture/booking-platform.webp",
      full: "/architecture/booking-platform.png",
      alt: "Architecture of the salon and barber booking platform: mobile and web apps reach a single ARM EC2 instance (Caddy, Node.js API, Redis) through Cloudflare DNS; photos go through CloudFront from S3; email through SES and SNS; images built by GitHub Actions are pushed to ECR and deployed with Systems Manager; MongoDB Atlas, SMS OTP, Expo push, Google and Apple sign-in sit outside AWS.",
    },
  },
  {
    id: "07",
    title: "KO-DB: a key-value database from scratch",
    featured: true,
    company: "Open source · Go",
    period: "Side project",
    kicker: "Systems fundamentals",
    stats: [
      { k: "Language", v: "Go" },
      { k: "Durability", v: "WAL" },
      { k: "Transport", v: "Raw TCP" },
      { k: "Scale-out", v: "Shards" },
    ],
    summary:
      "A key-value store built from first principles: storage, retrieval, persistence, a network layer and sharding, with a YouTube walkthrough of the internals.",
    bullets: [
      "Core storage, retrieval and persistence internals written from scratch in Go",
      "Compressed write-ahead log, replayed to rebuild state when the DB restarts",
      "Network layer designed from scratch on TCP to serve reads and writes",
      "Sharded the main DB across multiple clusters",
    ],
    integrations: [],
    stack: ["Go", "TCP", "WAL", "Sharding"],
    diagram: "kodb",
    links: [
      { label: "GitHub repo", href: "https://github.com/ZiadHaridy/KO-DB" },
      { label: "YouTube walkthrough", href: "https://www.youtube.com/@Ziad-Ahmed-Mohamed" },
    ],
  },
];

export const incidents = [
  {
    id: "INC-0470",
    featured: true,
    sev: "SEV-1",
    title: "API-wide 500s: memory-starved RDS MySQL",
    org: "Proven Solution",
    what: "Production started returning 500s on every API.",
    action: "Traced it to a memory-starved RDS MySQL instance and used CloudTrail to rule out any human change. Took a snapshot, then resized prod from db.t4g.micro to db.t4g.small.",
    result: "Service restored, with CloudTrail evidence that nobody changed anything.",
    timeline: ["500s everywhere", "CloudTrail: no human change", "Snapshot", "Resized & restored"],
  },
  {
    id: "INC-0461",
    featured: true,
    sev: "SEV-1",
    title: "Privilege escalation in role ranking",
    org: "Nuxera",
    what: "An org admin could grant themselves system_admin, role revokes were never checked, DELETE /user/:id had no organisation scoping, and a suspended user's token kept working.",
    action: "Introduced role ranking so admins can't grant above their own rank, and closed each hole: revokes checked, deletes scoped to the organisation, suspended users' tokens rejected.",
    result: "Four escalation paths closed.",
    timeline: ["Found", "Ranked roles", "Scoped deletes", "Tokens revoked"],
  },
  {
    id: "INC-0455",
    sev: "SEV-1",
    title: "Unauthenticated biometric endpoints",
    org: "Nuxera",
    what: "While building voice enrollment, I found every /api/speaker-verification/* endpoint had no authentication.",
    action: "Locked the endpoints down, then reworked enrollment: no audio stored, the fingerprint kept out of the audit log, the voiceprint confirmed deleted before rows are removed.",
    result: "Voice biometrics protected by design, not by luck.",
    timeline: ["Found", "Locked down", "No audio stored", "Verified deletes"],
  },
  {
    id: "INC-0441",
    sev: "SEV-2",
    title: "Green pipeline, stale production",
    org: "Proven Solution",
    what: "A green pipeline had left a 4-hour-old image running while the database sat 3 migrations behind.",
    action: "Each deploy now ships an image tagged with its own commit, followed by a boot check that reports the Flyway version. Added automatic image cleanup after a deploy filled the host's disk.",
    result: "“Deployed” now means the right code against the right schema.",
    timeline: ["Mismatch found", "Commit tags", "Flyway boot check", "Disk cleanup"],
  },
  {
    id: "INC-0437",
    sev: "SEV-2",
    title: "Platform intermittently unusable",
    org: "Proven Solution",
    what: "Each project save ran about 1,600 redundant queries and 10,000 log lines over 8+ minutes, starving the shared async thread pool.",
    action: "Cut it to one project load per save instead of 804, and moved integration sync onto its own thread pool.",
    result: "Saves stopped starving everything else.",
    timeline: ["Profiled", "804 → 1 loads", "Own thread pool", "Stable"],
  },
  {
    id: "INC-0449",
    sev: "SEV-2",
    title: "Internal errors leaking to clients",
    org: "Nuxera",
    what: "About 35 catch blocks were sending raw Postgres and OpenAI error text to clients, and the login endpoint's timing revealed which emails had accounts.",
    action: "Added a global error handler, removed vendor names from responses, closed the timing oracle, and added a test that walks the router and fails on any route without auth.",
    result: "Clients see safe errors, and new routes can't ship unauthenticated.",
    timeline: ["Audited", "Global handler", "Timing fixed", "Guard test"],
  },
  {
    id: "INC-0433",
    sev: "SEV-1",
    title: "Production was reading the dev database",
    org: "Proven Solution",
    what: "The Spring profile was hardcoded, so production was pointed at the dev database.",
    action: "Moved the profile into each environment's settings so every deploy picks its own.",
    result: "Each environment talks to its own database.",
    timeline: ["Spotted", "Profile traced", "Per-env config", "Verified"],
  },
  {
    id: "INC-0412",
    featured: true,
    sev: "SEV-1",
    title: "Region evacuation: Bahrain → Mumbai",
    org: "Nugttah",
    what: "Regional geopolitical escalation put production infrastructure in Bahrain at risk.",
    action: "Assessed server risk early, planned the move, and executed the full infrastructure migration to Mumbai.",
    result: "Zero data loss.",
    timeline: ["Risk assessed", "Migration planned", "Cut over", "Verified"],
  },
  {
    id: "INC-0388",
    featured: true,
    sev: "SEV-1",
    title: "Leaked AWS access key",
    org: "Proven Solution",
    what: "An AWS access key was exposed.",
    action: "Detected it, revoked it, and replaced shared credentials with per-engineer IAM users scoped by least-privilege policies.",
    result: "Credential blast radius cut to one person, one policy.",
    timeline: ["Detected", "Revoked", "IAM per engineer", "Least privilege"],
  },
  {
    id: "INC-0351",
    sev: "SEV-2",
    title: "Production RDS outage",
    org: "Proven Solution",
    what: "Stale database connections were leaking memory until RDS fell over.",
    action: "Resolved the connection leak and scaled RDS vertically to absorb load.",
    result: "Database back up, with headroom to spare.",
    timeline: ["Paged", "Root cause: stale conns", "Fixed", "Scaled up"],
  },
  {
    id: "INC-0307",
    sev: "SEV-2",
    title: "Third-party security incident (Cloudflare)",
    org: "Nugttah",
    what: "A security incident hit a third-party platform the product relied on.",
    action: "Migrated users to internal infrastructure.",
    result: "Users never exposed to the compromised platform.",
    timeline: ["Advisory", "Assess exposure", "Migrate users", "Closed"],
  },
  {
    id: "INC-0274",
    sev: "SEV-3",
    title: "Slow boots, blocked queues",
    org: "Nugttah",
    what: "Server startup was slow and queue consumers blocked each other.",
    action: "Introduced asynchronous processing, removed queue blocking, and added reliable lost-message handling.",
    result: "Startup time −97%.",
    timeline: ["Profiled", "Async boot", "Unblocked queues", "Lost-msg handling"],
  },
  {
    id: "INC-0219",
    sev: "SEV-3",
    title: "MongoDB replication race conditions",
    org: "Nugttah",
    what: "Race conditions between replica nodes caused inconsistent reads.",
    action: "Synchronized primary and secondary nodes to remove the race.",
    result: "Consistent data across distributed nodes.",
    timeline: ["Reproduced", "Traced", "Synced", "Consistent"],
  },
];

export const stack = [
  { group: "Languages", items: ["Go", "TypeScript", "JavaScript", "Java", "Python", "SQL"] },
  { group: "Backend", items: ["Node.js", "NestJS", "Express", "Spring Boot", "Spring Cloud", "REST", "GraphQL", "gRPC", "WebSockets", "Webhooks", "ffmpeg", "OpenAI API"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite", "Flyway", "Indexing", "Query optimization", "Schema design"] },
  { group: "Cloud & DevOps", items: ["AWS EC2", "RDS", "S3", "SQS", "SNS", "SES", "ALB", "CloudFront", "CloudTrail", "Amplify", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "NGINX", "Cloudflare"] },
  { group: "Messaging", items: ["BullMQ", "SQS / SNS", "RabbitMQ", "Kafka", "Redis jobs"] },
  { group: "Frontend & Mobile", items: ["React", "Next.js", "React Native", "React Query", "Browser extensions", "TypeScript"] },
  { group: "Architecture", items: ["Microservices", "Event-driven", "Clean Architecture", "DDD", "SOLID", "Threat modeling"] },
  { group: "Testing", items: ["Jest", "Supertest", "Mocha", "Cypress"] },
];

export const howIWork = [
  { step: "01", title: "Prove the test catches the bug", body: "“Verified it fails when reverted” shows up in my PRs again and again. A test that passes either way proves nothing." },
  { step: "02", title: "Measure before and after", body: "I measured parallel test runs on our 2-core CI runners, found them 24% slower, and reverted. 3.7× and 42 s → 0.3 s are measurements, not vibes." },
  { step: "03", title: "Never fake data", body: "null over 0, “not instrumented” over a made-up number. If a field has no data source, it comes out of the UI." },
  { step: "04", title: "Protect sensitive data by reflex", body: "Transcripts out of the UI, fingerprints out of the audit log, a client's staff roster out of git history." },
  { step: "05", title: "Say what I couldn't verify", body: "“No credentials for stage, please run this audit query.” Plus deploy-order notes wherever merging in the wrong order would break production." },
];

export const roadmap = [
  { n: "01", title: "Go deep on one language", body: "Go, Java or TypeScript. Learn its runtime, concurrency model and standard library before chasing frameworks." },
  { n: "02", title: "Learn SQL like it pays rent", body: "Joins, indexes, transactions, isolation levels. Read EXPLAIN output until it reads like English." },
  { n: "03", title: "Build a real HTTP API", body: "Auth, validation, pagination, error handling, tests. Document it with OpenAPI, then deploy it." },
  { n: "04", title: "Add caching & queues", body: "Redis, BullMQ or SQS. Learn retries, idempotency and what “exactly once” really costs." },
  { n: "05", title: "Ship to the cloud", body: "Docker, a VM or container service, a managed DB, logs and metrics. Then read your first AWS bill." },
  { n: "06", title: "Build a database from scratch", body: "A tiny KV store with a WAL and a TCP server teaches more internals than any course. (That's KO-DB.)" },
];

export const faqs = [
  {
    q: "What roles are you looking for?",
    a: "Senior software engineering roles, backend-heavy or full-stack, where I own services end to end: API design, data modeling, queues, cloud cost and reliability.",
  },
  {
    q: "Have you worked remotely with international teams?",
    a: "Yes. From Jan 2025 to Apr 2026 I worked as a remote contractor for a US company, solo-building the backend of their voice-AI platform.",
  },
  {
    q: "Are you backend-only?",
    a: "Backend is home, but I ship frontends too: React and Next.js on the web and React Native on mobile. The voice-AI platform ran a Next.js frontend on top of my APIs.",
  },
  {
    q: "Have you led or mentored engineers?",
    a: "I'm Project Lead at Proven Solution, leading a 14-person engineering team across Egypt and India. Before that I led the engineering interview process at Botit, wrote the engineering playbook adopted at Solid Ground, wrote the deployment & operations runbook at Proven Solution, and teach Software Component Design and Software Architecture as a TA at AASTMT.",
  },
];

export const credentials: { kind: "award" | "community" | "course"; title: string; issuer: string; date: string; detail: string; url?: string }[] = [
  { kind: "award", title: "1st place, AI 101 contest", issuer: "IEEE AAST Alexandria Student Branch", date: "Nov – Dec 2022", detail: "Won with the project “Gython”" },
  { kind: "community", title: "IEEE volunteer, Technical Committee", issuer: "IEEE AAST Alexandria Student Branch", date: "", detail: "Technical committee volunteer" },
  { kind: "course", title: "Ultimate Design Patterns", issuer: "Udemy · Mahmoud Youssef", date: "Jan 2026", detail: "11 hours", url: "https://ude.my/UC-60ae1887-7bdd-45f8-98cd-87b239dbcb9e" },
  { kind: "course", title: "The Complete 2023 Web Development Bootcamp", issuer: "Udemy · Dr. Angela Yu", date: "Aug 2023", detail: "66 hours", url: "https://ude.my/UC-abbf2837-8fd2-4f22-9e7d-1bc71c2272a4" },
];

// cover: image in /public/books. Without one, the bookshelf draws a typographic cover.
export const books: { title: string; author: string; subtitle?: string; cover?: string; color?: string }[] = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", subtitle: "The big ideas behind reliable, scalable, and maintainable systems", cover: "/books/ddia.jpg" },
  { title: "Software Architecture in Practice", author: "Len Bass, Paul Clements, Rick Kazman", subtitle: "Fourth edition · SEI Series in Software Engineering", cover: "/books/software-architecture-in-practice.jpg" },
  { title: "Clean Architecture", author: "Robert C. Martin", subtitle: "A Craftsman's Guide to Software Structure and Design", cover: "/books/clean-architecture.jpg" },
  { title: "Clean Code", author: "Robert C. Martin", subtitle: "A Handbook of Agile Software Craftsmanship", cover: "/books/clean-code.jpg" },
  { title: "Dive Into Design Patterns", author: "Alexander Shvets", cover: "/books/design-patterns.jpg" },
];

export const recommendations = [
  {
    quote:
      "He could take a loosely defined business need, translate it into a sound technical design, and ship a working solution without losing sight of maintainability or performance.",
    more: [
      "As Team Lead, Ziad set the technical direction for his team and raised the standard of everyone around him.",
      "I recommend Ziad without reservation.",
    ],
    name: "Dr. Youssef",
    title: "Chief Executive Officer & Owner",
    company: "Solid Ground Solutions LLC",
    context: "Platform Engineer & Team Lead · 1 year",
    letter: "/letters/solid-ground-recommendation.pdf",
    image: "/letters/solid-ground-recommendation.jpg",
    thumb: "/letters/solid-ground-recommendation-thumb.jpg",
  },
];

export type AchievementCat = "performance" | "reliability" | "security" | "cloud" | "builds" | "leadership" | "awards";

export const achievementCats: { id: AchievementCat; label: string }[] = [
  { id: "performance", label: "Performance" },
  { id: "reliability", label: "Reliability" },
  { id: "security", label: "Security" },
  { id: "cloud", label: "Cost & cloud" },
  { id: "builds", label: "Built" },
  { id: "leadership", label: "Leadership" },
  { id: "awards", label: "Awards & learning" },
];

// Every achievement in one place. The rest of the page shows only the highlights.
export const achievements: { cat: AchievementCat; value: string; text: string; org: string; top?: boolean }[] = [
  { cat: "performance", value: "115×", text: "faster Order List API by restoring MongoDB index use, with zero schema changes", org: "Nugttah", top: true },
  { cat: "performance", value: "140×", text: "faster transcript rebuild: 42 s → 0.3 s of event-loop time at the 120-chunk cap", org: "Nuxera", top: true },
  { cat: "performance", value: "3.7×", text: "audio pipeline throughput from async ffmpeg and one probe per chunk", org: "Nuxera" },
  { cat: "performance", value: "−98%", text: "memory on a 100,000+ record export pipeline, with no more timeouts", org: "Nugttah" },
  { cat: "performance", value: "−97%", text: "server startup time: async processing, no queue blocking, lost-message handling", org: "Nugttah" },
  { cat: "performance", value: "804 → 1", text: "project loads per save, removing ~1,600 redundant queries and 10K log lines", org: "Proven Solution", top: true },
  { cat: "performance", value: "95% CPU", text: "runaway Outlook sync tamed: server-side filtering, date window, own thread pool", org: "Proven Solution" },
  { cat: "performance", value: "20k+", text: "customer businesses freed from multi-minute stalls by fixing N+1 queries", org: "Proven Solution" },
  { cat: "performance", value: "+30–42%", text: "faster queries on the e-commerce platform", org: "Botit" },
  { cat: "performance", value: "56 MB", text: "dependency re-downloads skipped per build with Docker layer caching", org: "Proven Solution" },
  { cat: "reliability", value: "0 lost", text: "data in an emergency Bahrain → Mumbai infrastructure migration", org: "Nugttah", top: true },
  { cat: "reliability", value: "SEV-1", text: "API-wide outage resolved: memory-starved RDS MySQL traced via CloudTrail and resized", org: "Proven Solution" },
  { cat: "reliability", value: "SEV-2", text: "production RDS outage from leaking stale connections fixed, RDS scaled up", org: "Proven Solution" },
  { cat: "reliability", value: "Flyway", text: "boot check + commit-tagged images so green pipelines can't ship stale code", org: "Proven Solution" },
  { cat: "reliability", value: "Rollback", text: "per-commit releases with automatic rollback", org: "Nuxera" },
  { cat: "reliability", value: "Race", text: "MongoDB replication race conditions resolved with primary–secondary sync", org: "Nugttah" },
  { cat: "performance", value: "14 → 4.2 min", text: "deployment time: parallel Java unit tests and one consolidated build stage", org: "Proven Solution" },
  { cat: "security", value: "4 paths", text: "of privilege escalation closed in role ranking", org: "Nuxera", top: true },
  { cat: "security", value: "Biometrics", text: "unauthenticated voice-verification endpoints locked down; no audio stored", org: "Nuxera" },
  { cat: "security", value: "35 leaks", text: "of Postgres/OpenAI error text to clients stopped with a global error handler", org: "Nuxera" },
  { cat: "security", value: "Auth test", text: "that walks the router and fails on any route without auth", org: "Nuxera" },
  { cat: "security", value: "Timing", text: "oracle on login closed, so it no longer reveals which emails exist", org: "Nuxera" },
  { cat: "security", value: "S3", text: "hole closed that let any logged-in user delete any object", org: "Proven Solution" },
  { cat: "security", value: "Prod ≠ dev", text: "fixed production reading the dev database (hardcoded Spring profile)", org: "Proven Solution" },
  { cat: "security", value: "IAM", text: "leaked AWS key revoked; shared credentials replaced with least-privilege users", org: "Proven Solution" },
  { cat: "security", value: "Cloudflare", text: "incident handled by moving users to internal infrastructure", org: "Nugttah" },
  { cat: "cloud", value: "~$2K/yr", text: "cut from AWS: RDS upgrade, idle EC2s, unused Elastic IPs", org: "Proven Solution", top: true },
  { cat: "cloud", value: "$150/mo", text: "saved by moving UAT RDS off MySQL 8.0 Extended Support, plus $80+/mo more found", org: "Proven Solution" },
  { cat: "cloud", value: "7", text: "CI/CD pipelines built from scratch across two AWS regions", org: "Proven Solution" },
  { cat: "cloud", value: "+45%", text: "faster deployments on GitHub Actions", org: "Botit" },
  { cat: "cloud", value: "Docker", text: "containerized the full backend and frontend", org: "Solid Ground" },
  { cat: "builds", value: "Founder", text: "of a salon & barber booking platform: customer app, partner app, admin panel on AWS + Cloudflare", org: "Own startup" },
  { cat: "builds", value: "tRPC → REST", text: "migrated so the desktop app, extension and other clients can use one API", org: "Nuxera" },
  { cat: "builds", value: "Design system", text: "shared UI components replacing inconsistent AI-generated screens", org: "Nuxera" },
  { cat: "builds", value: "Rule engine", text: "automation on a DB-backed job queue with multithreaded workers, replacing a message broker", org: "Proven Solution" },
  { cat: "builds", value: "1 → 5 repos", text: "monorepo split into per-component repos, each with its own CI/CD pipeline", org: "Proven Solution" },
  { cat: "cloud", value: "~$300/mo", text: "saved by replacing Zapier workflows with an internal tool", org: "Solid Ground" },
  { cat: "security", value: "2 admins", text: "on the AWS account; everyone else on scoped, non-admin access", org: "Proven Solution" },
  { cat: "builds", value: "153", text: "REST APIs solo-built: ~85K lines of TypeScript, 629 commits in 9 months", org: "Solid Ground", top: true },
  { cat: "builds", value: "DRR", text: "fair call dispatcher with Redis + Lua leader election", org: "Solid Ground" },
  { cat: "builds", value: "Stripe", text: "billing end to end: credits, auto-recharge, auto-pause, Twilio provisioning", org: "Solid Ground" },
  { cat: "builds", value: "300", text: "commits across 7 repos of a healthcare AI platform", org: "Nuxera" },
  { cat: "builds", value: "Truth", text: "metric engine where every value is live | partial | proposed, never a fake 0", org: "Nuxera" },
  { cat: "builds", value: "KO-DB", text: "a key-value database from scratch in Go: WAL, TCP layer, sharding", org: "Open source" },
  { cat: "builds", value: "Customs", text: "clearance system for a large Alexandria company (freelance)", org: "Sonbola" },
  { cat: "builds", value: "Shopify", text: "real-time integrations and an APNs/Firebase notification service", org: "Botit" },
  { cat: "builds", value: "Retool → own", text: "replaced Retool with a custom internal dashboard", org: "Botit" },
  { cat: "leadership", value: "14 engineers", text: "led as Project Lead across Egypt and India, across time zones", org: "Proven Solution", top: true },
  { cat: "leadership", value: "Hiring", text: "led the engineering interview process", org: "Botit" },
  { cat: "leadership", value: "Recommended", text: "by the CEO for platform engineering and team leadership (letter on this site)", org: "Solid Ground" },
  { cat: "leadership", value: "Playbook", text: "wrote the engineering playbook adopted across the codebase", org: "Solid Ground" },
  { cat: "leadership", value: "Runbook", text: "wrote the deployment & operations runbook", org: "Proven Solution" },
  { cat: "leadership", value: "TA", text: "teaching Software Component Design and Software Architecture", org: "AASTMT" },
  { cat: "leadership", value: "YouTube", text: "explains database internals with the KO-DB walkthrough", org: "YouTube" },
  { cat: "awards", value: "1st place", text: "IEEE AI 101 contest with the project “Gython” (2022)", org: "IEEE AAST", top: true },
  { cat: "awards", value: "IEEE", text: "volunteer on the Technical Committee", org: "IEEE AAST" },
  { cat: "awards", value: "#3", text: "in cohort: B.Sc. Computer Science, GPA 3.72, Excellent with Honor", org: "AASTMT" },
  { cat: "awards", value: "Udemy", text: "Ultimate Design Patterns certificate (2026)", org: "Udemy" },
  { cat: "awards", value: "Udemy", text: "The Complete Web Development Bootcamp certificate (2023)", org: "Udemy" },
];

export const education = {
  degree: "B.Sc. Computer Science",
  school: "Arab Academy for Science, Technology & Maritime Transport",
  period: "2021 – 2025",
  gpa: "3.72 / 4.0",
  rank: "Ranked 3rd in cohort",
  honor: "Excellent with Honor",
};
