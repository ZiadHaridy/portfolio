"use client";
import { useState } from "react";

export function CopyButton({ value, label = "Copy", className = "" }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* clipboard can be blocked; ignore */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`rounded-full bg-card px-4 py-2 text-xs font-medium text-ink ring-1 ring-black/5 card-shadow transition hover:-translate-y-px active:translate-y-0 ${className}`}
      aria-live="polite"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
