import { techIcon } from "@/lib/techIcons";

/** Pill with the technology's real logo (when we have one). */
export function TechChip({ label, className = "" }: { label: string; className?: string }) {
  const icon = techIcon(label);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full ${className}`}>
      {icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" aria-hidden width={14} height={14} className="h-3.5 w-3.5 shrink-0 object-contain" loading="lazy" />
      )}
      {label}
    </span>
  );
}
