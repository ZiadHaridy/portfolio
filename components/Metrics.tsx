import { companies, metrics, techMarquee } from "@/content/profile";
import { Counter } from "./ui/Counter";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

export function Metrics() {
  return (
    <section id="impact" className="slab relative overflow-hidden bg-card px-5 py-16 sm:px-10 sm:py-20 lg:px-14">
      {/* companies strip */}
      <Reveal>
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-8 md:grid-cols-5">
          {companies.map((c) => (
            <div key={c.name} className="text-center">
              <div className="text-[clamp(1.05rem,2vw,1.45rem)] font-semibold tracking-[-0.03em] text-ink/85">{c.name}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">{c.tag}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-16">
        <SectionLabel>Benchmarks</SectionLabel>
      </div>

      <Reveal className="mt-12">
        <SectionHeading title="Production numbers," muted="not side-project numbers." lead="Every figure below shipped to real users, on real infrastructure, with a real AWS bill attached." />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.06}>
            <div className="group relative h-full overflow-hidden rounded-[28px] bg-slab p-7 ring-1 ring-black/[0.04] transition hover:bg-paper/70">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-mute">{m.where}</span>
                <span className="font-mono text-[11px] text-mute">0{i + 1}</span>
              </div>
              <div className="mt-6 text-[clamp(3rem,6vw,4.6rem)] font-semibold leading-none tracking-[-0.05em]">
                {m.display ? <span className="tabular-nums">{m.display}</span> : <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals ?? 0} />}
              </div>
              <div className="mt-3 text-lg font-medium tracking-tight">{m.label}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{m.note}</p>
              <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </div>
          </Reveal>
        ))}
      </div>

      {/* tech marquee */}
      <div className="relative mt-16 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" aria-label="Technologies">
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {[...techMarquee, ...techMarquee].map((t, i) => (
            <span key={i} className="whitespace-nowrap rounded-full bg-slab px-4 py-2 font-mono text-[13px] text-ink-2 ring-1 ring-black/[0.04]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
