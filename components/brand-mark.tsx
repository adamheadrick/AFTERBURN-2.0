function AfterburnAGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" role="img">
      <defs>
        <linearGradient id="afterburn-a-flame" x1="21" x2="43" y1="46" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f08a4f" />
          <stop offset="0.52" stopColor="#f6b347" />
          <stop offset="1" stopColor="#ffd166" />
        </linearGradient>
        <clipPath id="afterburn-a-counter">
          <path d="M32 18 43 47H21L32 18Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#afterburn-a-counter)">
        <path d="M31.8 11.5 45 50H18.5L31.8 11.5Z" fill="url(#afterburn-a-flame)" />
        <path d="M20 50 31.8 11.5 44.5 50H20Z" fill="url(#afterburn-a-flame)" opacity="0.72" />
      </g>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 60 27.5 4h9L59 60H46.3l-5-12.4H22.7L17.7 60H5Zm22.5-24.8h9.1L32 21.8l-4.5 13.4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span className={`brand-a-mark inline-flex shrink-0 items-center justify-center ${className}`} aria-hidden="true">
      <AfterburnAGlyph className="h-full w-full" />
    </span>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-type inline-flex items-center gap-2 leading-none text-ink ${className}`} aria-label="AFTERBURN">
      <span>AFTERBURN</span>
      <span className="brand-gradient-line" aria-hidden="true" />
    </span>
  );
}
