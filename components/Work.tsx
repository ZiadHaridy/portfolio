"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { work } from "@/content/profile";
import { ProjectDiagram } from "./Diagrams";
import { TechChip } from "./ui/TechChip";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

export function Work() {
  const featured = work.filter((w) => "featured" in w && w.featured);
  const [open, setOpen] = useState<string | null>(featured[0]?.id ?? null);
  const infra = featured.find((w) => "architecture" in w && w.architecture);

  // ziad-dev.com/#infra opens the project with the production architecture and scrolls to it.
  useEffect(() => {
    if (!infra) return;
    const show = () => {
      if (window.location.hash !== "#infra") return;
      setOpen(infra.id);
      setTimeout(() => document.getElementById(`project-${infra.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 650);
    };
    show();
    window.addEventListener("hashchange", show);
    return () => window.removeEventListener("hashchange", show);
  }, [infra]);
  return (
    <section id="work" className="slab bg-slab px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={-4}>Selected work</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading title={`${["", "One system", "Two systems", "Three systems", "Four systems", "Five systems", "Six systems"][featured.length] ?? featured.length + " systems"},`} muted="the best of what I've shipped." lead={
            <>
              The rest of the wins are in Achievements below.{" "}
              {infra && (
                <a href="#infra" onClick={() => { if (window.location.hash === "#infra") window.dispatchEvent(new HashChangeEvent("hashchange")); }} className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent">
                  See the AWS infrastructure I designed →
                </a>
              )}
            </>
          } />
      </Reveal>

      <div className="mt-14 divide-y divide-line border-y border-line">
        {featured.map((w, idx) => {
          const num = String(idx + 1).padStart(2, "0");
          const isOpen = open === w.id;
          return (
            <Reveal key={w.id}>
              <article id={`project-${w.id}`} className="scroll-mt-24 py-7 sm:py-8">
                <button onClick={() => setOpen(isOpen ? null : w.id)} className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-4 text-left sm:grid-cols-[4rem_1.3fr_1fr_auto] sm:gap-6" aria-expanded={isOpen}>
                  <span className="pt-1.5 font-mono text-[12px] text-mute">[{num}]</span>
                  <span>
                    <span className="block text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em] transition group-hover:text-accent">{w.title}</span>
                    <span className="mt-1 block font-mono text-[12px] text-mute">
                      {[w.company, w.period].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="hidden flex-wrap gap-1.5 pt-1 sm:flex">
                    {w.stats.map((s) => (
                      <span key={s.k} className="rounded-full bg-card px-3 py-1 text-[12px] ring-1 ring-black/5">
                        <span className="font-semibold">{s.v}</span> <span className="text-mute">{s.k}</span>
                      </span>
                    ))}
                  </span>
                  <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-card text-lg ring-1 ring-black/5 transition ${isOpen ? "rotate-45 bg-ink text-card" : ""}`}>+</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="grid grid-cols-1 gap-6 pt-7 sm:pl-[5.5rem] lg:grid-cols-[1.25fr_1fr]">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{w.kicker}</p>
                          <p className="mt-2 text-pretty text-[17px] leading-relaxed text-ink-2">{w.summary}</p>
                          <ul className="mt-5 space-y-3">
                            {w.bullets.map((b) => (
                              <li key={b} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2/85">
                                <span className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-accent" />
                                {b}
                              </li>
                            ))}
                          </ul>
                          {w.integrations.length > 0 && (
                            <p className="mt-5 text-[13px] text-mute">
                              <span className="font-mono uppercase tracking-wider">Integrations:</span> {w.integrations.join(" · ")}
                            </p>
                          )}
                          {"links" in w && w.links && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {w.links.map((l) => (
                                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-card transition hover:bg-accent">
                                  {l.label} ↗
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="dot-grid aspect-[16/9] rounded-[24px] bg-card p-3 ring-1 ring-black/5 card-shadow">
                            <ProjectDiagram kind={w.diagram} />
                          </div>
                          <div className="grid grid-cols-4 gap-2 sm:hidden">
                            {w.stats.map((s) => (
                              <div key={s.k} className="rounded-2xl bg-card p-2 text-center ring-1 ring-black/5">
                                <div className="text-sm font-semibold">{s.v}</div>
                                <div className="text-[10px] text-mute">{s.k}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {w.stack.map((s) => (
                              <TechChip key={s} label={s} className="bg-paper px-3 py-1 font-mono text-[11.5px] text-ink-2" />
                            ))}
                          </div>
                        </div>
                      </div>
                      {"architecture" in w && w.architecture && (
                        <figure className="mt-8 sm:ml-[5.5rem]">
                          <div className="flex items-center justify-between gap-3">
                            <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Production architecture · sanitized</figcaption>
                            <a href={w.architecture.full} target="_blank" rel="noreferrer" className="rounded-full bg-slab px-3 py-1.5 text-[12px] font-medium text-ink ring-1 ring-black/5 transition hover:bg-paper">
                              Open full size ↗
                            </a>
                          </div>
                          <a href={w.architecture.full} target="_blank" rel="noreferrer" className="mt-3 block overflow-x-auto rounded-[20px] bg-card ring-1 ring-black/5 card-shadow">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={w.architecture.src} alt={w.architecture.alt} width={1600} height={1010} loading="lazy" className="h-auto w-full min-w-[720px]" />
                          </a>
                          <p className="mt-3 text-[13px] leading-relaxed text-mute">
                            Cloudflare answers DNS for the API and media subdomains without proxying them, so the apps talk straight to AWS. Domains, IPs and resource names are removed.
                          </p>
                        </figure>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
