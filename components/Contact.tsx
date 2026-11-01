"use client";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { CopyButton } from "./ui/CopyButton";
import { Reveal } from "./ui/Reveal";
import { Logo } from "./ui/Logo";

function LoadTime() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav && nav.domContentLoadedEventEnd > 0) setMs(Math.round(nav.domContentLoadedEventEnd));
      else setMs(Math.round(performance.now()));
    };
    if (document.readyState === "complete") read();
    else window.addEventListener("load", read, { once: true });
  }, []);
  return <span className="tabular-nums">{ms === null ? "…" : `${ms}ms`}</span>;
}

export function Contact() {
  return (
    <section id="contact" className="slab relative overflow-hidden bg-card px-5 pb-8 pt-20 sm:px-10 sm:pt-28 lg:px-14">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_30%,black,transparent)]" />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slab text-5xl ring-1 ring-black/5">🤝</div>
        <h2 className="mt-8 text-balance text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1] tracking-[-0.045em]">
          Tell me about <span className="text-mute">your next</span> system.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2/75">
          Hiring for a senior engineering role, need a platform rescued, or just want to talk databases? My inbox is open.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[16px] font-medium text-card transition hover:bg-accent">
            ✉ Email me
          </a>
          <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-card px-7 py-4 text-[16px] font-medium ring-1 ring-black/10 card-shadow transition hover:-translate-y-px">
            WhatsApp
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-card px-7 py-4 text-[16px] font-medium ring-1 ring-black/10 card-shadow transition hover:-translate-y-px">
            LinkedIn
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-[14px] text-ink-2">
          <span className="font-mono">{profile.email.toLowerCase()}</span>
          <CopyButton value={profile.email} />
        </div>
      </Reveal>

      <div className="relative mt-24 select-none overflow-hidden whitespace-nowrap text-center text-[min(13vw,11.5rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-ink/[0.06]" aria-hidden>
        Ziad Ahmed
      </div>

      <footer className="relative mt-6 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[11.5px] text-mute sm:flex-row">
        <span className="flex items-center gap-2.5">
          <Logo className="h-4 w-auto text-ink" />© {new Date().getFullYear()} {profile.name} · Built with Next.js
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ok" /> page served in <LoadTime /> · status: operational
        </span>
        <a href="/api/profile.json" className="hover:text-accent">
          GET /api/profile.json ↗
        </a>
      </footer>
    </section>
  );
}
