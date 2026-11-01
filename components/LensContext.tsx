"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Lens } from "@/content/profile";

const Ctx = createContext<{ lens: Lens | null; setLens: (l: Lens | null) => void }>({ lens: null, setLens: () => {} });

export function LensProvider({ children }: { children: ReactNode }) {
  const [lens, setLens] = useState<Lens | null>(null);
  return <Ctx.Provider value={{ lens, setLens }}>{children}</Ctx.Provider>;
}

export const useLens = () => useContext(Ctx);
