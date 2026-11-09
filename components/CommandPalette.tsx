"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, type Lens } from "@/content/profile";
import { useLens } from "./LensContext";

type Item = { id: string; label: string; hint: string; run: () => void };

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { setLens } = useLens();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => {
    const go = (h: string) => () => document.querySelector(h)?.scrollIntoView({ behavior: "smooth" });
    const lens = (l: Lens) => () => {
      setLens(l);
      document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" });
    };
    return [
      { id: "email", label: "Copy email address", hint: profile.email, run: () => navigator.clipboard?.writeText(profile.email) },
      { id: "cv", label: "Download CV (PDF)", hint: "Ziad_Ahmed_CV.pdf", run: () => window.open(profile.cv, "_blank") },
      { id: "mail", label: "Send an email", hint: "mailto", run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "lab", label: "Open the Systems Lab", hint: "#lab", run: go("#lab") },
      { id: "work", label: "Selected work", hint: "#work", run: go("#work") },
      { id: "infra", label: "AWS infrastructure I designed (live diagram)", hint: "#infra", run: go("#infra") },
      { id: "ach", label: "All achievements", hint: "#achievements", run: go("#achievements") },
      { id: "inc", label: "Postmortems / incidents", hint: "#incidents", run: go("#incidents") },
      { id: "about", label: "About & experience", hint: "#about", run: go("#about") },
      { id: "stack", label: "Tech stack", hint: "#stack", run: go("#stack") },
      { id: "students", label: "Student corner", hint: "#students", run: go("#students") },
      { id: "faq", label: "FAQ", hint: "#faq", run: go("#faq") },
      { id: "l-rec", label: "View as: Recruiter", hint: "lens", run: lens("recruiter") },
      { id: "l-eng", label: "View as: Engineer", hint: "lens", run: lens("engineer") },
      { id: "l-stu", label: "View as: Student", hint: "lens", run: lens("student") },
      { id: "api", label: "GET /api/profile.json", hint: "raw JSON", run: () => window.open("/api/profile.json", "_blank") },
      { id: "gh", label: "GitHub", hint: "ZiadHaridy", run: () => window.open(profile.links.github, "_blank") },
      { id: "li", label: "LinkedIn", hint: "profile", run: () => window.open(profile.links.linkedin, "_blank") },
      { id: "yt", label: "YouTube", hint: "channel", run: () => window.open(profile.links.youtube, "_blank") },
    ];
  }, [setLens]);

  const filtered = items.filter((i) => (i.label + " " + i.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const choose = (i: Item | undefined) => {
    if (!i) return;
    setOpen(false);
    setTimeout(i.run, 60);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 px-4 pt-[14vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            role="dialog"
            aria-label="Command menu"
            initial={{ y: -12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-[24px] bg-card shadow-[0_40px_100px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="font-mono text-accent">›</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIdx((v) => Math.min(v + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIdx((v) => Math.max(v - 1, 0));
                  } else if (e.key === "Enter") choose(filtered[idx]);
                }}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-mute"
              />
              <kbd className="rounded bg-slab px-1.5 font-mono text-[11px] text-mute">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-mute">404: command not found</li>}
              {filtered.map((i, k) => (
                <li key={i.id}>
                  <button
                    onMouseEnter={() => setIdx(k)}
                    onClick={() => choose(i)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[14px] ${k === idx ? "bg-ink text-card" : "text-ink"}`}
                  >
                    {i.label}
                    <span className={`font-mono text-[11px] ${k === idx ? "text-white/50" : "text-mute"}`}>{i.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
