/**
 * ZA monogram: Ziad Ahmed's mark / digital signature.
 * Sliced Z (three sheared blocks) + an A cut against a straight stem; the orange
 * dot is the A's crossbar and the signature "period". Source: public/brand/.
 */
export function Logo({ className = "", dot = "#ff5a1f", title = "Ziad Ahmed" }: { className?: string; dot?: string; title?: string }) {
  return (
    <svg viewBox="-2 -2 181 104" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12.00,0.00 L45.00,0.00 L33.00,24.00 L0.00,24.00 Z" />
        <path d="M50.00,0.00 L74.00,0.00 L24.00,100.00 L0.00,100.00 Z" />
        <path d="M41.00,76.00 L86.00,76.00 L74.00,100.00 L29.00,100.00 Z" />
        <path d="M129.00,0.00 L153.00,0.00 L103.00,100.00 L79.00,100.00 Z" />
        <path d="M152.99,0.00 L177.00,0.00 L177.00,100.00 L152.99,100.00 Z" />
      </g>
      <circle cx="137.0" cy="66.0" r="9.5" fill={dot} />
    </svg>
  );
}
