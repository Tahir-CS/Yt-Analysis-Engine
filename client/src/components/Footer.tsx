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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
            <span className="brand-name">CreatorIQ</span>
          </div>
          <p className="footer-desc">
            Channel performance tracking, view growth forecasting, and data-driven sponsorship rate estimation.
          </p>
          <div className="tech-badge-container">
            <span className="tech-pill">TypeScript</span>
            <span className="tech-pill">Fastify</span>
            <span className="tech-pill">React</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><button onClick={() => onSelectTab('dashboard')}>Channel Dashboard</button></li>
            <li><button onClick={() => onSelectTab('predictor')}>View Forecast</button></li>
            <li><button onClick={() => onSelectTab('fyp-radar')}>Hook Analyzer</button></li>
            <li><button onClick={() => onSelectTab('valuation')}>Sponsorship Calculator</button></li>
            <li><button onClick={() => onSelectTab('reports')}>Media Kit</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Engineering</h4>
          <ul className="footer-links">
            <li><button onClick={() => onSelectTab('about')}>System Design</button></li>
            <li><a href="https://github.com/Tahir-CS/Yt-Analysis-Engine" target="_blank" rel="noreferrer">GitHub Repository</a></li>
            <li><a href="https://render.com" target="_blank" rel="noreferrer">Render Deployment</a></li>
            <li><button onClick={() => onSelectTab('about')}>Architecture Docs</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Support</h4>
          <p className="footer-subtext">Questions regarding rate calculations, self-hosting, or custom API integration:</p>
          <button className="footer-contact-btn" onClick={() => onSelectTab('contact')}>
            Get in Touch &rsaquo;
          </button>
          <div className="deploy-badge">
            <span className="deploy-dot"></span>
            <span>Open Source</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © {new Date().getFullYear()} CreatorIQ. Built for creators and brands.
        </div>
        <div className="footer-disclaimer">
          YouTube™ is a registered trademark of Google LLC. CreatorIQ is an independent analytics platform.
        </div>
      </div>
    </footer>
  );
};
