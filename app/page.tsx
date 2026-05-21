import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <p className="badge">Demo Mode • No external keys required</p>
      <h1>Exercise lifecycle intelligence for modern response operations.</h1>
      <p>AFTERBURN helps military, emergency management, law enforcement, and interagency teams plan exercises, capture observations, validate findings, generate summaries, and track improvements from one streamlined platform.</p>
      <div className="cta-row">
        <Link href="/command-center" className="btn btn-primary">Open Command Center</Link>
        <Link href="/plan" className="btn btn-secondary">View Lifecycle</Link>
      </div>
      <h2 className="section-title">Core lifecycle</h2>
      <div className="card">Objective → Observation → Finding → Recommendation → POA&amp;M → Lesson</div>
    </section>
  );
}
