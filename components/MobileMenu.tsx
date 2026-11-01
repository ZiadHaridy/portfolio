"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { profile } from "@/content/profile";
import { BurgerButton, useMenu } from "./MenuContext";
import { sections } from "./navSections";
import { CopyButton } from "./ui/CopyButton";
import { Logo } from "./ui/Logo";

/** Full-screen section menu for phones and tablets. */
export function MobileMenu() {
  const { open, setOpen } = useMenu();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const go = (href: string) => {
    setOpen(false);
    // wait for the sheet to start closing so the scroll isn't blocked
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex flex-col bg-night text-white"
        >
          <div className="dot-grid-night pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative flex items-center justify-between px-5 pt-5">
            <a href="#top" onClick={(e) => { e.preventDefault(); go("#top"); }} aria-label="Home" className="text-white">
              <Logo className="h-6 w-auto" />
            </a>
            <BurgerButton tone="dark" />
          </div>

          <nav className="relative mt-8 flex-1 overflow-y-auto px-5">
            <ul className="space-y-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={s.href}
                    onClick={(e) => { e.preventDefault(); go(s.href); }}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-3.5"
                  >
                    <span className="w-7 font-mono text-[12px] text-white/35">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[30px] font-semibold leading-none tracking-[-0.035em] transition group-hover:text-accent group-active:text-accent">{s.label}</span>
                    <span className="ml-auto text-white/30 transition group-hover:translate-x-1 group-hover:text-accent">→</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="relative space-y-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5"
          >
            <div className="flex items-center gap-2">
              <a href={`mailto:${profile.email}`} className="flex-1 rounded-full bg-accent py-3.5 text-center text-[15px] font-medium text-white">
                ✉ Email me
              </a>
              <a href={profile.cv} download className="rounded-full bg-white/10 px-5 py-3.5 text-[15px] font-medium text-white">
                CV ↓
              </a>
            </div>
            <div className="flex items-center justify-between font-mono text-[12px] text-white/50">
              <span className="truncate">{profile.email.toLowerCase()}</span>
              <CopyButton value={profile.email} label="Copy" className="!bg-white/10 !text-white !ring-0 !shadow-none" />
            </div>
            <div className="flex gap-5 text-[13px] text-white/70">
              <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.links.youtube} target="_blank" rel="noreferrer">YouTube</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
