"use client";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { infraSystems, type InfraEdge } from "@/content/infra";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const W = 1600;
const STEP_MS = 2800;
const ACC = "#ff5a1f";
const BAD = "#f43f5e";
const DEPLOY = "rgba(96,165,250,0.75)";

const toD = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const length = (pts: [number, number][]) => pts.slice(1).reduce((n, [x, y], i) => n + Math.hypot(x - pts[i][0], y - pts[i][1]), 0);

const groupStyle: Record<string, { stroke: string; dash?: string; title: string; fill?: string }> = {
  plain: { stroke: "rgba(255,255,255,0.22)", title: "rgba(255,255,255,0.85)" },
  dashed: { stroke: "rgba(255,255,255,0.25)", dash: "5 5", title: "rgba(255,255,255,0.75)" },
  aws: { stroke: "rgba(255,255,255,0.3)", title: "rgba(255,255,255,0.9)" },
  region: { stroke: "rgba(45,212,191,0.6)", dash: "6 5", title: "#5eead4" },
  s3: { stroke: "rgba(163,230,53,0.55)", dash: "4 4", title: "#bef264" },
  ec2: { stroke: "rgba(237,113,0,0.85)", title: "#fdba74", fill: "rgba(237,113,0,0.05)" },
  vpc: { stroke: "rgba(167,139,250,0.7)", title: "#c4b5fd" },
  subnet: { stroke: "rgba(122,161,22,0.7)", title: "#bef264", fill: "rgba(122,161,22,0.05)" },
  sg: { stroke: "rgba(244,63,94,0.75)", title: "#fda4af" },
  asg: { stroke: "rgba(237,113,0,0.7)", dash: "6 4", title: "#fdba74" },
};

/** Every (project, diagram, flow) in play order: auto-play walks through all of them. */
const playlist = infraSystems.flatMap((s, si) => s.diagrams.flatMap((d, di) => d.scenarios.map((_, ci) => ({ si, di, ci }))));

/**
 * Architectures I built, as live diagrams: real request flows play on a loop (no clicks needed),
 * and visitors can switch project, before/after, flow or step.
 */
export function Infra() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const { si, di, ci } = playlist[pos];
  const system = infraSystems[si];
  const diagram = system.diagrams[di];
  const scenario = diagram.scenarios[ci];
  const current = scenario.steps[step];
  const bad = scenario.tone === "bad";
  const hot = bad ? BAD : ACC;
  const edgeById = useMemo(() => Object.fromEntries(diagram.edges.map((e) => [e.id, e])) as Record<string, InfraEdge>, [diagram]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-play: steps, then the next flow; with auto-play on it moves on to the next diagram and project too.
  useEffect(() => {
    if (!visible || reduce) return;
    const t = setTimeout(() => {
      if (step < scenario.steps.length - 1) return setStep(step + 1);
      setStep(0);
      if (auto) setPos((pos + 1) % playlist.length);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [visible, reduce, step, pos, auto, scenario.steps.length]);

  useEffect(() => {
    const box = scroller.current;
    if (!box || box.scrollWidth <= box.clientWidth + 4) return;
    const e = edgeById[current.edges[0]];
    const xs = e ? e.pts.map((p) => p[0]) : [W / 2];
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const scale = box.scrollWidth / W;
    box.scrollTo({ left: Math.max(0, cx * scale - box.clientWidth / 2), behavior: "smooth" });
  }, [current, edgeById]);

  const go = (target: { si: number; di?: number; ci?: number }) => {
    const i = playlist.findIndex((p) => p.si === target.si && (target.di === undefined || p.di === target.di) && (target.ci === undefined || p.ci === target.ci));
    if (i >= 0) {
      setPos(i);
      setStep(0);
      setAuto(false);
    }
  };

  const activeEdges = new Set(current.edges);
  const doneEdges = new Set(scenario.steps.slice(0, step).flatMap((s) => s.edges));
  const activeNodes = new Set(current.nodes);
  const seenNodes = new Set(scenario.steps.slice(0, step + 1).flatMap((s) => s.nodes));
  const H = diagram.h;
  const uid = `${system.id}-${diagram.id}`;

  return (
    <section id="infra" ref={ref} className="slab relative overflow-hidden bg-night px-4 py-20 text-white sm:px-10 sm:py-24 lg:px-14">
      <div className="dot-grid-night pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative">
        <SectionLabel tone="dark" tilt={4}>Infrastructure</SectionLabel>
        <Reveal className="mt-12">
          <SectionHeading
            tone="dark"
            title="Infrastructure I designed,"
            muted="built, and run in production."
            lead="Real AWS setups I built: my own startup, and a client platform I rebuilt. Watch requests travel through them, or pick a project and a flow."
          />
        </Reveal>

        {/* project switcher */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-2 sm:grid-cols-2" role="tablist" aria-label="Projects">
          {infraSystems.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === si}
              onClick={() => go({ si: i })}
              className={`rounded-2xl p-4 text-left transition ${i === si ? "bg-white text-night" : "bg-white/[0.04] text-white ring-1 ring-white/10 hover:bg-white/[0.08]"}`}
            >
              <span className={`block font-mono text-[11px] uppercase tracking-[0.14em] ${i === si ? "text-accent" : "text-white/45"}`}>{s.kicker}</span>
              <span className="mt-1 block text-[17px] font-semibold tracking-[-0.01em]">{s.title}</span>
              <span className={`mt-1 block text-[13px] leading-snug ${i === si ? "text-night/60" : "text-white/50"}`}>{s.blurb}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-3 grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4">
          {system.facts.map((f) => (
            <div key={f.label} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <div className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-white">{f.value}</div>
              <div className="mt-2 text-[12.5px] leading-snug text-white/55">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {system.diagrams.length > 1 && (
            <div className="flex rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10" role="tablist" aria-label="Before and after">
              {system.diagrams.map((d, i) => (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={i === di}
                  onClick={() => go({ si, di: i })}
                  className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
                    i === di ? (d.id === "before" ? "bg-rose-500 text-white" : "bg-accent text-white") : "text-white/60 hover:text-white"
                  }`}
                >
                  {d.label}
                  <span className={`ml-2 hidden font-normal sm:inline ${i === di ? "text-white/80" : "text-white/40"}`}>{d.caption}</span>
                </button>
              ))}
            </div>
          )}
          <div className="no-scrollbar -mx-4 flex max-w-full gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="tablist" aria-label="Request flows">
            {diagram.scenarios.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === ci}
                onClick={() => go({ si, di, ci: i })}
                className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition ${
                  i === ci ? "bg-white text-night" : "bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:text-white"
                }`}
              >
                {s.label}
                {i === ci && !reduce && (
                  <span
                    key={`${pos}-${step}`}
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{ background: hot, width: `${((step + 1) / s.steps.length) * 100}%`, transition: "width 400ms ease" }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => setAuto((a) => !a)}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-mono text-[11.5px] text-white/50 ring-1 ring-white/10 transition hover:text-white"
              aria-pressed={auto}
            >
              {auto ? "● auto-play on" : "○ auto-play off"}
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-[#111110] ring-1 ring-white/10">
          <div ref={scroller} className="no-scrollbar overflow-x-auto">
            <svg key={uid} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[920px] animate-[fadeUp_500ms_ease]" role="img" aria-label={`${system.title}, ${diagram.label.toLowerCase()}: architecture diagram with the selected flow highlighted`}>
              <defs>
                <marker id={`ia-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 10 5 0 10z" fill="rgba(255,255,255,0.45)" />
                </marker>
                <marker id={`id-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 10 5 0 10z" fill={DEPLOY} />
                </marker>
                <marker id={`ion-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 10 5 0 10z" fill={hot} />
                </marker>
                <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {diagram.groups.map((g) => {
                const st = groupStyle[g.tone];
                return (
                  <g key={g.id}>
                    <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="6" fill={st.fill ?? "none"} stroke={st.stroke} strokeWidth="1.4" strokeDasharray={st.dash} />
                    {g.icon && <image href={`/infra/${g.icon}.svg`} x={g.x} y={g.y} width="28" height="28" />}
                    <text x={g.x + (g.icon ? 38 : 12)} y={g.y + 20} fontSize="13" fontWeight="600" fill={st.title}>
                      {g.title}
                    </text>
                    {g.items?.map((it, k) => (
                      <text key={it} x={g.x + 12} y={g.y + 48 + k * 22} fontSize="12" fill="rgba(255,255,255,0.65)">
                        {it}
                      </text>
                    ))}
                  </g>
                );
              })}
              {system.id === "booking" && (
                <>
                  <text x="920" y="482" fontSize="11.5" fill="rgba(255,255,255,0.45)">
                    Only ports 80 and 443 open · no SSH (Session Manager)
                  </text>
                  <text x="1440" y="972" fontSize="11.5" fill="rgba(255,255,255,0.45)" textAnchor="middle">
                    Web apps build on Cloudflare Pages
                  </text>
                </>
              )}

              {diagram.edges
                .filter((e) => !e.ghost)
                .map((e) => {
                  const dep = e.kind === "deploy";
                  return (
                    <g key={e.id}>
                      <path
                        d={toD(e.pts)}
                        fill="none"
                        stroke={dep ? DEPLOY : "rgba(255,255,255,0.2)"}
                        strokeWidth={dep ? 1.6 : 1.3}
                        strokeDasharray={e.kind === "async" ? "5 4" : undefined}
                        markerEnd={e.arrow === false ? undefined : `url(#${dep ? "id" : "ia"}-${uid})`}
                      />
                      {!reduce && e.kind !== "async" && <path d={toD(e.pts)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.3" className="infra-flow" />}
                    </g>
                  );
                })}

              {[...doneEdges]
                .filter((id) => !activeEdges.has(id))
                .map((id) => (
                  <path key={`done-${id}`} d={toD(edgeById[id].pts)} fill="none" stroke={hot} strokeOpacity="0.4" strokeWidth="2" />
                ))}

              {current.edges.map((id) => {
                const e = edgeById[id];
                const d = toD(e.pts);
                const dur = Math.max(0.7, length(e.pts) / 420);
                return (
                  <g key={`on-${pos}-${step}-${id}`}>
                    <path d={d} fill="none" stroke={hot} strokeWidth="2.6" filter={`url(#glow-${uid})`} markerEnd={e.arrow === false ? undefined : `url(#ion-${uid})`} />
                    {!reduce &&
                      [0, 0.5].map((off) => (
                        <circle key={off} r="5" fill="#fff" stroke={hot} strokeWidth="2.5" filter={`url(#glow-${uid})`}>
                          <animateMotion dur={`${dur}s`} begin={`${off * dur}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      ))}
                  </g>
                );
              })}

              {diagram.edges
                .filter((e) => e.label)
                .map((e) => (
                  <text
                    key={`l-${e.id}`}
                    x={e.lx}
                    y={e.ly}
                    fontSize="11.5"
                    textAnchor={e.anchor ?? "middle"}
                    fill={activeEdges.has(e.id) ? (bad ? "#fecdd3" : "#ffd2c2") : e.kind === "deploy" ? "rgba(147,197,253,0.85)" : "rgba(255,255,255,0.45)"}
                    stroke="#111110"
                    strokeWidth="4"
                    paintOrder="stroke"
                    strokeLinejoin="round"
                  >
                    {e.label}
                  </text>
                ))}

              {diagram.nodes.map((n) => {
                const on = activeNodes.has(n.id);
                const seen = seenNodes.has(n.id);
                return (
                  <g key={n.id} style={{ opacity: on ? 1 : seen ? 0.85 : 0.42, transition: "opacity 400ms ease" }}>
                    {on && (
                      <rect x={n.x - 31} y={n.y - 31} width="62" height="62" rx="15" fill="none" stroke={hot} strokeWidth="2" filter={`url(#glow-${uid})`}>
                        {!reduce && <animate attributeName="stroke-opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite" />}
                      </rect>
                    )}
                    <image href={`/infra/${n.icon}.svg`} x={n.x - 24} y={n.y - 24} width="48" height="48" />
                    <text x={n.x} y={n.y + 41} fontSize="13" fontWeight="600" textAnchor="middle" fill="#fff">
                      {n.label}
                    </text>
                    {n.sub && (
                      <text x={n.x} y={n.y + 57} fontSize="11.5" textAnchor="middle" fill="rgba(255,255,255,0.5)">
                        {n.sub}
                      </text>
                    )}
                    {n.sub2 && (
                      <text x={n.x} y={n.y + 72} fontSize="11.5" textAnchor="middle" fill="rgba(255,255,255,0.5)">
                        {n.sub2}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
              <div className="min-h-[4.5rem] flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: hot }}>
                  {system.diagrams.length > 1 ? `${diagram.label} · ` : ""}
                  {scenario.label} · step {step + 1} / {scenario.steps.length}
                </p>
                <p key={`${pos}-${step}`} className="mt-2 animate-[fadeUp_400ms_ease] text-pretty text-[17px] leading-relaxed text-white/90 sm:text-[19px]">
                  {current.text}
                </p>
              </div>
              <ol className="flex gap-1.5 lg:pt-1">
                {scenario.steps.map((_, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        setStep(i);
                        setAuto(false);
                      }}
                      aria-label={`Step ${i + 1}`}
                      aria-current={i === step}
                      style={i === step ? { background: hot } : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] transition ${
                        i === step ? "text-white" : i < step ? "bg-white/15 text-white/80" : "bg-white/[0.06] text-white/50 ring-1 ring-white/10 hover:text-white"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-[12.5px] text-white/45 sm:flex-row">
          <p className="sm:hidden">Swipe the diagram to explore →</p>
          <p>{system.note ?? "Sanitized for publishing: domains, IPs and resource names are removed."}</p>
          {system.id === "booking" && (
            <a href="/architecture/booking-platform.png" target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.06] px-4 py-2 font-medium text-white/80 ring-1 ring-white/10 transition hover:text-white">
              Full-size diagram ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
