/** Tiny animated architecture sketches used as "thumbnails" for each project. */

type Box = { x: number; y: number; w?: number; label: string; accent?: boolean };
type Edge = [number, number];

function Diagram({ boxes, edges, label }: { boxes: Box[]; edges: Edge[]; label: string }) {
  const H = 26;
  const center = (b: Box) => ({ x: b.x + (b.w ?? 84) / 2, y: b.y + H / 2 });
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#8b8a86" />
        </marker>
      </defs>
      {edges.map(([a, b], i) => {
        const p = center(boxes[a]);
        const q = center(boxes[b]);
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#c9c7c2" strokeWidth="1.2" />
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#ff5a1f" strokeWidth="1.6" strokeDasharray="3 14" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" from="34" to="0" dur={`${1.4 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
            </line>
          </g>
        );
      })}
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w ?? 84} height={H} rx="9" fill={b.accent ? "#111110" : "#fbfbfa"} stroke={b.accent ? "#111110" : "#dedcd8"} />
          <text x={b.x + (b.w ?? 84) / 2} y={b.y + 16.5} textAnchor="middle" className="font-mono" fontSize="9.5" fill={b.accent ? "#fbfbfa" : "#3b3b39"}>
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ProjectDiagram({ kind }: { kind: string }) {
  switch (kind) {
    case "customs":
      return (
        <Diagram
          label="Customs clearance system: shipments from shipping lines flow through the clearance workflow, connected to the messages department, custodies and staff navigation"
          boxes={[
            { x: 8, y: 20, label: "CMA CGM" },
            { x: 118, y: 20, label: "MSC" },
            { x: 228, y: 20, label: "TARROS" },
            { x: 118, y: 72, label: "clearance flow", accent: true },
            { x: 8, y: 124, label: "messages dept" },
            { x: 118, y: 124, label: "custodies" },
            { x: 228, y: 124, label: "staff navigation" },
          ]}
          edges={[[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6]]}
        />
      );
    case "crm":
      return (
        <Diagram
          label="CRM platform: GitHub Actions builds Docker images and deploys to EC2 in two regions behind ALB and CloudFront, running Spring Cloud services on RDS MySQL"
          boxes={[
            { x: 8, y: 20, label: "GitHub Actions", accent: true },
            { x: 118, y: 20, label: "Docker · sha tag" },
            { x: 228, y: 20, label: "UAT · Mumbai" },
            { x: 8, y: 72, label: "CloudFront" },
            { x: 118, y: 72, label: "ALB" },
            { x: 228, y: 72, label: "prod · N.Va", accent: true },
            { x: 8, y: 124, label: "API gateway" },
            { x: 118, y: 124, label: "Eureka" },
            { x: 228, y: 124, label: "RDS MySQL" },
          ]}
          edges={[[0, 1], [1, 2], [1, 5], [3, 4], [4, 5], [5, 6], [6, 7], [5, 8]]}
        />
      );
    case "health":
      return (
        <Diagram
          label="Healthcare AI platform: browser extension and desktop app record audio, the transcribe API chunks it with ffmpeg, joins transcripts, and feeds CDI and analytics on Postgres"
          boxes={[
            { x: 8, y: 20, label: "browser ext" },
            { x: 118, y: 20, label: "transcribe API", accent: true },
            { x: 228, y: 20, label: "auth · roles" },
            { x: 8, y: 72, label: "desktop · ONNX" },
            { x: 118, y: 72, label: "ffmpeg chunks" },
            { x: 228, y: 72, label: "chunk join", accent: true },
            { x: 8, y: 124, label: "analytics" },
            { x: 118, y: 124, label: "Postgres" },
            { x: 228, y: 124, label: "CDI · coder" },
          ]}
          edges={[[0, 1], [3, 1], [1, 2], [1, 4], [4, 5], [5, 8], [5, 7], [7, 6], [8, 7]]}
        />
      );
    case "voice":
      return (
        <Diagram
          label="Voice platform architecture: API to Redis DRR dispatcher to workers, telephony and AI pipeline"
          boxes={[
            { x: 8, y: 20, label: "Next.js app" },
            { x: 118, y: 20, label: "153 REST APIs", accent: true },
            { x: 228, y: 20, label: "Stripe" },
            { x: 118, y: 72, label: "Redis · DRR", accent: true },
            { x: 8, y: 124, label: "SQS / SNS" },
            { x: 118, y: 124, label: "call workers" },
            { x: 228, y: 72, label: "Twilio/Telnyx" },
            { x: 228, y: 124, label: "AI → CRM" },
          ]}
          edges={[[0, 1], [1, 2], [1, 3], [3, 5], [5, 6], [5, 7], [1, 4], [4, 5]]}
        />
      );
    case "perf":
      return (
        <Diagram
          label="Loyalty platform: API, MongoDB replica set, export pipeline and region migration"
          boxes={[
            { x: 8, y: 20, label: "Order List API", accent: true },
            { x: 118, y: 20, label: "IXSCAN ✓" },
            { x: 228, y: 20, label: "Mongo primary" },
            { x: 228, y: 72, label: "secondary" },
            { x: 8, y: 72, label: "export (100K+)" },
            { x: 118, y: 72, label: "flat memory", accent: true },
            { x: 8, y: 124, label: "Bahrain" },
            { x: 228, y: 124, label: "Mumbai", accent: true },
          ]}
          edges={[[0, 1], [1, 2], [2, 3], [4, 5], [6, 7]]}
        />
      );
    case "events":
      return (
        <Diagram
          label="E-commerce platform: Shopify webhooks to event bus to notification service"
          boxes={[
            { x: 8, y: 20, label: "Shopify" },
            { x: 118, y: 20, label: "webhooks", accent: true },
            { x: 228, y: 20, label: "MongoDB" },
            { x: 118, y: 72, label: "event sync" },
            { x: 8, y: 124, label: "APNs" },
            { x: 118, y: 124, label: "notify svc", accent: true },
            { x: 228, y: 124, label: "Firebase" },
            { x: 228, y: 72, label: "dashboard" },
          ]}
          edges={[[0, 1], [1, 2], [1, 3], [3, 5], [5, 4], [5, 6], [2, 7]]}
        />
      );
    default:
      return (
        <Diagram
          label="KO-DB: TCP server routing to shards, each with a write-ahead log"
          boxes={[
            { x: 118, y: 14, label: "TCP server", accent: true },
            { x: 118, y: 64, label: "router · hash" },
            { x: 8, y: 116, label: "shard-0" },
            { x: 118, y: 116, label: "shard-1" },
            { x: 228, y: 116, label: "shard-2" },
            { x: 8, y: 64, label: "WAL (gz)", accent: true },
            { x: 228, y: 64, label: "memtable" },
          ]}
          edges={[[0, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6]]}
        />
      );
  }
}
