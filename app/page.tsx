import { Bento } from "@/components/Bento";
import { Contact } from "@/components/Contact";
import { Achievements } from "@/components/Achievements";
import { Recommendation } from "@/components/Recommendation";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Incidents } from "@/components/Incidents";
import { Lab } from "@/components/Lab";
import { Metrics } from "@/components/Metrics";
import { Shell } from "@/components/Shell";
import { Stack } from "@/components/Stack";
import { Students } from "@/components/Students";
import { Work } from "@/components/Work";

export default function Page() {
  return (
    <Shell>
      <main className="mx-auto max-w-[1320px] space-y-3 p-3 sm:p-5">
        <Hero />
        <Metrics />
        <Bento />
        <Lab />
        <Work />
        <Achievements />
        <Recommendation />
        <Incidents />
        <Stack />
        <Students />
        <Faq />
        <Contact />
      </main>
    </Shell>
  );
}
