// A real (static) API endpoint, because this is a backend engineer's portfolio.
// curl https://ziad-dev.com/api/profile.json
import { profile, metrics, experience, work, stack, education } from "@/content/profile";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      status: 200,
      data: {
        name: profile.name,
        role: profile.role,
        location: profile.location,
        openToWork: profile.openToWork,
        contact: { email: profile.email, ...profile.links },
        summary: profile.summary,
        metrics: metrics.map(({ value, prefix, suffix, label }) => ({ value: `${prefix ?? ""}${value}${suffix}`, label })),
        experience,
        projects: work.map(({ title, company, period, summary, stack }) => ({ title, company, period, summary, stack })),
        stack: Object.fromEntries(stack.map((s) => [s.group, s.items])),
        education,
      },
      meta: { generatedAt: "build-time", hint: "Yes, I write APIs for fun. Say hi →  " + profile.email },
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
