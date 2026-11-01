"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { lenses, profile, type Lens } from "@/content/profile";
import { CopyButton } from "./ui/CopyButton";
import { TraceCard } from "./TraceCard";
import { useLens } from "./LensContext";
import { Logo } from "./ui/Logo";

function Avatar({ size = 64 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // the image may have failed before hydration, when onError wasn't attached yet
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const showPhoto = profile.photo && !failed;
  return (
    <span
      className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] bg-ink align-middle shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] ring-4 ring-card"
      style={{ width: size, height: size }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={profile.photo!}
          alt={profile.name}
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-[50%_22%] grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
      ) : (
        <span className="font-mono font-semibold tracking-tight text-card" style={{ fontSize: size * 0.34 }}>
          {profile.initials}
          <span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
}

function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % profile.rotatingWords.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {/* reserve width for the longest word */}
      <span className="invisible col-start-1 row-start-1">go 115× faster.</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={profile.rotatingWords[i]}
          className="col-start-1 row-start-1 text-accent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.rotatingWords[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function OpenToWork() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-sm font-medium text-ink ring-1 ring-black/5 card-shadow">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-ok" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
      </span>
      Open to work
    </span>
  );
}

function LensButtons() {
  const { lens, setLens } = useLens();
  const order: Lens[] = ["recruiter", "engineer", "student"];
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 font-mono text-xs uppercase tracking-[0.16em] text-mute">Who&apos;s reading?</span>
      {order.map((l) => {
        const on = lens === l;
        return (
          <button
            key={l}
            onClick={() => setLens(on ? null : l)}
            aria-pressed={on}
            className={`group relative rounded-full px-4 py-2 text-sm font-medium transition ${
              on ? "bg-ink text-card" : "bg-card text-ink ring-1 ring-black/5 card-shadow hover:-translate-y-px"
            }`}
          >
            <span className="mr-1.5">{lenses[l].emoji}</span>
            {lenses[l].label}
          </button>
        );
      })}
    </div>
  );
}

function LensPanel() {
  const { lens } = useLens();
  const active = lens ? lenses[lens] : null;
  return (
    <AnimatePresence mode="wait">
      {active && lens && (
        <motion.div
          key={lens}
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-8 grid grid-cols-1 gap-6 rounded-[28px] bg-card p-6 ring-1 ring-black/5 card-shadow sm:p-8 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">for {active.label.toLowerCase()}s</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{active.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-ink-2/80">{active.lead}</p>
              <a
                href={active.cta.href}
                {...(active.cta.href.endsWith(".pdf") ? { download: true } : {})}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-card transition hover:bg-accent"
              >
                {active.cta.label} <span aria-hidden>↗</span>
              </a>
            </div>
            <ul className="space-y-3 self-center">
              {active.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] leading-snug text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section id="top" className="slab relative overflow-hidden bg-slab px-5 pb-12 pt-5 sm:px-10 sm:pb-16 lg:px-14">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_80%_20%,black,transparent)]" />

      {/* top bar (ref: email · Copy · CV  …  socials) */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#top" className="mr-1 text-ink transition hover:opacity-80" aria-label="Home">
            <Logo className="h-6 w-auto" />
          </a>
          <a href={`mailto:${profile.email}`} className="hidden text-[13px] text-ink-2 underline decoration-line underline-offset-4 hover:decoration-accent md:inline">
            {profile.email.toLowerCase()}
          </a>
          <CopyButton value={profile.email} label="Copy email" />
          <a href={profile.cv} download className="rounded-full bg-card px-4 py-2 text-xs font-medium ring-1 ring-black/5 card-shadow transition hover:-translate-y-px">
            CV ↓
          </a>
        </div>
        <nav className="flex items-center gap-1 text-[13px] text-ink-2">
          <a className="rounded-full px-2.5 py-1 hover:text-accent" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
          <span className="text-line">/</span>
          <a className="rounded-full px-2.5 py-1 hover:text-accent" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <span className="text-line">/</span>
          <a className="rounded-full px-2.5 py-1 hover:text-accent" href={profile.links.youtube} target="_blank" rel="noreferrer">YouTube</a>
        </nav>
      </div>

      <div className="relative mt-14 sm:mt-20">
        <motion.h1 {...fade(0.05)} className="text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[1.0] tracking-[-0.045em]">
          <span className="flex flex-wrap items-center gap-x-[0.22em] gap-y-2">
            Hi, I&apos;m
            <span className="relative inline-flex">
              <Avatar size={84} />
              <span className="absolute -right-20 -top-6 rotate-[8deg] whitespace-nowrap rounded-full bg-card px-3 py-1 text-[12px] font-medium tracking-normal ring-1 ring-black/5 card-shadow max-sm:hidden">
                that&apos;s me 👋
              </span>
            </span>
            {profile.name}.
          </span>
          <span className="mt-1 block text-mute">I build systems that</span>
          <RotatingWord />
        </motion.h1>
      </div>

      <div className="relative mt-10 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="space-y-8">
          <motion.div {...fade(0.2)} className="flex flex-wrap items-center gap-3">
            <OpenToWork />
            <span className="rounded-full bg-card px-3.5 py-1.5 font-mono text-[12px] text-ink-2 ring-1 ring-black/5">{profile.role} · 5+ yrs</span>
          </motion.div>
          <motion.div {...fade(0.3)} className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <a
              href={`mailto:${profile.email}?subject=Let's%20talk%20backend`}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-ink px-7 py-4 text-[17px] font-medium text-card transition hover:bg-accent"
            >
              Let&apos;s talk <span aria-hidden>↗</span>
            </a>
            <p className="max-w-md text-pretty text-[15px] leading-relaxed text-ink-2/80">
              Node.js · Go · Java/Spring Boot on PostgreSQL, MongoDB &amp; Redis, running on AWS. And yes, I ship <span className="text-ink">React, Next.js &amp; React Native</span> too.
            </p>
          </motion.div>
          <motion.div {...fade(0.4)}>
            <LensButtons />
          </motion.div>
        </div>

        <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 30, rotate: 2 }, animate: { opacity: 1, y: 0, rotate: 0 }, transition: { duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] } })}>
          <TraceCard />
        </motion.div>
      </div>

      <div className="relative">
        <LensPanel />
      </div>
    </section>
  );
}
