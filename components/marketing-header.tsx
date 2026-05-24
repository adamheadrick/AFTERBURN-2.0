import Link from "next/link";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";

const marketingLinks = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Demo", href: "#demo" }
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-night/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[4rem] max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="AFTERBURN Home" className="rounded-md py-1">
          <BrandWordmark className="text-[1.02rem]" />
        </Link>
        <div className="hidden items-center gap-5 text-sm text-steel md:flex">
          {marketingLinks.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </div>
        <ButtonLink href="/command-center" variant="subtle">
          Open Command Center
        </ButtonLink>
      </nav>
    </header>
  );
}
