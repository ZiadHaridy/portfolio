"use client";
import { useEffect, useState, type ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";
import { FloatingNav } from "./FloatingNav";
import { LensProvider } from "./LensContext";
import { MenuProvider } from "./MenuContext";
import { MobileMenu } from "./MobileMenu";
import { profile } from "@/content/profile";

export function Shell({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState(false);
  useEffect(() => {
    // a hello for the engineers who open devtools
    console.log(
      `%c ZA. %c Hey engineer 👋  Curious how this works? Try:  curl ${location.origin}/api/profile.json  ·  ${profile.email}`,
      "background:#111110;color:#fbfbfa;font-weight:700;padding:4px 6px;border-radius:4px",
      "color:#ff5a1f;padding:4px",
    );
  }, []);
  return (
    <LensProvider>
      <MenuProvider>
        <FloatingNav onOpenPalette={() => setPalette(true)} />
        <MobileMenu />
        <CommandPalette open={palette} setOpen={setPalette} />
        {children}
      </MenuProvider>
    </LensProvider>
  );
}
