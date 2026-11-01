"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { education, experience, howIWork, profile } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="absolute left-5 top-5 z-10 rounded-full bg-card px-3 py-1 text-[12px] font-medium ring-1 ring-black/5 card-shadow">{children}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative h-full overflow-hidden rounded-[28px] bg-card ring-1 ring-black/[0.05] card-shadow ${className}`}>{children}</div>;
}

function LocalTime() {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now}</span>;
}

function ExperienceCard() {
  return (
    <Card className="p-5 pt-16">
      <Tag>My experience</Tag>
      <ol className="relative ml-1.5 space-y-5 border-l border-dashed border-line pl-6">
        {experience.map((e, i) => (
          <li key={e.company + e.role} className="relative">
            <span className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-card ${i === 0 ? "bg-accent" : "bg-ink"}`} />
            <div className="text-[15px] font-medium leading-tight">
              {e.role} <span className="text-mute">at</span> {e.company}
            </div>
            <div className="mt-0.5 font-mono text-[11.5px] text-mute">
              {[e.period, e.type].filter(Boolean).join(" · ")}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function MapCard() {
  return (
    <Card className="flex flex-col">
      <Tag>Based in</Tag>
      <div className="dot-grid relative flex-1 [mask-image:radial-gradient(80%_80%_at_50%_45%,black,transparent)]">
        {/* abstract Nile + pin */}
        <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M120 140 C 118 118, 126 104, 116 88 S 104 60, 112 44 S 124 22, 108 0" fill="none" stroke="#111110" strokeOpacity=".18" strokeWidth="2" />
          <path d="M112 44 C 100 36, 92 30, 84 22 M112 44 C 120 34, 132 30, 140 22" fill="none" stroke="#111110" strokeOpacity=".12" strokeWidth="1.5" />
        </svg>
        <span className="absolute left-[54%] top-[34%]">
          <span className="relative flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-card" />
          </span>
        </span>
      </div>
      <div className="px-5 pb-5 text-center">
        <div className="text-[28px] font-light uppercase tracking-[0.42em] text-ink">Egypt</div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
          local time <LocalTime /> · remote-ready
        </div>
      </div>
    </Card>
  );
}

function EducationCard() {
  return (
    <Card className="flex flex-col justify-between p-5 pt-16">
      <Tag>Education</Tag>
      <div>
        <div className="text-[15px] font-medium leading-snug">{education.degree}</div>
        <div className="mt-1 text-[13px] leading-snug text-mute">{education.school}</div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-slab p-3">
          <div className="text-2xl font-semibold tracking-tight">3.72</div>
          <div className="font-mono text-[10.5px] uppercase tracking-wide text-mute">GPA / 4.0</div>
        </div>
        <div className="rounded-2xl bg-slab p-3">
          <div className="text-2xl font-semibold tracking-tight">#3</div>
          <div className="font-mono text-[10.5px] uppercase tracking-wide text-mute">in cohort</div>
        </div>
      </div>
      <div className="mt-2 rounded-2xl bg-accent-soft px-3 py-2 text-center text-[12.5px] font-medium text-accent">{education.honor}</div>
    </Card>
  );
}

function AiCard() {
  return (
    <Card className="bg-night p-5 pt-16 text-white ring-white/5">
      <span className="absolute left-5 top-5 z-10 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/90 ring-1 ring-white/10">My daily toolkit</span>
      <div className="font-mono text-[12.5px] leading-relaxed text-white/70">
        <div>
          <span className="text-accent">$</span> claude <span className="text-white/40">--mcp --agents</span>
        </div>
        <div className="text-white/40">› drafting migration plan…</div>
        <div className="text-white/40">› writing tests first…</div>
        <div>
          <span className="text-ok">✓</span> human review: <span className="text-white">required</span>
        </div>
        <div>
          <span className="text-ok">✓</span> ship <span className="animate-blink">▍</span>
        </div>
      </div>
      <p className="mt-4 text-[13.5px] leading-snug text-white/60">Claude Code, MCP and agent harnesses daily, to ship faster. Every change is reviewed by a human.</p>
    </Card>
  );
}

function HowIWorkCard() {
  const [i, setI] = useState(0);
  const step = howIWork[i];
  return (
    <Card className="flex flex-col p-5 pt-16">
      <Tag>How I work</Tag>
      <div className="relative min-h-[120px] flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={step.step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="text-xl font-semibold tracking-tight">
              <span className="text-mute">{step.step}</span> {step.title}
            </div>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2/80">{step.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="no-scrollbar mt-5 flex gap-1 overflow-x-auto rounded-full bg-slab p-1">
        {howIWork.map((s, idx) => (
          <button
            key={s.step}
            onClick={() => setI(idx)}
            className={`relative flex-1 whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] font-medium transition ${idx === i ? "text-card" : "text-ink-2 hover:text-ink"}`}
          >
            {idx === i && <motion.span layoutId="how-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
            <span className="relative">Step {s.step}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function YouTubeCard() {
  return (
    <a href={profile.links.youtube} target="_blank" rel="noreferrer" className="group block h-full">
      <Card className="flex flex-col p-5 pt-16 transition group-hover:-translate-y-0.5">
        <Tag>I teach on YouTube</Tag>
        <div className="relative flex flex-1 items-center justify-center rounded-2xl bg-ink p-5 text-card">
          <div className="text-center font-mono">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">walkthrough</div>
            <div className="mt-1 text-2xl font-bold tracking-tight">
              KO<span className="text-accent">-</span>DB
            </div>
            <div className="mt-1 text-[11px] text-white/50">a database from scratch in Go</div>
          </div>
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition group-hover:scale-110">▶</span>
        </div>
        <div className="mt-3 text-[13px] text-mute">Storage engine · WAL · TCP · sharding ↗</div>
      </Card>
    </a>
  );
}

export function Bento() {
  return (
    <section id="about" className="px-5 py-20 sm:px-10 lg:px-14">
      <SectionLabel tilt={4}>About</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading
          title="I collaborate with teams to build"
          muted="systems that stay boring in production."
          lead="Boring is the goal: predictable latency, readable code, and an AWS bill nobody panics about."
        />
      </Reveal>
      <div className="mt-14 grid grid-cols-1 auto-rows-[minmax(250px,auto)] gap-3 md:grid-cols-6">
        <Reveal className="md:col-span-2 md:row-span-2"><ExperienceCard /></Reveal>
        <Reveal className="md:col-span-2" delay={0.05}><MapCard /></Reveal>
        <Reveal className="md:col-span-2" delay={0.1}><EducationCard /></Reveal>
        <Reveal className="md:col-span-2" delay={0.1}><AiCard /></Reveal>
        <Reveal className="md:col-span-2" delay={0.15}><YouTubeCard /></Reveal>
        <Reveal className="md:col-span-6" delay={0.1}><HowIWorkCard /></Reveal>
      </div>
    </section>
  );
}
