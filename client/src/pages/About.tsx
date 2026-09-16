export const About = () => {
  return (
    <div className="page-container about-page">
      <div className="page-header apple-reveal">
        <div className="badge-pill">ℹ️ Production Engineering Breakdown</div>
        <h1 className="page-heading">About CreatorIQ & Enterprise Architecture</h1>
        <p className="page-subheading">
          Built to solve the fundamental data challenges of video content analytics: high-frequency time-series ingestion, non-linear growth curves, and real-time event streaming.
        </p>
      </div>

      {/* Architecture Overview Diagram Card */}
      <section className="architecture-diagram-section glass-panel apple-reveal delay-1">
        <h2 className="section-title">🏗️ High-Throughput System Architecture</h2>
        <p className="section-subtext">Distributed microservice pipeline designed for horizontal scale on Render and cloud containers:</p>

        <div className="diagram-flow">
          <div className="flow-step apple-reveal delay-1">
            <div className="step-badge">1. INGESTION</div>
            <div className="step-card">
              <h4>YouTube & Reddit APIs</h4>
              <p>Polymorphic workers fetch snapshot payloads via token-bucket rate limiters</p>
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step apple-reveal delay-2">
            <div className="step-badge">2. QUEUE & WORKERS</div>
            <div className="step-card">
              <h4>BullMQ + Redis</h4>
              <p>Persisted task queues with exponential backoff and de-duplication</p>
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step apple-reveal delay-3">
            <div className="step-badge">3. TIME-SERIES DB</div>
            <div className="step-card">
              <h4>TimescaleDB + pgvector</h4>
              <p>Hypertables partition metric snapshots; vectors cluster audience sentiment</p>
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step apple-reveal delay-4">
            <div className="step-badge">4. AI & CLIENT</div>
            <div className="step-card">
              <h4>Fastify SSE + React</h4>
              <p>Sub-1ms logarithmic curve fits streamed to browser without polling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <div className="pillars-grid">
        <div className="pillar-card glass-panel apple-reveal delay-1">
          <div className="pillar-icon">⚡</div>
          <h3>Fastify & Server-Sent Events (SSE)</h3>
          <p>
            Standard polling wastes bandwidth with repeated TCP handshakes. Our Fastify gateway subscribes to Redis Pub/Sub channels to push real-time channel velocity updates directly to client browsers over persistent SSE connections.
          </p>
        </div>

        <div className="pillar-card glass-panel apple-reveal delay-2">
          <div className="pillar-icon">📊</div>
          <h3>TimescaleDB Hypertables</h3>
          <p>
            Standard relational tables slow down when millions of hourly snapshots accumulate. TimescaleDB partitions view metrics into automated time chunks, allowing sub-5ms analytical queries across years of historical creator data.
          </p>
        </div>

        <div className="pillar-card glass-panel apple-reveal delay-3">
          <div className="pillar-icon">🤖</div>
          <h3>Gemini AI & pgvector</h3>
          <p>
            We embed audience comments into 768-dimensional float arrays stored in PostgreSQL using the pgvector extension. HNSW cosine similarity indexes cluster audience reaction polarity to power the FYP Viral Radar.
          </p>
        </div>

        <div className="pillar-card glass-panel apple-reveal delay-4">
          <div className="pillar-icon">📐</div>
          <h3>Logarithmic View Prediction</h3>
          <p>
            Videos do not scale linearly. Our mathematical solver evaluates early view velocity to solve for the asymptotic ceiling \(V(t) = V_{'{max}'}(1 - e^{'-kt'})\), bounded by Student's t-distribution confidence intervals.
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
