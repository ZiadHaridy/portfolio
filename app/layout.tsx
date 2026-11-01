import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { profile } from "@/content/profile";

const title = `${profile.name} | ${profile.role}`;
const description =
  "Senior software engineer: backend-heavy (Node.js, Go, Java/Spring, PostgreSQL, MongoDB, Redis, AWS) and full-stack with React, Next.js and React Native. 115× faster APIs, 98% less memory, ~$2K/yr AWS savings. Interactive systems lab inside.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://ziad-dev.com"),
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", url: "https://ziad-dev.com", siteName: "Ziad Ahmed", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ziad Ahmed, Senior Software Engineer" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  authors: [{ name: profile.name }],
  keywords: ["Senior Software Engineer", "Backend Engineer", "Full-stack Engineer", "Node.js", "Go", "Golang", "NestJS", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "AWS", "Next.js", "React Native", "Egypt"],
};

export const viewport: Viewport = {
  themeColor: "#e9e8e5",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressCountry: "EG" },
  alumniOf: "Arab Academy for Science, Technology & Maritime Transport",
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.youtube],
  knowsAbout: ["Backend engineering", "Distributed systems", "Node.js", "Go", "Java", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "AWS", "React", "Next.js", "React Native"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
