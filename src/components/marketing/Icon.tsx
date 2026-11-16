type Props = {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
};

/** Material Symbol with reliable sizing (Google’s stylesheet locks 24px otherwise). */
export function Icon({
  name,
  size = 24,
  className = "",
  filled = false,
  weight = 500,
}: Props) {
  const opsz = Math.min(48, Math.max(20, size));

  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={{
        fontSize: size,
        width: size,
        height: size,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${opsz}`,
      }}
      aria-hidden
      // Glyph metrics differ before the icon font loads (SSR vs client)
      suppressHydrationWarning
    >
      {name}
    </span>
  );
}
