import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const styles =
  "inline-flex min-h-7 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition duration-150 active:translate-y-0 focus:outline-none focus:ring-1 focus:ring-flare/60 focus:ring-offset-1 focus:ring-offset-night disabled:cursor-not-allowed disabled:opacity-55 disabled:saturate-50";

const variants = {
  primary: "on-light bg-flare text-night hover:bg-[#e8b957]",
  ember: "on-light bg-ember text-night hover:bg-flare",
  flame: "on-light bg-flare text-night hover:bg-[#e8b957]",
  subtle: "border border-line bg-field text-ink hover:border-[#3a4658] hover:bg-[#151c28]",
  light: "border border-line bg-panel text-ink hover:border-[#3a4658] hover:bg-field",
  ghost: "border border-transparent text-steel hover:border-line hover:bg-field hover:text-ink"
};

type Variant = keyof typeof variants;

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${styles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link className={`${styles} ${variants[variant]} ${className}`} href={href} {...props}>
      {children}
    </Link>
  );
}
