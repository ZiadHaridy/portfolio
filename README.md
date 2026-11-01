# Ziad Ahmed — Portfolio

A portfolio for a senior backend engineer: it shows the work running instead of just describing it.

**Stack:** Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Geist / Geist Mono

## What's inside

| Section | Hook |
| --- | --- |
| **Hero** | Rotating headline, "Open to work", and a **live distributed-trace waterfall** (`GET /v1/engineers/ziad-ahmed`) |
| **"Who's reading?" lens** | Recruiter / Engineer / Student buttons. Each one shows a tailored panel (30-sec summary + CV, systems-lab pointer, student corner), and the trace's `role=` changes with it |
| **Benchmarks** | Count-up production metrics: 115×, −98%, −97%, ~$2K/yr, 153 APIs, +45% |
| **About (bento)** | Experience timeline, live local time (Egypt), education, AI workflow, YouTube, "How I work" stepper |
| **Systems Lab** | Interactive demos: **Deficit Round Robin vs FIFO call dispatcher** with **Redis/Lua leader election** (kill the leader), a **KO-DB shell** (SET/GET/DEL, CRASH → WAL replay, sharding), and **performance replays** (COLLSCAN vs IXSCAN race, buffered vs re-architected export memory) |
| **Selected work** | Accordion case studies with animated architecture sketches |
| **Postmortems** | Status-page style incident history (region evacuation, leaked key, RDS outage…) |
| **Stack / Student corner / FAQ / Contact** | Filterable skills, a backend roadmap, recruiter FAQ, Email / WhatsApp / LinkedIn |
| **Extras** | `⌘K` command palette, floating nav, a real static API at **`/api/profile.json`**, a devtools console greeting, JSON-LD for SEO, an Open Graph share image (`public/og.png`), `prefers-reduced-motion` support |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Edit the content

Everything lives in **`content/profile.ts`**: copy, metrics, experience, projects, incidents, stack and FAQ. `/api/profile.json` is generated from the same file.

- **Photo:** drop a square image at `public/ziad.jpg` and set `photo: "/ziad.jpg"` in `content/profile.ts`. Until then the hero shows a "ZA." monogram.
- **CV:** replace `public/Ziad_Ahmed_CV.pdf`.
- **Domain:** the site is set up for **https://ziad-dev.com** (`metadataBase` in `app/layout.tsx`, used for canonical and OG/Twitter cards).

## Deploy

It's a fully static export (`out/`), so any static host works.

### Cloudflare Pages (domain is on Cloudflare)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the repo.
3. Build settings: framework preset **Next.js (Static HTML Export)** (or *None*), build command `npm run build`, output directory `out`. Add the environment variable `NODE_VERSION` = `22`.
4. **Save and Deploy** → you get a `*.pages.dev` URL.
5. Project → **Custom domains** → add `ziad-dev.com`, then `www.ziad-dev.com`. Cloudflare creates the DNS records and the HTTPS certificate automatically.

Every push to `main` redeploys.

### Vercel / Netlify

- **Vercel:** import the repo (no config). If the domain stays on Cloudflare DNS, add the records Vercel shows with the proxy **off** (grey cloud).
- **Netlify:** build `npm run build`, publish `out`.

## Design

The Figma file **portfolio** has matching foundations (color variables, Geist text styles, components) plus Desktop 1440 and Mobile 390 pages.

## Screenshots

![Hero](docs/hero.png)
![Systems Lab](docs/systems-lab.png)
