/** Hairline divider with a tilted pill, the motif from the reference shots. */
export function SectionLabel({ children, tone = "light", tilt = -6 }: { children: React.ReactNode; tone?: "light" | "dark"; tilt?: number }) {
  const dark = tone === "dark";
  return (
    <div className="relative flex items-center justify-center py-2" aria-hidden="true">
      <div className={`absolute inset-x-0 top-1/2 h-px ${dark ? "bg-gradient-to-r from-transparent via-night-line to-transparent" : "hairline"}`} />
      <span
        style={{ transform: `rotate(${tilt}deg)` }}
        className={`relative rounded-full px-4 py-1.5 font-mono text-[11px] tracking-wide uppercase ${
          dark ? "bg-night-2 text-white/80 ring-1 ring-night-line" : "bg-card text-ink card-shadow ring-1 ring-black/5"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, muted, lead, tone = "light", center = true }: { eyebrow?: string; title: string; muted?: string; lead?: React.ReactNode; tone?: "light" | "dark"; center?: boolean }) {
  const dark = tone === "dark";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && <p className={`mb-4 font-mono text-xs uppercase tracking-[0.18em] ${dark ? "text-white/50" : "text-mute"}`}>{eyebrow}</p>}
      <h2 className={`text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${dark ? "text-white" : "text-ink"}`}>
        {title} {muted && <span className={dark ? "text-white/40" : "text-mute"}>{muted}</span>}
      </h2>
      {lead && <p className={`mt-5 text-pretty text-[17px] leading-relaxed ${dark ? "text-white/60" : "text-ink-2/80"} ${center ? "mx-auto" : ""} max-w-2xl`}>{lead}</p>}
    </div>
  );
}
