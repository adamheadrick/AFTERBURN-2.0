import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Command Center", "/command-center"],
  ["Plan", "/plan"],
  ["Execute", "/execute"],
  ["Review", "/review"],
  ["Improve", "/improve"],
  ["Library", "/library"]
] as const;

export function Navigation() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">AFTERBURN</Link>
        <nav className="nav-links">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link">{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
