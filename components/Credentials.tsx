import { credentials } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const badge = {
  award: { label: "Award", icon: "🥇", cls: "bg-accent text-white" },
  community: { label: "Community", icon: "🤝", cls: "bg-ink text-card" },
  course: { label: "Certificate", icon: "📜", cls: "bg-paper text-ink ring-1 ring-black/10" },
} as const;

export function Credentials() {
  return (
    <section id="credentials" className="slab bg-card px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={-5}>Credentials</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading title="Certificates & community." muted="Still learning, still showing up." />
      </Reveal>
      <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {credentials.map((c, i) => {
          const b = badge[c.kind];
          const Card = (
            <div className={`group relative flex h-full flex-col overflow-hidden rounded-[24px] p-6 ring-1 transition duration-300 ${c.kind === "award" ? "bg-ink text-card ring-ink" : "bg-slab ring-black/[0.05] hover:bg-paper/60"}`}>
              {/* certificate-style corner seal */}
              <span aria-hidden className={`absolute -bottom-7 -right-7 h-20 w-20 rounded-full border-[6px] border-dashed opacity-20 ${c.kind === "award" ? "border-accent" : "border-ink/40"}`} />
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider ${b.cls}`}>
                  {b.icon} {b.label}
                </span>
                {c.date && <span className={`font-mono text-[11px] ${c.kind === "award" ? "text-white/50" : "text-mute"}`}>{c.date}</span>}
              </div>
              <h3 className="mt-6 text-[19px] font-semibold leading-snug tracking-[-0.02em]">{c.title}</h3>
              <p className={`mt-2 text-[13.5px] leading-relaxed ${c.kind === "award" ? "text-white/65" : "text-ink-2/80"}`}>{c.issuer}</p>
              <p className={`mt-auto pt-6 font-mono text-[11.5px] ${c.kind === "award" ? "text-accent" : "text-mute"}`}>
                {c.detail}
                {c.url && <span className="ml-2 text-ink underline decoration-line underline-offset-4 group-hover:decoration-accent">Verify ↗</span>}
              </p>
            </div>
          );
          return (
            <Reveal key={c.title} delay={i * 0.06}>
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" className="block h-full" aria-label={`${c.title}, verify certificate`}>
                  {Card}
                </a>
              ) : (
                Card
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
