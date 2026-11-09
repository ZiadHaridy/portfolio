"use client";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { infraEdges, infraFacts, infraGroups, infraNodes, infraScenarios, type InfraEdge } from "@/content/infra";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const W = 1600;
const H = 1010;
const STEP_MS = 2800;
const ACC = "#ff5a1f";

const toD = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const length = (pts: [number, number][]) => pts.slice(1).reduce((n, [x, y], i) => n + Math.hypot(x - pts[i][0], y - pts[i][1]), 0);

const groupStyle: Record<string, { stroke: string; dash?: string; title: string }> = {
  plain: { stroke: "rgba(255,255,255,0.22)", title: "rgba(255,255,255,0.85)" },
  aws: { stroke: "rgba(255,255,255,0.3)", title: "rgba(255,255,255,0.9)" },
  region: { stroke: "rgba(45,212,191,0.6)", dash: "6 5", title: "#5eead4" },
  s3: { stroke: "rgba(163,230,53,0.55)", dash: "4 4", title: "#bef264" },
  ec2: { stroke: "rgba(237,113,0,0.85)", title: "#fdba74" },
};

/**
 * Production architecture as a live diagram: it plays real request flows on a loop
 * (no clicks needed), and visitors can pick a flow or a step to inspect it.
 */
export function Infra() {
  const reduce = useReducedMotion();
  const [sc, setSc] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const scenario = infraScenarios[sc];
  const current = scenario.steps[step];
  const edgeById = useMemo(() => Object.fromEntries(infraEdges.map((e) => [e.id, e])) as Record<string, InfraEdge>, []);

  // Only animate while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-play: step through the flow, then move to the next flow.
  useEffect(() => {
    if (!visible || reduce) return;
    const t = setTimeout(() => {
      if (step < scenario.steps.length - 1) setStep(step + 1);
      else if (auto) {
        setSc((sc + 1) % infraScenarios.length);
        setStep(0);
      } else setStep(0);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [visible, reduce, step, sc, auto, scenario.steps.length]);

  // On narrow screens the canvas scrolls sideways: keep the active hop in view.
  useEffect(() => {
    const box = scroller.current;
    if (!box || box.scrollWidth <= box.clientWidth + 4) return;
    const e = edgeById[current.edges[0]];
    if (!e) return;
    const xs = e.pts.map((p) => p[0]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const scale = box.scrollWidth / W;
    box.scrollTo({ left: Math.max(0, cx * scale - box.clientWidth / 2), behavior: "smooth" });
  }, [current, edgeById]);

  const activeEdges = new Set(current.edges);
  const doneEdges = new Set(scenario.steps.slice(0, step).flatMap((s) => s.edges));
  const activeNodes = new Set(current.nodes);
  const seenNodes = new Set(scenario.steps.slice(0, step + 1).flatMap((s) => s.nodes));

  const pick = (i: number) => {
    setSc(i);
    setStep(0);
    setAuto(false);
  };

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
            lead="The real setup behind my salon & barber booking startup: two mobile apps, three web apps and one lean, locked-down AWS footprint. Watch requests travel through it, or pick a flow."
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4">
          {infraFacts.map((f) => (
            <div key={f.label} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <div className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-white">{f.value}</div>
              <div className="mt-2 text-[12.5px] leading-snug text-white/55">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="tablist" aria-label="Request flows">
          {infraScenarios.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === sc}
              onClick={() => pick(i)}
              className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition ${
                i === sc ? "bg-white text-night" : "bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:text-white"
              }`}
            >
              {s.label}
              {i === sc && auto && !reduce && (
                <span
                  key={`${sc}-${step}`}
                  className="absolute bottom-0 left-0 h-[2px] bg-accent"
                  style={{ width: `${((step + 1) / s.steps.length) * 100}%`, transition: "width 400ms ease" }}
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

        <div className="mt-6 overflow-hidden rounded-[28px] bg-[#111110] ring-1 ring-white/10">
          <div ref={scroller} className="no-scrollbar overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[920px]" role="img" aria-label="Production architecture of a salon and barber booking platform on AWS and Cloudflare, with the selected request flow highlighted">
              <defs>
                <marker id="ia" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 10 5 0 10z" fill="rgba(255,255,255,0.45)" />
                </marker>
                <marker id="ia-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 10 5 0 10z" fill={ACC} />
                </marker>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {infraGroups.map((g) => {
                const st = groupStyle[g.tone];
                return (
                  <g key={g.id}>
                    <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="6" fill={g.tone === "ec2" ? "rgba(237,113,0,0.05)" : "none"} stroke={st.stroke} strokeWidth="1.4" strokeDasharray={st.dash} />
                    {g.icon && <image href={`/infra/${g.icon}.svg`} x={g.x} y={g.y} width="28" height="28" />}
                    <text x={g.x + (g.icon ? 38 : 12)} y={g.y + 20} fontSize="13" fontWeight="600" fill={st.title}>
                      {g.title}
                    </text>
                  </g>
                );
              })}
              <text x="920" y="482" fontSize="11.5" fill="rgba(255,255,255,0.45)">
                Only ports 80 and 443 open · no SSH (Session Manager)
              </text>
              <text x="1440" y="972" fontSize="11.5" fill="rgba(255,255,255,0.45)" textAnchor="middle">
                Web apps build on Cloudflare Pages
              </text>

              {/* base wiring */}
              {infraEdges
                .filter((e) => !e.ghost)
                .map((e) => (
                  <g key={e.id}>
                    <path d={toD(e.pts)} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.3" markerEnd={e.arrow === false ? undefined : "url(#ia)"} />
                    {!reduce && <path d={toD(e.pts)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.3" className="infra-flow" />}
                  </g>
                ))}

              {/* earlier hops of the current flow */}
              {[...doneEdges].filter((id) => !activeEdges.has(id)).map((id) => {
                const e = edgeById[id];
                return <path key={`done-${id}`} d={toD(e.pts)} fill="none" stroke={ACC} strokeOpacity="0.4" strokeWidth="2" />;
              })}

              {/* the hop being explained right now */}
              {current.edges.map((id) => {
                const e = edgeById[id];
                const d = toD(e.pts);
                const dur = Math.max(0.7, length(e.pts) / 420);
                return (
                  <g key={`on-${sc}-${step}-${id}`}>
                    <path d={d} fill="none" stroke={ACC} strokeWidth="2.6" filter="url(#glow)" markerEnd={e.arrow === false ? undefined : "url(#ia-on)"} />
                    {!reduce &&
                      [0, 0.5].map((off) => (
                        <circle key={off} r="5" fill="#fff" stroke={ACC} strokeWidth="2.5" filter="url(#glow)">
                          <animateMotion dur={`${dur}s`} begin={`${off * dur}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      ))}
                  </g>
                );
              })}

              {/* edge labels on top of the wiring */}
              {infraEdges
                .filter((e) => e.label)
                .map((e) => {
                  const on = activeEdges.has(e.id);
                  return (
                    <text
                      key={`l-${e.id}`}
                      x={e.lx}
                      y={e.ly}
                      fontSize="11.5"
                      textAnchor={e.anchor ?? "middle"}
                      fill={on ? "#ffd2c2" : "rgba(255,255,255,0.45)"}
                      stroke="#111110"
                      strokeWidth="4"
                      paintOrder="stroke"
                      strokeLinejoin="round"
                    >
                      {e.label}
                    </text>
                  );
                })}

              {/* services */}
              {infraNodes.map((n) => {
                const on = activeNodes.has(n.id);
                const seen = seenNodes.has(n.id);
                return (
                  <g key={n.id} style={{ opacity: on ? 1 : seen ? 0.85 : 0.42, transition: "opacity 400ms ease" }}>
                    {on && (
                      <rect x={n.x - 31} y={n.y - 31} width="62" height="62" rx="15" fill="none" stroke={ACC} strokeWidth="2" filter="url(#glow)">
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

          {/* narration */}
          <div className="border-t border-white/10 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
              <div className="min-h-[4.5rem] flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  {scenario.label} · step {step + 1} / {scenario.steps.length}
                </p>
                <p key={`${sc}-${step}`} className="mt-2 animate-[fadeUp_400ms_ease] text-pretty text-[17px] leading-relaxed text-white/90 sm:text-[19px]">
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
                      className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] transition ${
                        i === step ? "bg-accent text-white" : i < step ? "bg-accent/25 text-white/80" : "bg-white/[0.06] text-white/50 ring-1 ring-white/10 hover:text-white"
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
          <p>Sanitized for publishing: domains, IPs and resource names are removed.</p>
          <a href="/architecture/booking-platform.png" target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.06] px-4 py-2 font-medium text-white/80 ring-1 ring-white/10 transition hover:text-white">
            Full-size diagram ↗
          </a>
        </div>
      </div>
    </section>
  );
}
