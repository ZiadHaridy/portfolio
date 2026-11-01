"use client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Logo } from "./ui/Logo";

const links = [
  ["Impact", "#impact"],
  ["Lab", "#lab"],
  ["Work", "#work"],
  ["Incidents", "#incidents"],
  ["Stack", "#stack"],
  ["Contact", "#contact"],
];

export function FloatingNav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 640));
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="fixed inset-x-0 top-3 z-50 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full bg-ink/90 p-1.5 pl-4 text-[13px] text-white/75 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <a href="#top" className="mr-2 text-white" aria-label="Home">
            <Logo className="h-4 w-auto" />
          </a>
          <div className="no-scrollbar hidden items-center gap-0.5 overflow-x-auto md:flex">
            {links.map(([l, h]) => (
              <a key={h} href={h} className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white">
                {l}
              </a>
            ))}
          </div>
          <button onClick={onOpenPalette} className="ml-1 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11.5px] text-white transition hover:bg-white/20" aria-label="Open command menu">
            <span className="hidden sm:inline">Search</span>
            <kbd className="rounded bg-white/15 px-1.5">⌘K</kbd>
          </button>
          <a href="#contact" className="rounded-full bg-accent px-4 py-1.5 font-medium text-white transition hover:brightness-110">
            Hire me
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
