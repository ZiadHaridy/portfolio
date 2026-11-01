"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { faqs } from "@/content/profile";
import { Reveal } from "./ui/Reveal";

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="slab bg-slab px-5 py-20 sm:px-10 sm:py-24 lg:px-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.045em]">FAQ</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-2/75">
            The questions recruiters and hiring managers usually ask in the first call, answered up front.
          </p>
        </Reveal>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left" aria-expanded={open === i}>
                <span className="text-[17px] font-medium tracking-tight">{f.q}</span>
                <span className={`text-xl text-mute transition ${open === i ? "rotate-45 text-accent" : ""}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden pr-10 text-[15px] leading-relaxed text-ink-2/80">
                    <span className="block pb-5">{f.a}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
