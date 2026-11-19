import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** One-page site: the home page plus the CV, so Google finds both. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://ziad-dev.com/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://ziad-dev.com/Ziad_Ahmed_CV.pdf", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
