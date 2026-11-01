"use client";
import { useState } from "react";
import { stack } from "@/content/profile";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, SectionLabel } from "./ui/SectionLabel";

const filters = [
  { id: "all", label: "Everything" },
  { id: "backend", label: "Backend", groups: ["Languages", "Backend", "Data", "Messaging", "Architecture", "Testing"] },
  { id: "cloud", label: "Cloud", groups: ["Cloud & DevOps", "Messaging"] },
  { id: "frontend", label: "Frontend & mobile", groups: ["Frontend & Mobile", "Testing"] },
] as const;

export function Stack() {
  const [f, setF] = useState<(typeof filters)[number]["id"]>("all");
  const current = filters.find((x) => x.id === f)!;
  const visible = (g: string) => current.id === "all" || ("groups" in current && (current.groups as readonly string[]).includes(g));
  return (
    <section id="stack" className="slab bg-card px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <SectionLabel tilt={-5}>Stack</SectionLabel>
      <Reveal className="mt-12">
        <SectionHeading title="Backend at heart." muted="Full-stack when it matters." lead="Node.js, Go and Java/Spring Boot on the server. React, Next.js and React Native when the product needs a face." />
      </Reveal>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {filters.map((x) => (
          <button key={x.id} onClick={() => setF(x.id)} className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${f === x.id ? "bg-ink text-card" : "bg-slab text-ink-2 hover:text-ink"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((g) => (
          <div key={g.group} className={`rounded-[24px] bg-slab p-5 ring-1 ring-black/[0.04] transition duration-300 ${visible(g.group) ? "opacity-100" : "scale-[0.98] opacity-30"}`}>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{g.group}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <span key={i} className="rounded-full bg-card px-3 py-1.5 text-[13px] text-ink ring-1 ring-black/5">
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
