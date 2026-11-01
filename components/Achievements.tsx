"use client";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { achievementCats, achievements, type AchievementCat } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const INITIAL = 9;
/** Phones get a shorter first screen; the rest is one tap away. */
const INITIAL_MOBILE = 6;
const COMPANIES = ["Nugttah", "Nuxera", "Proven Solution", "Solid Ground", "Botit", "Sonbola"];

export function Achievements() {
  const [cat, setCat] = useState<AchievementCat | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const counts = useMemo(() => Object.fromEntries(achievementCats.map((c) => [c.id, achievements.filter((a) => a.cat === c.id).length])), []);
  const companies = COMPANIES.filter((c) => achievements.some((a) => a.org === c)).length;
  const list = cat === "all" ? [...achievements].sort((a, b) => Number(!!b.top) - Number(!!a.top)) : achievements.filter((a) => a.cat === cat);
  const visible = cat === "all" && !expanded ? list.slice(0, INITIAL) : list;

  const chip = (id: AchievementCat | "all", label: string, n: number) => (
    <button
      key={id}
      onClick={() => { setCat(id); setExpanded(false); }}
      aria-pressed={cat === id}
      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition ${cat === id ? "bg-ink text-card" : "bg-slab text-ink-2 hover:text-ink"}`}
    >
      {label}
      <span className={`rounded-full px-1.5 font-mono text-[10.5px] ${cat === id ? "bg-white/15 text-white" : "bg-card text-mute"}`}>{n}</span>
    </button>
  );

  return (
    <section id="achievements" className="slab bg-card px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={-4}>Achievements</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading title="Every win," muted="in one place." lead={`${achievements.length} achievements from ${companies} companies, plus open source, teaching and awards. Filter by what you care about.`} />
      </Reveal>

      <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {chip("all", "All", achievements.length)}
        {achievementCats.map((c) => chip(c.id, c.label, counts[c.id]))}
      </div>

      <motion.ul layout className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((a, i) => (
            <motion.li
              layout
              key={a.cat + a.value + a.text}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`group flex flex-col rounded-[20px] bg-slab p-4 ring-1 ring-black/[0.04] transition hover:bg-paper/70 sm:rounded-[22px] sm:p-5 ${cat === "all" && !expanded && i >= INITIAL_MOBILE ? "max-sm:hidden" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[22px] font-semibold sm:text-[26px] leading-none tracking-[-0.04em] text-ink">{a.value}</span>
                <span className="mt-1 shrink-0 rounded-full bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-mute ring-1 ring-black/5">{a.org}</span>
              </div>
              <p className="mt-2 text-pretty text-[13.5px] sm:mt-3 sm:text-[14px] leading-snug text-ink-2/85">{a.text}</p>
              <span className="mt-auto hidden pt-4 font-mono text-[10.5px] sm:block uppercase tracking-wider text-accent">{achievementCats.find((c) => c.id === a.cat)?.label}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {cat === "all" && list.length > INITIAL && (
        <div className="mt-6 text-center">
          <button onClick={() => setExpanded((v) => !v)} className="rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-card transition hover:bg-accent">
            {expanded ? "Show fewer" : `Show all ${list.length} achievements`}
          </button>
        </div>
      )}
    </section>
  );
}
