"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

const Ctx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export const useMenu = () => useContext(Ctx);

/** Two-bar burger that morphs into an ×. */
export function BurgerButton({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const { open, setOpen } = useMenu();
  const bar = tone === "dark" ? "bg-white" : "bg-ink";
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${tone === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-card ring-1 ring-black/5 card-shadow hover:-translate-y-px"} ${className}`}
    >
      <span className={`absolute h-[2px] w-[18px] rounded-full ${bar} transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
      <span className={`absolute h-[2px] w-[18px] rounded-full ${bar} transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
    </button>
  );
}
