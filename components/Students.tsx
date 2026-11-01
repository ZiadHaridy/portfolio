import { profile, roadmap } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

export function Students() {
  return (
    <section id="students" className="px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={6}>Student corner</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading
          title="Learning backend?"
          muted="Here's the path I'd take again."
          lead="I taught Software Component Design, Java, data structures, OOP, APIs and SQL as a TA at AASTMT. This is the short version of what I tell my students."
        />
      </Reveal>
      <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {roadmap.map((r, i) => (
          <Reveal key={r.n} delay={i * 0.05}>
            <div className="group relative h-full overflow-hidden rounded-[24px] bg-card p-6 ring-1 ring-black/5 card-shadow">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-mute">step {r.n}</span>
                <span className="h-2 w-2 rounded-full bg-line transition group-hover:bg-accent" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{r.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2/80">{r.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-3">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[24px] bg-ink p-6 text-card sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">watch it built</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">KO-DB: a database from scratch in Go, explained on YouTube.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={profile.links.youtube} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white transition hover:brightness-110">
              ▶ YouTube
            </a>
            <a href={profile.links.kodb} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-5 py-2.5 text-[14px] font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20">
              Source on GitHub ↗
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
