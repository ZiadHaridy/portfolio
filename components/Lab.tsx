"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Dispatcher } from "./lab/Dispatcher";
import { KoDb } from "./lab/KoDb";
import { PerfReplay } from "./lab/PerfReplay";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const TABS = [
  { id: "dispatcher", label: "Fair call dispatcher", sub: "DRR · Redis · Lua", el: <Dispatcher /> },
  { id: "kodb", label: "KO-DB shell", sub: "WAL · shards · recovery", el: <KoDb /> },
  { id: "perf", label: "Performance replays", sub: "115× · −98%", el: <PerfReplay /> },
];

export function Lab() {
  const [tab, setTab] = useState(TABS[0].id);
  const active = TABS.find((t) => t.id === tab)!;
  return (
    <section id="lab" className="slab relative overflow-hidden bg-night px-4 py-20 text-white sm:px-10 sm:py-24 lg:px-14">
      <div className="dot-grid-night pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
      <div className="relative">
        <SectionLabel tone="dark">Systems lab</SectionLabel>
        <Reveal className="mt-12">
          <SectionHeading
            tone="dark"
            title="Don't take my word for it."
            muted="Run it."
            lead="Interactive toy versions of systems I've built in production. Break them, crash them, switch the algorithm and watch what happens."
          />
        </Reveal>

        <div className="no-scrollbar mx-auto mt-12 flex max-w-3xl gap-2 overflow-x-auto rounded-full bg-night-2 p-1.5 ring-1 ring-night-line" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-left transition sm:text-center ${tab === t.id ? "text-night" : "text-white/60 hover:text-white"}`}
            >
              {tab === t.id && <motion.span layoutId="lab-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", bounce: 0.18, duration: 0.5 }} />}
              <span className="relative block text-[13.5px] font-medium">{t.label}</span>
              <span className={`relative block font-mono text-[10.5px] ${tab === t.id ? "text-night/50" : "text-white/35"}`}>{t.sub}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} role="tabpanel">
              {active.el}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
