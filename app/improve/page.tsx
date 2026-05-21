export default function ImprovePage() {
  return (
    <section>
      <h1>Improve</h1>
      <p className="muted">Demo workflow content for the improve stage of the exercise lifecycle.</p>
      <div className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h3>Improve Workflow</h3>
          <p className="muted">This page contains placeholder data to model operational usage in demo mode.</p>
        </article>
        <article className="card">
          <h3>Sample Artifacts</h3>
          <ul className="issue-list">
            <li className="issue-item"><span>Mission thread alignment</span><span className="badge">Tracked</span></li>
            <li className="issue-item"><span>Evaluation criteria pack</span><span className="badge">Ready</span></li>
            <li className="issue-item"><span>Interagency notes</span><span className="badge">Draft</span></li>
          </ul>
        </article>
      </div>
    </section>
  );
}
