/** Animated architecture sketches with real technology logos. */
import { techIcon } from "@/lib/techIcons";

type Box = { col: number; row: number; label: string; icon?: string; accent?: boolean };
type Edge = [number, number];

const W = 108;
const H = 30;
const pos = (b: Box) => ({ x: 6 + b.col * 123, y: 12 + b.row * 58 });
const center = (b: Box) => {
  const p = pos(b);
  return { x: p.x + W / 2, y: p.y + H / 2 };
};

function Diagram({ boxes, edges, label }: { boxes: Box[]; edges: Edge[]; label: string }) {
  return (
    <svg viewBox="0 0 360 170" className="h-full w-full" role="img" aria-label={label}>
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
      {boxes.map((b, i) => {
        const { x, y } = pos(b);
        const src = b.icon ? techIcon(b.icon) ?? `/tech/${b.icon}.svg` : null;
        return (
          <g key={i}>
            <rect x={x} y={y} width={W} height={H} rx="10" fill={b.accent ? "#111110" : "#fbfbfa"} stroke={b.accent ? "#111110" : "#dedcd8"} />
            {src && (
              <>
                <rect x={x + 6} y={y + 6} width="18" height="18" rx="5" fill={b.accent ? "#fbfbfa" : "#f3f3f1"} />
                <image href={src} x={x + 8.5} y={y + 8.5} width="13" height="13" preserveAspectRatio="xMidYMid meet" />
              </>
            )}
            <text
              x={src ? x + 30 : x + W / 2}
              y={y + 18.5}
              textAnchor={src ? "start" : "middle"}
              className="font-mono"
              fontSize={Math.min(9.5, ((src ? W - 36 : W - 12) / b.label.length) / 0.6).toFixed(2)}
              fill={b.accent ? "#fbfbfa" : "#3b3b39"}
            >
              {b.label}
            </text>
          </g>
        );
      })}
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
            { col: 0, row: 0, label: "CMA CGM" },
            { col: 1, row: 0, label: "MSC" },
            { col: 2, row: 0, label: "TARROS" },
            { col: 1, row: 1, label: "clearance flow", accent: true },
            { col: 0, row: 2, label: "messages dept" },
            { col: 1, row: 2, label: "custodies" },
            { col: 2, row: 2, label: "staff navigation" },
          ]}
          edges={[[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6]]}
        />
      );
    case "crm":
      return (
        <Diagram
          label="CRM platform: GitHub Actions builds Docker images and deploys to EC2 in two regions behind ALB and CloudFront, running Spring Cloud services on RDS MySQL"
          boxes={[
            { col: 0, row: 0, label: "GitHub Actions", icon: "GitHub Actions", accent: true },
            { col: 1, row: 0, label: "image:sha", icon: "Docker" },
            { col: 2, row: 0, label: "UAT · Mumbai", icon: "EC2" },
            { col: 0, row: 1, label: "CloudFront", icon: "CloudFront" },
            { col: 1, row: 1, label: "ALB", icon: "ALB" },
            { col: 2, row: 1, label: "prod · N.Va", icon: "EC2", accent: true },
            { col: 0, row: 2, label: "API gateway", icon: "Spring Cloud" },
            { col: 1, row: 2, label: "Eureka", icon: "Spring Cloud" },
            { col: 2, row: 2, label: "RDS MySQL", icon: "RDS MySQL" },
          ]}
          edges={[[0, 1], [1, 2], [1, 5], [3, 4], [4, 5], [5, 6], [6, 7], [5, 8]]}
        />
      );
    case "health":
      return (
        <Diagram
          label="Healthcare AI platform: browser extension and desktop app record audio, the transcribe API chunks it with ffmpeg, joins transcripts, and feeds CDI and analytics on Postgres"
          boxes={[
            { col: 0, row: 0, label: "browser ext" },
            { col: 1, row: 0, label: "transcribe API", icon: "Node.js", accent: true },
            { col: 2, row: 0, label: "auth · roles" },
            { col: 0, row: 1, label: "wake word", icon: "ONNX" },
            { col: 1, row: 1, label: "ffmpeg chunks", icon: "ffmpeg" },
            { col: 2, row: 1, label: "chunk join", accent: true },
            { col: 0, row: 2, label: "analytics", icon: "React" },
            { col: 1, row: 2, label: "Postgres", icon: "PostgreSQL" },
            { col: 2, row: 2, label: "CDI · coder" },
          ]}
          edges={[[0, 1], [3, 1], [1, 2], [1, 4], [4, 5], [5, 8], [5, 7], [7, 6], [8, 7]]}
        />
      );
    case "voice":
      return (
        <Diagram
          label="Voice platform architecture: Next.js app and Node API, Redis DRR dispatcher, SQS/SNS, call workers, Twilio/Telnyx telephony and an AI post-call pipeline"
          boxes={[
            { col: 0, row: 0, label: "Next.js app", icon: "Next.js" },
            { col: 1, row: 0, label: "153 APIs", icon: "Node.js", accent: true },
            { col: 2, row: 0, label: "Stripe", icon: "Stripe" },
            { col: 1, row: 1, label: "Redis · DRR", icon: "Redis", accent: true },
            { col: 0, row: 2, label: "SQS / SNS", icon: "SQS" },
            { col: 1, row: 2, label: "call workers", icon: "Docker" },
            { col: 2, row: 1, label: "Twilio/Telnyx", icon: "Twilio" },
            { col: 2, row: 2, label: "AI → CRM" },
            { col: 0, row: 1, label: "MongoDB", icon: "MongoDB" },
          ]}
          edges={[[0, 1], [1, 2], [1, 3], [3, 5], [5, 6], [5, 7], [1, 4], [4, 5], [1, 8]]}
        />
      );
    case "perf":
      return (
        <Diagram
          label="Loyalty platform: Node API restored to MongoDB index scans, replica set, a flat-memory export pipeline, and the Bahrain to Mumbai AWS region migration"
          boxes={[
            { col: 0, row: 0, label: "Order List API", icon: "Node.js", accent: true },
            { col: 1, row: 0, label: "IXSCAN ✓", icon: "MongoDB" },
            { col: 2, row: 0, label: "primary", icon: "MongoDB" },
            { col: 2, row: 1, label: "secondary", icon: "MongoDB" },
            { col: 0, row: 1, label: "export 100K+", icon: "Node.js" },
            { col: 1, row: 1, label: "flat memory", accent: true },
            { col: 0, row: 2, label: "Bahrain", icon: "AWS" },
            { col: 2, row: 2, label: "Mumbai", icon: "AWS", accent: true },
          ]}
          edges={[[0, 1], [1, 2], [2, 3], [4, 5], [6, 7]]}
        />
      );
    case "events":
      return (
        <Diagram
          label="E-commerce platform: Shopify webhooks into a Node service and MongoDB, event sync, and a notification service on APNs and Firebase"
          boxes={[
            { col: 0, row: 0, label: "Shopify", icon: "Shopify" },
            { col: 1, row: 0, label: "webhooks", icon: "Node.js", accent: true },
            { col: 2, row: 0, label: "MongoDB", icon: "MongoDB" },
            { col: 1, row: 1, label: "event sync" },
            { col: 0, row: 2, label: "APNs", icon: "APNs" },
            { col: 1, row: 2, label: "notify svc", icon: "Node.js", accent: true },
            { col: 2, row: 2, label: "Firebase", icon: "Firebase" },
            { col: 2, row: 1, label: "dashboard" },
          ]}
          edges={[[0, 1], [1, 2], [1, 3], [3, 5], [5, 4], [5, 6], [2, 7]]}
        />
      );
    case "booking":
      return (
        <Diagram
          label="Booking platform: mobile apps reach Caddy and a Node.js API on one EC2 instance, with Redis, MongoDB Atlas, S3 behind CloudFront, and SES for email"
          boxes={[
            { col: 0, row: 0, label: "mobile apps", icon: "React Native" },
            { col: 1, row: 0, label: "Cloudflare", icon: "Cloudflare" },
            { col: 2, row: 0, label: "CloudFront", icon: "CloudFront" },
            { col: 1, row: 1, label: "Node API · EC2", icon: "Node.js", accent: true },
            { col: 0, row: 1, label: "Redis", icon: "Redis" },
            { col: 2, row: 1, label: "S3", icon: "S3" },
            { col: 0, row: 2, label: "MongoDB", icon: "MongoDB" },
            { col: 1, row: 2, label: "SES · SNS", icon: "SES" },
            { col: 2, row: 2, label: "GH Actions", icon: "GitHub Actions" },
          ]}
          edges={[[0, 1], [0, 3], [0, 2], [2, 5], [3, 4], [3, 5], [3, 6], [3, 7], [8, 3]]}
        />
      );
    default:
      return (
        <Diagram
          label="KO-DB: a Go TCP server routing keys to shards, each backed by a write-ahead log"
          boxes={[
            { col: 1, row: 0, label: "TCP server", icon: "Go", accent: true },
            { col: 1, row: 1, label: "router · hash", icon: "Go" },
            { col: 0, row: 2, label: "shard-0" },
            { col: 1, row: 2, label: "shard-1" },
            { col: 2, row: 2, label: "shard-2" },
            { col: 0, row: 1, label: "WAL (gz)", accent: true },
            { col: 2, row: 1, label: "memtable" },
          ]}
          edges={[[0, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6]]}
        />
      );
  }
}
