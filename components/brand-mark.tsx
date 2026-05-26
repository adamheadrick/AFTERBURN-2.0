type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className = "", compact = false }: BrandLogoProps) {
  return (
    <span
      className={`brand-logo inline-flex shrink-0 items-center ${compact ? "brand-logo-compact" : ""} ${className}`}
      aria-label="AFTERBURN"
      role="img"
    >
      <span className="brand-logo-text">AFTERBURN</span>
    </span>
  );
}

export function BrandBadge({ className = "" }: { className?: string }) {
  return <BrandLogo className={className} compact />;
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return <BrandLogo className={className} />;
}

export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`brand-mark inline-flex shrink-0 items-center justify-center ${className}`} aria-label="AFTERBURN" role="img">
      <span>A</span>
    </span>
  );
}
