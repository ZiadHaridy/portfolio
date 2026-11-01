import { companies } from "@/content/profile";

/** "Partners" style strip: company logos scrolling infinitely, grayscale until hovered. */
function Item({ c }: { c: (typeof companies)[number] }) {
  const initials = c.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <li className="group/logo flex shrink-0 items-center gap-4 rounded-[22px] bg-slab px-5 py-3.5 ring-1 ring-black/[0.04] transition duration-300 hover:bg-card hover:shadow-[0_12px_32px_-14px_rgba(17,17,16,0.25)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        {c.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.logo}
            alt={`${c.name} logo`}
            loading="lazy"
            className="max-h-12 max-w-12 rounded-lg object-contain opacity-80 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink font-mono text-[13px] font-semibold text-card transition group-hover/logo:bg-accent">
            {initials}
          </span>
        )}
      </span>
      <span className="pr-1">
        <span className="block whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em] text-ink">{c.name}</span>
        <span className="block whitespace-nowrap font-mono text-[10.5px] uppercase tracking-wider text-mute">{c.tag}</span>
      </span>
    </li>
  );
}

export function LogoMarquee() {
  // two copies so the -50% translate loops seamlessly
  const row = [...companies, ...companies];
  return (
    <div>
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Companies I&apos;ve built for</p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="flex w-max animate-marquee-slow gap-3 py-2 hover:[animation-play-state:paused]" aria-label="Companies">
          {row.map((c, i) => (
            <Item key={`${c.name}-${i}`} c={c} />
          ))}
        </ul>
      </div>
    </div>
  );
}
