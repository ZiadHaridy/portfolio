"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLens } from "./LensContext";

type Span = { name: string; detail?: string; start: number; dur: number; tone?: "accent" | "ok" | "ink" };

function buildSpans(role: string, jitter: () => number): Span[] {
  const auth = 2 + jitter();
  const cache = 1;
  const pg = 8 + jitter() * 2;
  const mongo = 6 + jitter() * 2;
  const q = 2 + jitter();
  const res = 1;
  let t = 0;
  const s: Span[] = [];
  s.push({ name: "auth.verify", detail: `role=${role}`, start: t, dur: auth, tone: "ink" });
  t += auth;
  s.push({ name: "cache.get", detail: '"experience" HIT', start: t, dur: cache, tone: "ok" });
  t += cache;
  s.push({ name: "postgres.query", detail: "projects", start: t, dur: pg, tone: "ink" });
  s.push({ name: "mongo.aggregate", detail: "impact", start: t + 1, dur: mongo, tone: "ink" }); // parallel
  t += Math.max(pg, mongo + 1);
  s.push({ name: "queue.publish", detail: '"interview.requested"', start: t, dur: q, tone: "accent" });
  t += q;
  s.push({ name: "respond", detail: "{ open_to_work: true }", start: t, dur: res, tone: "ok" });
  return s;
}

export function TraceCard() {
  const { lens } = useLens();
  const role = lens ?? "visitor";
  const reduce = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  const spans = useMemo(() => {
    // deterministic-ish jitter per cycle (no hydration mismatch on first render)
    let seed = cycle * 9301 + 49297;
    const jitter = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return Math.round((seed / 233280) * 2);
    };
    return buildSpans(role, jitter);
  }, [cycle, role]);
  const total = Math.max(...spans.map((s) => s.start + s.dur));

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCycle((c) => c + 1), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-night p-5 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/5 sm:p-6">
      <div className="dot-grid-night pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <div className="flex items-center justify-between font-mono text-[11px] text-white/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            live trace
          </div>
          <span>trace_id: 7f3a…{(cycle % 90) + 10}e</span>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3 font-mono text-[13px]">
          <span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-white/80">GET</span>{" "}
            <span className="text-white">/v1/engineers/</span>
            <span className="text-accent">ziad-ahmed</span>
          </span>
          <motion.span key={`s-${cycle}`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.6 }} className="text-[12px] text-ok">
            200 OK · {total}ms
          </motion.span>
        </div>

        <ul className="mt-3 space-y-2.5 font-mono text-[11.5px]">
          {spans.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_2.5rem] items-center gap-3">
              <span className="truncate text-white/80">
                <span className="text-white/30">{i === spans.length - 1 ? "└─" : "├─"} </span>
                {s.name}
                <span className="text-white/40"> {s.detail}</span>
              </span>
              <span className="relative h-2 rounded-full bg-white/[0.06]">
                <motion.span
                  key={`${cycle}-${s.name}`}
                  className={`absolute top-0 h-2 rounded-full ${s.tone === "accent" ? "bg-accent" : s.tone === "ok" ? "bg-ok" : "bg-white/80"}`}
                  style={{ left: `${(s.start / total) * 100}%` }}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${Math.max((s.dur / total) * 100, 3)}%` }}
                  transition={{ delay: reduce ? 0 : 0.15 + (s.start / total) * 1.3, duration: 0.35, ease: "easeOut" }}
                />
              </span>
              <span className="text-right text-white/50 tabular-nums">{s.dur}ms</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10.5px] text-white/40">
          <span>p99 &lt; 50ms · error rate 0.00%</span>
          <span className="hidden sm:inline">region: anywhere · remote</span>
        </div>
      </div>
    </div>
  );
}
