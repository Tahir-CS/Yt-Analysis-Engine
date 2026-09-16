import type { NavTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer = ({ onSelectTab }: FooterProps) => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-name">CreatorIQ</span>
          </div>
          <p className="footer-desc">
            Next-generation 2026 YouTube analytics, logarithmic view prediction, and automated sponsorship valuation engine designed for high-growth creators and brands.
          </p>
          <div className="tech-badge-container">
            <span className="tech-pill">Fastify Node.js</span>
            <span className="tech-pill">BullMQ Redis</span>
            <span className="tech-pill">TimescaleDB</span>
            <span className="tech-pill">Gemini 2.5 AI</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><button onClick={() => onSelectTab('dashboard')}>Channel Dashboard</button></li>
            <li><button onClick={() => onSelectTab('predictor')}>ML Growth Curve</button></li>
            <li><button onClick={() => onSelectTab('fyp-radar')}>FYP Viral Radar</button></li>
            <li><button onClick={() => onSelectTab('valuation')}>Sponsorship CPM</button></li>
            <li><button onClick={() => onSelectTab('reports')}>Executive PDF Audit</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Engineering & Stack</h4>
          <ul className="footer-links">
            <li><button onClick={() => onSelectTab('about')}>System Design</button></li>
            <li><a href="https://github.com/Tahir-CS/Yt-Analysis-Engine" target="_blank" rel="noreferrer">GitHub Repository</a></li>
            <li><a href="https://render.com" target="_blank" rel="noreferrer">Render Cloud Blueprint</a></li>
            <li><button onClick={() => onSelectTab('about')}>pgvector Embeddings</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Contact & Support</h4>
          <p className="footer-subtext">Enterprise inquiries, API integrations, and custom rate card modeling:</p>
          <button className="footer-contact-btn" onClick={() => onSelectTab('contact')}>
            Open Contact Portal ➔
          </button>
          <div className="deploy-badge">
            <span className="deploy-dot"></span>
            <span>Render Deployable v2.0</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © {new Date().getFullYear()} CreatorIQ / YT Analysis Engine. Built for high-throughput 2026 content strategy.
        </div>
        <div className="footer-disclaimer">
          YouTube™ is a registered trademark of Google LLC. This platform is an independent analytics tool.
        </div>
      </div>
    </footer>
  );
};
