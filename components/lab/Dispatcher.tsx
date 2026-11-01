"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Toy model of the call dispatcher I built: per-tenant queues served with
 * Deficit Round Robin + per-tenant concurrency caps, vs a naive global FIFO.
 * 1 tick = 1 simulated second.
 */

type Mode = "fifo" | "drr";
type Call = { tenant: number; arrived: number; dur: number };
type Slot = { tenant: number; left: number } | null;

const TENANTS = [
  { name: "Acme Corp", desc: "bulk campaign", color: "#ff5a1f", rate: 0.95 },
  { name: "Bloom Dental", desc: "small office", color: "#fbfbfa", rate: 0.15 },
  { name: "Cedar Realty", desc: "small team", color: "#22c55e", rate: 0.1 },
];
const WORKERS = 8;
const QUANTUM = 1;

function makeSim() {
  // Acme just launched a campaign: 36 calls already queued at t=0
  const backlog: Call[] = Array.from({ length: 36 }, (_, i) => ({ tenant: 0, arrived: 0, dur: 8 + (i % 7) }));
  return {
    t: 0,
    fifo: [...backlog] as Call[],
    queues: [[...backlog], [], []] as Call[][],
    slots: Array<Slot>(WORKERS).fill(null),
    deficit: [0, 0, 0],
    rr: 0,
    waitEma: [0, 0, 0],
    served: [0, 0, 0],
    seed: 42,
  };
}
type Sim = ReturnType<typeof makeSim>;

function rand(s: Sim) {
  s.seed = (s.seed * 1103515245 + 12345) % 2147483648;
  return s.seed / 2147483648;
}

function step(s: Sim, mode: Mode, cap: number) {
  s.t++;
  // finish calls
  s.slots = s.slots.map((sl) => (sl && sl.left > 1 ? { ...sl, left: sl.left - 1 } : null));
  // arrivals (Acme's campaign keeps ~40 calls queued)
  TENANTS.forEach((tn, i) => {
    const backlog = mode === "fifo" ? s.fifo.filter((c) => c.tenant === i).length : s.queues[i].length;
    if (i === 0 && backlog > 40) return;
    let n = 0;
    if (rand(s) < tn.rate) n++;
    if (i === 0 && rand(s) < 0.35) n++;
    for (let k = 0; k < n; k++) {
      const call = { tenant: i, arrived: s.t, dur: 8 + Math.floor(rand(s) * 7) };
      if (mode === "fifo") s.fifo.push(call);
      else s.queues[i].push(call);
    }
  });

  const inflight = [0, 0, 0];
  s.slots.forEach((sl) => sl && inflight[sl.tenant]++);
  const free = () => s.slots.findIndex((x) => x === null);
  const dispatch = (c: Call) => {
    const idx = free();
    s.slots[idx] = { tenant: c.tenant, left: c.dur };
    inflight[c.tenant]++;
    const w = s.t - c.arrived;
    s.waitEma[c.tenant] = s.served[c.tenant] === 0 ? w : s.waitEma[c.tenant] * 0.85 + w * 0.15;
    s.served[c.tenant]++;
  };

  if (mode === "fifo") {
    while (free() !== -1 && s.fifo.length) dispatch(s.fifo.shift()!);
  } else {
    const eligible = (i: number) => s.queues[i].length > 0 && inflight[i] < cap;
    let guard = 0;
    while (free() !== -1 && [0, 1, 2].some(eligible) && guard++ < 50) {
      const i = s.rr;
      if (eligible(i)) {
        s.deficit[i] += QUANTUM;
        while (s.deficit[i] >= 1 && eligible(i) && free() !== -1) {
          dispatch(s.queues[i].shift()!);
          s.deficit[i] -= 1;
        }
      }
      if (s.queues[i].length === 0) s.deficit[i] = 0;
      s.rr = (s.rr + 1) % 3;
    }
  }
}

export function Dispatcher() {
  const [mode, setMode] = useState<Mode>("fifo");
  const [cap, setCap] = useState(4);
  const sim = useRef<Sim>(makeSim());
  const [, force] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-50px" });
  const [running, setRunning] = useState(true);

  const reset = (m: Mode = mode) => {
    sim.current = makeSim();
    setMode(m);
    force((x) => x + 1);
  };

  useEffect(() => {
    if (!inView || !running) return;
    const id = setInterval(() => {
      step(sim.current, mode, cap);
      force((x) => x + 1);
    }, 160);
    return () => clearInterval(id);
  }, [inView, running, mode, cap]);

  const s = sim.current;
  const queueLen = (i: number) => (mode === "fifo" ? s.fifo.filter((c) => c.tenant === i).length : s.queues[i].length);
  const inflight = [0, 0, 0];
  s.slots.forEach((sl) => sl && inflight[sl.tenant]++);
  const oldest = (i: number) => {
    const q = mode === "fifo" ? s.fifo.find((c) => c.tenant === i) : s.queues[i][0];
    return q ? s.t - q.arrived : 0;
  };
  const wait = [0, 1, 2].map((i) => Math.max(s.served[i] ? s.waitEma[i] : 0, oldest(i)));
  const maxWait = Math.max(30, ...wait);
  const smallWait = (wait[1] + wait[2]) / 2;

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full bg-black/40 p-1 ring-1 ring-night-line">
            {(["fifo", "drr"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => reset(m)}
                className={`rounded-full px-4 py-1.5 font-mono text-[12px] transition ${mode === m ? "bg-white text-night" : "text-white/60 hover:text-white"}`}
              >
                {m === "fifo" ? "Naive FIFO" : "Deficit Round Robin"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
            <span>t={s.t}s</span>
            <button onClick={() => setRunning((r) => !r)} className="rounded-full px-3 py-1 ring-1 ring-night-line hover:text-white">
              {running ? "pause" : "play"}
            </button>
            <button onClick={() => reset()} className="rounded-full px-3 py-1 ring-1 ring-night-line hover:text-white">
              reset
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {TENANTS.map((tn, i) => {
            const q = queueLen(i);
            return (
              <div key={tn.name} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr_6.5rem]">
                <div>
                  <div className="flex items-center gap-2 text-[13.5px] font-medium text-white">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: tn.color }} />
                    {tn.name}
                  </div>
                  <div className="font-mono text-[10.5px] text-white/40">{tn.desc}</div>
                </div>
                <div className="flex h-6 items-center gap-[3px] overflow-hidden">
                  {Array.from({ length: Math.min(q, 30) }).map((_, k) => (
                    <span key={k} className="h-3 w-1.5 shrink-0 rounded-sm" style={{ background: tn.color, opacity: 0.35 + 0.65 * (1 - k / 30) }} />
                  ))}
                  <span className="ml-1 shrink-0 font-mono text-[10.5px] text-white/40">{q > 30 ? `+${q - 30}` : q === 0 ? "queue empty" : ""}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between font-mono text-[10.5px] text-white/50">
                    <span>wait</span>
                    <span className="text-white tabular-nums">{Math.round(wait[i])}s</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (wait[i] / maxWait) * 100)}%`, background: tn.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-white/40">
            <span>{WORKERS} call workers</span>
            {mode === "drr" && <span>per-tenant cap: {cap} concurrent</span>}
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {s.slots.map((sl, k) => (
              <div key={k} className="relative h-11 overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-night-line">
                {sl && (
                  <>
                    <div className="absolute inset-0 opacity-25" style={{ background: TENANTS[sl.tenant].color }} />
                    <div className="absolute bottom-0 left-0 h-1 transition-all" style={{ width: `${(sl.left / 14) * 100}%`, background: TENANTS[sl.tenant].color }} />
                    <div className="relative flex h-full items-center justify-center font-mono text-[11px] text-white">{TENANTS[sl.tenant].name[0]}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {mode === "drr" && (
          <label className="mt-5 flex items-center gap-3 font-mono text-[11px] text-white/50">
            capacity limit
            <input type="range" min={2} max={8} value={cap} onChange={(e) => setCap(+e.target.value)} className="flex-1 accent-[#ff5a1f]" />
            <span className="w-4 text-white">{cap}</span>
          </label>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line sm:p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">What you&apos;re seeing</p>
          {mode === "fifo" ? (
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              One customer launches a huge campaign. With a single FIFO queue, the small customers wait behind it: they wait{" "}
              <span className="font-semibold text-accent">{Math.round(smallWait)}s</span> and climbing.{" "}
              <button onClick={() => reset("drr")} className="text-white underline decoration-accent underline-offset-4">
                Switch to DRR →
              </button>
            </p>
          ) : (
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              Each tenant gets its own queue. Workers are handed out round-robin with a deficit counter, and a per-tenant cap stops any one customer from taking every worker. Small tenants now wait{" "}
              <span className="font-semibold text-ok">~{Math.round(smallWait)}s</span>.
            </p>
          )}
        </div>
        <LeaderElection />
      </div>
    </div>
  );
}

/* ---------- Redis leader election (SET NX PX + Lua renew) ---------- */

type Node = { id: string; alive: boolean };

function LeaderElection() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "node-1", alive: true },
    { id: "node-2", alive: true },
    { id: "node-3", alive: true },
  ]);
  const [leader, setLeader] = useState<string | null>("node-1");
  const [ttl, setTtl] = useState(3000);
  const [log, setLog] = useState<string[]>(["node-1 › SET dispatcher:leader node-1 NX PX 3000 → OK"]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const state = useRef({ nodes, leader, ttl });
  state.current = { nodes, leader, ttl };

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      const { nodes, leader, ttl } = state.current;
      const push = (l: string) => setLog((prev) => [l, ...prev].slice(0, 4));
      const leaderAlive = nodes.find((n) => n.id === leader)?.alive;
      if (leader && leaderAlive) {
        if (ttl <= 1500) {
          setTtl(3000);
          push(`${leader} › EVAL renew.lua dispatcher:leader ${leader} 3000 → 1`);
        } else setTtl(ttl - 250);
      } else if (leader && !leaderAlive) {
        const next = ttl - 250;
        if (next <= 0) {
          setLeader(null);
          setTtl(0);
          push("redis › key dispatcher:leader expired");
        } else setTtl(next);
      } else {
        const alive = nodes.filter((n) => n.alive);
        if (alive.length) {
          const winner = alive[Math.floor(Math.random() * alive.length)];
          alive.filter((n) => n.id !== winner.id).forEach((n) => push(`${n.id} › SET dispatcher:leader ${n.id} NX PX 3000 → nil`));
          push(`${winner.id} › SET dispatcher:leader ${winner.id} NX PX 3000 → OK`);
          setLeader(winner.id);
          setTtl(3000);
        }
      }
    }, 250);
    return () => clearInterval(id);
  }, [inView]);

  const kill = () => {
    if (!leader) return;
    setNodes((ns) => ns.map((n) => (n.id === leader ? { ...n, alive: false } : n)));
    setLog((prev) => [`✕ ${leader} crashed (no more renewals)`, ...prev].slice(0, 4));
  };
  const revive = () => setNodes((ns) => ns.map((n) => ({ ...n, alive: true })));

  return (
    <div ref={ref} className="flex-1 rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Leader election · Redis + Lua</p>
        <div className="flex gap-2">
          <button onClick={kill} disabled={!leader} className="rounded-full bg-accent px-3 py-1 font-mono text-[11px] text-white transition hover:brightness-110 disabled:opacity-40">
            kill leader
          </button>
          <button onClick={revive} className="rounded-full px-3 py-1 font-mono text-[11px] text-white/60 ring-1 ring-night-line hover:text-white">
            revive all
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {nodes.map((n) => {
          const isLeader = n.id === leader && n.alive;
          return (
            <div
              key={n.id}
              className={`rounded-2xl p-3 text-center ring-1 transition ${
                !n.alive ? "bg-black/40 text-white/25 ring-night-line" : isLeader ? "bg-accent/15 text-white ring-accent/60" : "bg-white/[0.04] text-white/80 ring-night-line"
              }`}
            >
              <div className="text-lg">{!n.alive ? "✕" : isLeader ? "👑" : "◦"}</div>
              <div className="font-mono text-[11px]">{n.id}</div>
              <div className="font-mono text-[10px] text-white/40">{!n.alive ? "down" : isLeader ? "leader" : "follower"}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[10.5px] text-white/50">
        lock TTL
        <div className="h-1.5 flex-1 rounded-full bg-white/10">
          <div className="h-1.5 rounded-full bg-accent transition-all duration-200" style={{ width: `${(ttl / 3000) * 100}%` }} />
        </div>
        <span className="w-12 text-right tabular-nums">{ttl}ms</span>
      </div>
      <ul className="mt-3 space-y-1 font-mono text-[10.5px] leading-snug text-white/50">
        {log.map((l, i) => (
          <li key={l + i} className={`truncate ${i === 0 ? "text-white/85" : ""}`}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
