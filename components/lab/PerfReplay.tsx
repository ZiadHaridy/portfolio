"use client";
import { useEffect, useRef, useState } from "react";

/** Simulated data, real ratios: replays of two production fixes. */

const DOCS = 240;
const MATCHES = new Set([17, 58, 93, 141, 177, 212, 230]);

function IndexRace() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [scan, setScan] = useState(0); // docs examined by COLLSCAN
  const [ix, setIx] = useState(0);
  const raf = useRef<number>(0);

  const run = () => {
    cancelAnimationFrame(raf.current);
    setPhase("running");
    setScan(0);
    setIx(0);
    const start = performance.now();
    const BEFORE_MS = 4600; // 115 units
    const AFTER_MS = BEFORE_MS / 115; // 1 unit
    const loop = (now: number) => {
      const t = now - start;
      setIx(Math.min(1, t / AFTER_MS));
      setScan(Math.min(1, t / BEFORE_MS));
      if (t < BEFORE_MS) raf.current = requestAnimationFrame(loop);
      else setPhase("done");
    };
    raf.current = requestAnimationFrame(loop);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const scanned = Math.floor(scan * DOCS);
  return (
    <div className="flex h-full flex-col rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Replay · Order List API</p>
          <h4 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Same query. Same data. <span className="text-accent">115× faster.</span>
          </h4>
        </div>
        <button onClick={run} className="shrink-0 rounded-full bg-white px-4 py-1.5 font-mono text-[12px] text-night transition hover:bg-accent hover:text-white">
          {phase === "idle" ? "▶ run" : "↻ rerun"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px]">
        {Array.from({ length: DOCS }).map((_, i) => {
          const isMatch = MATCHES.has(i);
          const scannedNow = i < scanned;
          const ixHit = isMatch && ix >= 1;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[3px] transition-colors duration-150 ${
                ixHit ? "bg-ok" : scannedNow ? (isMatch ? "bg-accent" : "bg-white/35") : "bg-white/[0.07]"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-5 space-y-3 font-mono text-[11.5px]">
        <div>
          <div className="flex justify-between text-white/60">
            <span>
              after · <span className="text-ok">IXSCAN</span> (index restored)
            </span>
            <span className="text-white">{ix >= 1 ? "done ✓ 1×" : phase === "running" ? "…" : "–"}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-ok" style={{ width: `${ix * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-white/60">
            <span>
              before · <span className="text-accent">COLLSCAN</span> (index ignored)
            </span>
            <span className="text-white tabular-nums">{phase === "done" ? "done · 115×" : `${Math.round(scan * 115)}×`}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-accent" style={{ width: `${scan * 100}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-auto pt-4 text-[12.5px] leading-snug text-white/45">
        The queries weren&apos;t using the indexes MongoDB already had. Optimizing them fully restored index utilization, with zero schema changes. (Simulated data, real ratio.)
      </p>
    </div>
  );
}

function MemoryChart() {
  const [p, setP] = useState(0);
  const raf = useRef<number>(0);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const loop = (now: number) => {
      const t = Math.min(1, (now - start) / 3200);
      setP(t);
      if (t < 1) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const W = 320;
  const H = 150;
  const N = 80;
  const buffered = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * W;
    const y = H - 12 - Math.min(1, (i / (N - 1)) * 1.08) * (H - 30);
    return [x, y] as const;
  });
  const streamed = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * W;
    const saw = (i % 8) / 8;
    const y = H - 12 - (0.012 + saw * 0.012) * (H - 30) * 1.0;
    return [x, y] as const;
  });
  const cut = Math.max(2, Math.floor(p * N));
  const path = (pts: readonly (readonly [number, number])[]) => pts.slice(0, cut).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const oom = p > 0.9;

  return (
    <div className="flex h-full flex-col rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Replay · 100,000+ row export</p>
          <h4 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Same export, re-architected. <span className="text-ok">−98% memory.</span>
          </h4>
        </div>
        <button onClick={run} className="shrink-0 rounded-full bg-white px-4 py-1.5 font-mono text-[12px] text-night transition hover:bg-accent hover:text-white">
          {p === 0 ? "▶ run" : "↻ rerun"}
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full" role="img" aria-label="Memory usage: buffered export climbs to the limit, streamed export stays flat">
        <line x1="0" x2={W} y1="14" y2="14" stroke="#ff5a1f" strokeDasharray="4 4" strokeOpacity=".7" />
        <text x={W - 4} y="9" textAnchor="end" fill="#ff5a1f" fontSize="7" className="font-mono">memory limit / timeout</text>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="white" strokeOpacity=".05" />
        ))}
        <path d={path(buffered)} fill="none" stroke="#ff5a1f" strokeWidth="2.5" strokeLinecap="round" />
        <path d={path(streamed)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        {oom && (
          <g>
            <circle cx={buffered[N - 1][0] - 4} cy={buffered[N - 1][1]} r="5" fill="#ff5a1f" />
            <text x="6" y="30" fill="#fbfbfa" fontSize="8" className="font-mono">💥 before: timed out</text>
          </g>
        )}
      </svg>
      <div className="mt-3 flex gap-4 font-mono text-[11px] text-white/60">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />before: memory grows with rows</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ok" />after: flat, no timeouts</span>
      </div>
      <p className="mt-auto pt-4 text-[12.5px] leading-snug text-white/45">
        Illustration: the old pipeline grew with every row until it timed out. The new one handles 100,000+ records with flat memory and correct Arabic text.
      </p>
    </div>
  );
}

export function PerfReplay() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <IndexRace />
      <MemoryChart />
    </div>
  );
}
