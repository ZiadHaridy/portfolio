"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { incidents } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const sevStyle: Record<string, string> = {
  "SEV-1": "bg-accent text-white",
  "SEV-2": "bg-ink text-card",
  "SEV-3": "bg-paper text-ink ring-1 ring-black/10",
};

// deterministic "uptime" bars with incident days marked
const BARS = Array.from({ length: 64 }, (_, i) => ([9, 22, 31, 40, 47, 58].includes(i) ? (i % 2 ? "inc" : "minor") : "ok"));

const SEV_ORDER: Record<string, number> = { "SEV-1": 0, "SEV-2": 1, "SEV-3": 2 };
const sorted = [...incidents].sort((a, b) => SEV_ORDER[a.sev] - SEV_ORDER[b.sev]);
const INITIAL = 8;

export function Incidents() {
  const [open, setOpen] = useState<string | null>(sorted[0].id);
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? sorted : sorted.slice(0, INITIAL);
  return (
    <section id="incidents" className="px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={5}>Postmortems</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading
          title="The 3am stories."
          muted="Real incidents, handled."
          lead="Anyone can build the happy path. Here's what I did when production caught fire, written as blameless postmortems."
        />
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-5xl">
        <div className="rounded-[28px] bg-card p-5 ring-1 ring-black/5 card-shadow sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-ok" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-ok" />
              </span>
              <span className="text-[17px] font-semibold tracking-tight">All systems operational</span>
            </div>
            <span className="font-mono text-[11.5px] text-mute">{incidents.length} incidents resolved · 0 open</span>
          </div>
          <div className="mt-5 flex h-9 items-end gap-[3px]" aria-hidden>
            {BARS.map((b, i) => (
              <span key={i} className={`flex-1 rounded-[3px] ${b === "ok" ? "h-full bg-ok/70" : b === "inc" ? "h-full bg-accent" : "h-full bg-[#f5b544]"}`} />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10.5px] text-mute">
            <span>2023</span>
            <span>career uptime</span>
            <span>today</span>
          </div>
        </div>

        <ul className="mt-4 space-y-3">
          {list.map((inc) => {
            const isOpen = open === inc.id;
            return (
              <li key={inc.id} className="overflow-hidden rounded-[24px] bg-card ring-1 ring-black/5">
                <button onClick={() => setOpen(isOpen ? null : inc.id)} className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left sm:flex-nowrap sm:px-6" aria-expanded={isOpen}>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold ${sevStyle[inc.sev]}`}>{inc.sev}</span>
                  <span className="hidden font-mono text-[11.5px] text-mute sm:inline">{inc.id}</span>
                  <span className="order-last w-full text-[16px] font-medium tracking-tight sm:order-none sm:w-auto sm:min-w-0 sm:flex-1">{inc.title}</span>
                  <span className="ml-auto font-mono text-[11.5px] text-mute sm:ml-0">{inc.org}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-ok/10 px-2.5 py-1 font-mono text-[10.5px] text-[#15803d]">● resolved</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
                        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                          {inc.timeline.map((t, i) => (
                            <li key={t} className="flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-1 ${i === inc.timeline.length - 1 ? "bg-ink text-card" : "bg-slab text-ink-2"}`}>{t}</span>
                              {i < inc.timeline.length - 1 && <span className="text-mute">→</span>}
                            </li>
                          ))}
                        </ol>
                        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          {[
                            ["What happened", inc.what],
                            ["What I did", inc.action],
                            ["Outcome", inc.result],
                          ].map(([k, v], i) => (
                            <div key={k} className={`rounded-2xl p-4 ${i === 2 ? "bg-ink text-card" : "bg-slab"}`}>
                              <dt className={`font-mono text-[10.5px] uppercase tracking-wider ${i === 2 ? "text-white/50" : "text-mute"}`}>{k}</dt>
                              <dd className={`mt-1.5 text-[14.5px] leading-relaxed ${i === 2 ? "font-medium" : "text-ink-2"}`}>{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        {sorted.length > INITIAL && (
          <div className="mt-4 text-center">
            <button onClick={() => setShowAll((v) => !v)} className="rounded-full bg-card px-5 py-2.5 font-mono text-[12px] text-ink-2 ring-1 ring-black/10 transition hover:text-ink">
              {showAll ? "Show fewer" : `Show ${sorted.length - INITIAL} more incidents`}
            </button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
