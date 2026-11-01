import { profile, roadmap } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

/** Compact student corner: one panel, the roadmap as a numbered list. */
export function Students() {
  return (
    <section id="students" className="px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={6}>Student corner</SectionLabel>
      <Reveal className="mt-12">
        <div className="grid grid-cols-1 gap-8 rounded-[32px] bg-card p-6 ring-1 ring-black/5 card-shadow sm:p-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
          <div className="flex flex-col">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">for students &amp; juniors</p>
            <h2 className="mt-3 text-balance text-[clamp(1.9rem,3.6vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Learning backend? <span className="text-mute">The path I&apos;d take again.</span>
            </h2>
            <p className="mt-4 text-pretty text-[15.5px] leading-relaxed text-ink-2/80">
              I teach Software Component Design and Software Architecture as a TA at AASTMT. This is the short version of what I tell my students.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 lg:mt-auto lg:pt-8">
              <a href={profile.links.youtube} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white transition hover:brightness-110">
                ▶ KO-DB on YouTube
              </a>
              <a href={profile.links.kodb} target="_blank" rel="noreferrer" className="rounded-full bg-slab px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-black/5 transition hover:bg-paper">
                Source on GitHub ↗
              </a>
            </div>
          </div>
          <ol className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {roadmap.map((r) => (
              <li key={r.n} className="flex gap-4">
                <span className="mt-0.5 font-mono text-[12px] text-accent">{r.n}</span>
                <span>
                  <span className="block text-[15.5px] font-semibold tracking-[-0.01em]">{r.title}</span>
                  <span className="mt-1 block text-[13.5px] leading-snug text-ink-2/75">{r.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
