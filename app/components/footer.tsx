import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="container footer-wrap">
        <section>
          <div className="brand">AFTERBURN</div>
          <p className="muted">Exercise lifecycle intelligence for modern response operations.</p>
          <p className="muted">Plan better. Capture reality. Drive improvement.</p>
        </section>
        <section className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/command-center">Command Center</Link></li>
            <li><Link href="/plan">Lifecycle</Link></li>
            <li><Link href="/library">Library</Link></li>
          </ul>
        </section>
        <section className="footer-col">
          <h4>Outputs</h4>
          <ul>
            <li>Commander Summary</li>
            <li>Exercise Placemat</li>
            <li>AAR Generator</li>
            <li>POA&amp;M Tracker</li>
          </ul>
        </section>
        <section className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>Contact</li>
            <li>Request Demo</li>
            <li>Partner / Integration Inquiry</li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
