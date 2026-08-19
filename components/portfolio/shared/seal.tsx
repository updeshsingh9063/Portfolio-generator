import { cn } from "@/lib/utils";

/**
 * Rotating circular seal with a center monogram — the reference's gold stamp.
 * Text runs around a circle; the whole ring rotates slowly (CSS, reduced-motion safe).
 */
export function Seal({
  text = "Available for freelance projects",
  monogram = "A",
  className,
  size = 120,
}: {
  text?: string;
  monogram?: string;
  className?: string;
  size?: number;
}) {
  const repeated = ` ${text} • `.toUpperCase();
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" className="size-full animate-spin-slow text-accent-deep">
        <defs>
          <path id="seal-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-current" style={{ fontSize: "8.5px", letterSpacing: "1.5px" }}>
          <textPath href="#seal-circle" startOffset="0">
            {repeated.repeat(2)}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-3xl font-medium text-accent">{monogram}</span>
      </div>
    </div>
  );
}
