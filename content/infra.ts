/**
 * Sanitized production architecture of the salon & barber booking platform.
 * No domains, IPs, bucket/role/topic names or personal emails: safe to publish.
 * Coordinates are in a 1600 × 1010 canvas (see components/Infra.tsx).
 */

export type InfraNode = { id: string; x: number; y: number; icon: string; label: string; sub?: string; sub2?: string };
export type InfraGroup = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  icon?: string;
  tone: "plain" | "aws" | "region" | "s3" | "ec2";
};
export type InfraEdge = {
  id: string;
  pts: [number, number][];
  label?: string;
  lx?: number;
  ly?: number;
  anchor?: "start" | "middle" | "end";
  arrow?: boolean;
  /** Only drawn while highlighted: its segments are already drawn by other edges. */
  ghost?: boolean;
};
export type InfraStep = { edges: string[]; nodes: string[]; text: string };
export type InfraScenario = { id: string; label: string; steps: InfraStep[] };

export const infraFacts = [
  { value: "10", label: "AWS services, one region" },
  { value: "0", label: "SSH ports open: deploys go through Systems Manager" },
  { value: "5", label: "apps: 2 mobile, 3 web" },
  { value: "1", label: "pipeline from commit to production" },
];

export const infraGroups: InfraGroup[] = [
  { id: "people", x: 30, y: 50, w: 230, h: 730, title: "People", icon: "g-people", tone: "plain" },
  { id: "cloudflare", x: 290, y: 50, w: 240, h: 730, title: "Cloudflare", icon: "g-cloudflare", tone: "plain" },
  { id: "aws", x: 560, y: 30, w: 1010, h: 750, title: "AWS Cloud", icon: "g-aws", tone: "aws" },
  { id: "region", x: 775, y: 75, w: 780, h: 680, title: "Region · EU (single region)", icon: "g-region", tone: "region" },
  { id: "s3", x: 905, y: 100, w: 310, h: 140, title: "Amazon S3", tone: "s3" },
  { id: "ec2", x: 905, y: 285, w: 430, h: 210, title: "EC2 t4g.small (ARM) · Docker", icon: "g-ec2", tone: "ec2" },
  { id: "outside", x: 560, y: 810, w: 720, h: 180, title: "Outside services", icon: "g-cloud", tone: "plain" },
  { id: "github", x: 1310, y: 810, w: 260, h: 180, title: "GitHub", icon: "g-cloud", tone: "plain" },
];

export const infraNodes: InfraNode[] = [
  { id: "cust", x: 140, y: 150, icon: "phone", label: "Customer app", sub: "iOS · Android" },
  { id: "partner", x: 140, y: 360, icon: "phone", label: "Partner app", sub: "iOS · Android" },
  { id: "web", x: 140, y: 460, icon: "browser", label: "Website", sub: "marketing site" },
  { id: "pdash", x: 140, y: 580, icon: "browser", label: "Partner dashboard", sub: "salons & barbers" },
  { id: "admin", x: 140, y: 700, icon: "browser", label: "Admin panel", sub: "internal" },
  { id: "dns", x: 410, y: 240, icon: "dns", label: "DNS", sub: "every app subdomain" },
  { id: "mail", x: 410, y: 450, icon: "email-routing", label: "Email Routing", sub: "support@ → private inbox" },
  { id: "pages", x: 410, y: 580, icon: "pages", label: "Pages", sub: "website · dashboard · admin" },
  { id: "zt", x: 410, y: 700, icon: "zero-trust", label: "Zero Trust Access", sub: "Google sign-in, owner only" },
  { id: "cdn", x: 680, y: 150, icon: "cloudfront", label: "CloudFront", sub: "CDN for photos" },
  { id: "acm", x: 680, y: 450, icon: "acm", label: "Certificate Manager", sub: "TLS for the CDN domain" },
  { id: "iam", x: 680, y: 620, icon: "iam", label: "IAM roles", sub: "instance role", sub2: "CI deploy role" },
  { id: "eip", x: 830, y: 360, icon: "elastic-ip", label: "Elastic IP", sub: "static public IP" },
  { id: "s3pub", x: 980, y: 150, icon: "s3", label: "Public photos", sub: "media bucket" },
  { id: "s3priv", x: 1125, y: 150, icon: "s3", label: "Private ID files", sub: "documents bucket" },
  { id: "caddy", x: 976, y: 360, icon: "caddy", label: "Caddy", sub: "HTTPS" },
  { id: "api", x: 1125, y: 360, icon: "node", label: "API", sub: "Node.js · Express 5" },
  { id: "redis", x: 1265, y: 360, icon: "redis", label: "Redis", sub: "short-lived counters" },
  { id: "cw", x: 1460, y: 150, icon: "cloudwatch", label: "CloudWatch Logs", sub: "every container's log" },
  { id: "ecr", x: 1460, y: 400, icon: "ecr", label: "ECR", sub: "API images" },
  { id: "sns", x: 845, y: 610, icon: "sns", label: "SNS", sub: "email events" },
  { id: "ses", x: 995, y: 610, icon: "ses", label: "SES", sub: "transactional email" },
  { id: "ssm", x: 1460, y: 610, icon: "ssm", label: "Systems Manager", sub: "Parameter Store", sub2: "Run Cmd · Session Mgr" },
  { id: "mongo", x: 740, y: 886, icon: "mongodb", label: "MongoDB Atlas", sub: "managed cluster" },
  { id: "sms", x: 860, y: 886, icon: "sms", label: "SMS OTP", sub: "phone sign-in codes" },
  { id: "expo", x: 980, y: 886, icon: "expo", label: "Expo push", sub: "APNs, FCM → phones" },
  { id: "google", x: 1100, y: 886, icon: "google", label: "Google Sign-In", sub: "token check" },
  { id: "apple", x: 1220, y: 886, icon: "apple", label: "Apple Sign-In", sub: "token check" },
  { id: "gha", x: 1440, y: 890, icon: "github-actions", label: "GitHub Actions", sub: "test, build ARM image" },
];

const bus = (x: number): [number, number][] => [[1200, 495], [1200, 795], [x, 795], [x, 862]];

export const infraEdges: InfraEdge[] = [
  { id: "cust-cdn", pts: [[166, 150], [654, 150]], label: "photos · media subdomain · DNS only", lx: 420, ly: 142 },
  { id: "cust-branch", pts: [[280, 150], [280, 360]], arrow: false },
  { id: "partner-api", pts: [[166, 360], [804, 360]], label: "API · api subdomain · DNS only", lx: 420, ly: 352 },
  { id: "cust-api", pts: [[166, 150], [280, 150], [280, 360], [804, 360]], ghost: true },
  { id: "web-pages", pts: [[166, 460], [275, 460], [275, 580], [379, 580]], arrow: false },
  { id: "pdash-pages", pts: [[166, 580], [379, 580]], label: "loads", lx: 300, ly: 572 },
  { id: "admin-zt", pts: [[166, 700], [379, 700]], label: "sign-in gate", lx: 300, ly: 692 },
  { id: "zt-pages", pts: [[410, 676], [410, 642]] },
  { id: "pages-api", pts: [[434, 580], [785, 580], [785, 360], [804, 360]], label: "browser calls the API", lx: 610, ly: 572 },
  { id: "cdn-s3", pts: [[704, 150], [954, 150]], label: "reads photos", lx: 830, ly: 142 },
  { id: "eip-caddy", pts: [[854, 360], [952, 360]] },
  { id: "caddy-api", pts: [[1000, 360], [1100, 360]], label: "proxy", lx: 1050, ly: 352 },
  { id: "api-redis", pts: [[1150, 360], [1240, 360]], label: "counters", lx: 1195, ly: 352 },
  { id: "api-s3", pts: [[1125, 336], [1125, 242]], label: "uploads · signed links", lx: 1135, ly: 268, anchor: "start" },
  { id: "ec2-cw", pts: [[1335, 310], [1460, 310], [1460, 216]], label: "logs", lx: 1400, ly: 302 },
  { id: "ecr-ec2", pts: [[1436, 400], [1338, 400]], label: "image", lx: 1390, ly: 392 },
  { id: "api-ses", pts: [[1080, 495], [1080, 545], [995, 545], [995, 586]], label: "sends email", lx: 1085, ly: 538, anchor: "start" },
  { id: "ses-sns", pts: [[971, 610], [869, 610]], label: "bounces", lx: 920, ly: 602 },
  { id: "sns-eip", pts: [[845, 586], [845, 424]], label: "bounce webhook", lx: 853, ly: 505, anchor: "start" },
  { id: "ssm-ec2", pts: [[1436, 610], [1300, 610], [1300, 498]], label: "settings · Run Command", lx: 1370, ly: 602 },
  { id: "gha-ssm", pts: [[1440, 866], [1440, 795], [1535, 795], [1535, 610], [1486, 610]], label: "deploy", lx: 1488, ly: 787 },
  { id: "gha-ecr", pts: [[1464, 890], [1556, 890], [1556, 400], [1486, 400]], label: "push image", lx: 1508, ly: 882 },
  { id: "api-bus", pts: [[1200, 495], [1200, 795]], arrow: false, label: "the API calls", lx: 1208, ly: 788, anchor: "start" },
  { id: "bus", pts: [[740, 795], [1220, 795]], arrow: false },
  ...[740, 860, 980, 1100, 1220].map((x, i) => ({ id: `drop-${i}`, pts: [[x, 795], [x, 862]] as [number, number][] })),
  { id: "api-mongo", pts: bus(740), ghost: true },
  { id: "api-sms", pts: bus(860), ghost: true },
  { id: "api-expo", pts: bus(980), ghost: true },
  { id: "api-google", pts: bus(1100), ghost: true },
  { id: "api-apple", pts: bus(1220), ghost: true },
];

export const infraScenarios: InfraScenario[] = [
  {
    id: "book",
    label: "Book an appointment",
    steps: [
      { edges: ["cust-api"], nodes: ["cust", "dns", "eip"], text: "The customer app calls the API. Cloudflare only answers DNS, so the phone talks straight to AWS: no extra hop." },
      { edges: ["eip-caddy", "caddy-api"], nodes: ["eip", "caddy", "api"], text: "Caddy terminates HTTPS on the instance and proxies to the Node.js API. Only ports 80 and 443 are open." },
      { edges: ["api-redis"], nodes: ["api", "redis"], text: "Short-lived counters live in Redis, right next to the API on the same box." },
      { edges: ["api-mongo"], nodes: ["api", "mongo"], text: "The booking is written to MongoDB Atlas, a managed cluster outside AWS." },
      { edges: ["api-expo"], nodes: ["api", "expo"], text: "A push notification goes out through Expo to APNs and FCM." },
    ],
  },
  {
    id: "id",
    label: "Upload an ID",
    steps: [
      { edges: ["partner-api"], nodes: ["partner", "dns", "eip"], text: "An ID document is uploaded from the app, part of the safety checks for home visits." },
      { edges: ["eip-caddy", "caddy-api"], nodes: ["eip", "caddy", "api"], text: "HTTPS ends at Caddy, which hands the upload to the API." },
      { edges: ["api-s3"], nodes: ["api", "s3priv"], text: "The file lands in a private S3 bucket. It can only be read back through a short-lived signed link." },
    ],
  },
  {
    id: "photos",
    label: "Load photos",
    steps: [
      { edges: ["cust-cdn"], nodes: ["cust", "cdn", "acm"], text: "Salon photos load from the media subdomain, served by CloudFront with an ACM certificate." },
      { edges: ["cdn-s3"], nodes: ["cdn", "s3pub"], text: "CloudFront reads the public photos bucket, so the API never spends a cycle serving images." },
    ],
  },
  {
    id: "email",
    label: "Email & bounces",
    steps: [
      { edges: ["api-ses"], nodes: ["api", "ses"], text: "The API sends transactional email through SES." },
      { edges: ["ses-sns"], nodes: ["ses", "sns"], text: "Bounces and complaints are published to an SNS topic." },
      { edges: ["sns-eip", "eip-caddy", "caddy-api"], nodes: ["sns", "eip", "caddy", "api"], text: "SNS calls a webhook on the API, so bad addresses are handled automatically." },
    ],
  },
  {
    id: "deploy",
    label: "Ship a release",
    steps: [
      { edges: ["gha-ecr"], nodes: ["gha", "ecr"], text: "GitHub Actions runs the tests, builds an ARM image and pushes it to ECR." },
      { edges: ["gha-ssm"], nodes: ["gha", "ssm", "iam"], text: "The pipeline deploys through Systems Manager with a scoped CI role. No SSH keys exist anywhere." },
      { edges: ["ssm-ec2", "ecr-ec2"], nodes: ["ssm", "ecr", "caddy", "api", "redis"], text: "Run Command pulls the new image onto the instance; settings come from Parameter Store." },
      { edges: ["ec2-cw"], nodes: ["cw"], text: "Every container's log streams to CloudWatch." },
    ],
  },
  {
    id: "admin",
    label: "Admin sign-in",
    steps: [
      { edges: ["admin-zt"], nodes: ["admin", "zt"], text: "The admin panel sits behind Cloudflare Zero Trust: Google sign-in, owner only." },
      { edges: ["zt-pages"], nodes: ["zt", "pages"], text: "Only after that check does Cloudflare Pages serve the admin app." },
      { edges: ["pages-api"], nodes: ["pages", "eip"], text: "The browser then calls the API directly, the same way the mobile apps do." },
    ],
  },
];
