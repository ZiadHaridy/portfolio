/**
 * Maps a tech label to a logo in /public/tech/<slug>.svg.
 * Sources: Devicon (MIT), Simple Icons (CC0), AWS Architecture Icons (aws-icons, MIT).
 */
const map: Record<string, string> = {
  // languages
  Go: "go", TypeScript: "typescript", JavaScript: "javascript", Java: "java", Python: "python",
  // backend
  "Node.js": "nodejs", NestJS: "nestjs", Express: "express", "Spring Boot": "spring", "Spring Cloud": "spring",
  GraphQL: "graphql", WebSockets: "socketio", ffmpeg: "ffmpeg", Swagger: "swagger",
  // data
  PostgreSQL: "postgresql", MongoDB: "mongodb", Redis: "redis", MySQL: "mysql", SQLite: "sqlite", "RDS MySQL": "aws-rds",
  // cloud & devops
  AWS: "amazonwebservices", "AWS EC2": "aws-ec2", EC2: "aws-ec2", RDS: "aws-rds", S3: "aws-s3", SQS: "aws-sqs", SNS: "aws-sns",
  SES: "aws-ses", ALB: "aws-alb", CloudFront: "aws-cloudfront", CloudTrail: "aws-cloudtrail", "SQS / SNS": "aws-sqs",
  Docker: "docker", Kubernetes: "kubernetes", Terraform: "terraform", "GitHub Actions": "githubactions", NGINX: "nginx",
  Nginx: "nginx", Cloudflare: "cloudflare",
  // messaging
  RabbitMQ: "rabbitmq", Kafka: "apachekafka",
  // frontend
  React: "react", "Next.js": "nextjs", "React Native": "react", "React Query": "react",
  // testing
  Jest: "jest", Cypress: "cypressio", Mocha: "mocha",
  // integrations
  Stripe: "stripe", Twilio: "twilio", Shopify: "shopify", Firebase: "firebase", APNs: "apple", ONNX: "onnx",
};

export function techIcon(label: string): string | null {
  const slug = map[label] ?? map[label.trim()];
  return slug ? `/tech/${slug}.svg` : null;
}
