export const About = () => {
  return (
    <div className="page-container about-page">
      <div className="page-header apple-reveal">
        <div className="badge-pill">Technical Architecture</div>
        <h1 className="page-heading">System Design & Architecture</h1>
        <p className="page-subheading">
          CreatorIQ is built to handle YouTube data ingestion, view curve forecasting, and real-time sponsorship valuation.
        </p>
      </div>

      {/* Architecture Overview Diagram Card */}
      <section className="architecture-diagram-section glass-panel apple-reveal delay-1">
        <h2 className="section-title">Data Pipeline Architecture</h2>
        <p className="section-subtext">End-to-end data flow from YouTube ingestion to client dashboard:</p>

        <div className="diagram-flow">
          <div className="flow-step apple-reveal delay-1">
            <div className="step-badge">1. INGESTION</div>
            <div className="step-card">
              <h4>YouTube Data API</h4>
              <p>Fetches channel metadata, recent video catalog, and viewership statistics</p>
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step apple-reveal delay-2">
            <div className="step-badge">2. QUEUE & JOBS</div>
            <div className="step-card">
              <h4>BullMQ & Redis</h4>
              <p>Manages background ingestion tasks and rate limits external API quotas</p>
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step apple-reveal delay-3">
            <div className="step-badge">3. DATA STORE</div>
            <div className="step-card">
              <h4>PostgreSQL & TimescaleDB</h4>
              <p>Stores historical view snapshots partitioned by time for fast trend analysis</p>
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step apple-reveal delay-4">
            <div className="step-badge">4. API & CLIENT</div>
            <div className="step-card">
              <h4>Fastify & React</h4>
              <p>Computes logarithmic regressions and delivers responsive client dashboards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <div className="pillars-grid">
        <div className="pillar-card glass-panel apple-reveal delay-1">
          <div className="pillar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3>Fastify Backend Engine</h3>
          <p>
            Built on Fastify for low-overhead HTTP routing and real-time streaming capability. Handles channel lookups, valuation calculations, and curve fitting with sub-10ms response times.
          </p>
        </div>

        <div className="pillar-card glass-panel apple-reveal delay-2">
          <div className="pillar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
          </div>
          <h3>Time-Series Storage</h3>
          <p>
            Configured with TimescaleDB hypertables to partition hourly channel view snapshots, maintaining rapid query performance across long historical creator datasets.
          </p>
        </div>

        <div className="pillar-card glass-panel apple-reveal delay-3">
          <div className="pillar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>AI Context Validation</h3>
          <p>
            Uses Gemini AI to review estimated view ceilings against catalog historical averages, ensuring outlier videos or sudden view spikes are flagged with appropriate confidence bands.
          </p>
        </div>

        <div className="pillar-card glass-panel apple-reveal delay-4">
          <div className="pillar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h3>Logarithmic View Forecast</h3>
          <p>
            Video view counts flatten over time as algorithmic distribution stabilizes. The engine uses non-linear least squares to fit early hourly views to the saturation ceiling formula \(V(t) = V_{'{max}'}(1 - e^{'-kt'})\).
          </p>
        </div>
      </div>

      {/* Deployment Note */}
      <section className="deploy-info-card glass-panel apple-reveal delay-2">
        <div className="deploy-info-left">
          <h3>🚀 Cloud Deployment Ready</h3>
          <p>
            Configured with a native <code>render.yaml</code> blueprint. Deploy the Web Service, Static Frontend, Redis, and Database directly to Render with a single git push.
          </p>
        </div>
        <a
          href="https://github.com/Tahir-CS/Yt-Analysis-Engine"
          target="_blank"
          rel="noreferrer"
          className="primary-btn"
        >
          View Source Repository ➔
        </a>
      </section>
    </div>
  );
};
