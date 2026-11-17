import Image from "next/image";

type Props = {
  /** Visual height in px */
  height?: number;
  className?: string;
  /** Prefer mark-only look on very small slots (still uses full asset) */
  compact?: boolean;
};

/** Official LegitScan wordmark + shield. */
export function BrandLogo({ height = 36, className = "", compact = false }: Props) {
  const h = compact ? Math.min(height, 32) : height;
  return (
    <Image
      src="/brand/legitscan-logo.png"
      alt="LegitScan"
      width={Math.round(h * 3.6)}
      height={h}
      className={`object-contain object-left ${className}`.trim()}
      style={{ height: h, width: "auto" }}
      priority
    />
  );
}
