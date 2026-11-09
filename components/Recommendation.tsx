import { recommendations } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

/** Signed recommendation letters: a pull quote plus the full letter to open or download. */
export function Recommendation() {
  return (
    <section id="recommendations" className="px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={5}>Recommendation</SectionLabel>
      {recommendations.map((r) => (
        <Reveal key={r.name} className="mt-12">
          <figure className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-[32px] bg-night p-6 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-14">
            <div className="dot-grid-night pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative flex flex-col">
              <span aria-hidden className="font-serif text-[72px] leading-none text-accent">&ldquo;</span>
              <blockquote className="-mt-4 text-balance text-[clamp(1.4rem,2.6vw,2.1rem)] font-semibold leading-[1.2] tracking-[-0.025em]">
                {r.quote}
              </blockquote>
              <ul className="mt-6 space-y-2 text-[15px] leading-relaxed text-white/65">
                {r.more.map((m) => (
                  <li key={m}>&ldquo;{m}&rdquo;</li>
                ))}
              </ul>
              <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 lg:mt-auto lg:pt-10">
                <div>
                  <p className="text-[16px] font-semibold">{r.name}</p>
                  <p className="text-[13.5px] text-white/55">
                    {r.title}, {r.company}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-white/70">{r.context}</span>
              </figcaption>
            </div>
            <div className="relative flex flex-col items-center gap-4 lg:w-[220px]">
              <a
                href={r.image}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the full recommendation letter from ${r.name}`}
                className="block w-[180px] rotate-[2deg] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-white/10 transition hover:rotate-0 hover:scale-[1.03] sm:w-[220px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.thumb} alt={`Recommendation letter from ${r.name}, ${r.company}`} width={360} height={466} loading="lazy" className="h-auto w-full" />
              </a>
              <div className="flex gap-2">
                <a href={r.image} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium transition hover:bg-white/20">
                  Read letter
                </a>
                <a href={r.letter} download className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium transition hover:brightness-110">
                  PDF ↓
                </a>
              </div>
            </div>
          </figure>
        </Reveal>
      ))}
    </section>
  );
}
