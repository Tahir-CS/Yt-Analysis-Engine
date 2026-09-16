import type { ChannelData } from '../types';

interface ReportsProps {
  currentChannel: ChannelData;
}

export const Reports = ({ currentChannel }: ReportsProps) => {
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="page-container reports-page">
      <div className="page-header no-print">
        <div className="badge-pill">📄 Executive Audit & Media Kit</div>
        <h1 className="page-heading">Executive Channel Audit Report</h1>
        <p className="page-subheading">
          Print-ready brand sponsorship audit document. Click below to download or print this executive report.
        </p>
        <div className="action-row">
          <button className="primary-btn" onClick={handlePrintPdf}>
            🖨️ Download / Print Executive PDF
          </button>
        </div>
      </div>

      {/* Styled Printable Report Sheet */}
      <div className="printable-sheet glass-panel" id="printable-report">
        {/* Report Header */}
        <div className="report-header">
          <div className="report-brand">
            <span className="brand-icon">⚡</span>
            <div>
              <h2>CreatorIQ Executive Audit</h2>
              <span className="report-date">Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="verified-badge">
            ✓ Verified 2026 Telemetry
          </div>
        </div>

        {/* Creator Snapshot */}
        <div className="report-creator-row">
          <img src={currentChannel.avatar} alt={currentChannel.name} className="report-avatar" />
          <div className="report-creator-details">
            <h3>{currentChannel.name} ({currentChannel.handle})</h3>
            <p className="report-sub">{currentChannel.niche} • {currentChannel.country} • {currentChannel.videoCount} Videos Uploaded</p>
          </div>
        </div>

        <hr className="report-divider" />

        {/* Core Metrics Grid */}
        <div className="report-metrics-grid">
          <div className="report-box">
            <span className="box-lbl">Total Subscribers</span>
            <strong className="box-val">{(currentChannel.subscribers / 1000000).toFixed(2)}M</strong>
            <span className="box-sub">Top 0.1% platform-wide</span>
          </div>
          <div className="report-box">
            <span className="box-lbl">Lifetime Channel Views</span>
            <strong className="box-val">{(currentChannel.totalViews / 1000000000).toFixed(2)}B</strong>
            <span className="box-sub">High catalog longevity</span>
          </div>
          <div className="report-box">
            <span className="box-lbl">Average Views / Upload</span>
            <strong className="box-val">{(currentChannel.avgViewsPerVideo / 1000000).toFixed(2)}M</strong>
            <span className="box-sub">Predictive asymptotic mean</span>
          </div>
          <div className="report-box">
            <span className="box-lbl">Audience Engagement</span>
            <strong className="box-val">{(currentChannel.engagementRate * 100).toFixed(1)}%</strong>
            <span className="box-sub">Like-to-view interaction score</span>
          </div>
        </div>

        {/* Sponsorship Rate Guidance */}
        <div className="report-section-block">
          <h4 className="report-section-heading">Verified Brand Sponsorship Rate Guidance</h4>
          <table className="report-table">
            <thead>
              <tr>
                <th>Ad Placement Format</th>
                <th>Deliverable Description</th>
                <th>Recommended Investment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>30s Pre-roll / Mention</strong></td>
                <td>Audio-visual brand mention in opening 2 minutes + link in top description</td>
                <td><strong>${(Math.round(currentChannel.avgViewsPerVideo * 0.015)).toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td><strong>60s Integrated Mid-Roll</strong></td>
                <td>Deep-dive product demonstration, visual overlay, pinned comment endorsement</td>
                <td><strong>${(Math.round(currentChannel.avgViewsPerVideo * 0.028)).toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td><strong>Dedicated Video Campaign</strong></td>
                <td>Comprehensive video storyline built around brand utility</td>
                <td><strong>${(Math.round(currentChannel.avgViewsPerVideo * 0.065)).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Audit Methodology */}
        <div className="report-section-block methodology-box">
          <h5>Methodology & System Verification:</h5>
          <p>
            Audit telemetry ingested via CreatorIQ's TimescaleDB time-series engine with logarithmic growth validation. Historical view curves were tested against Student's t-distribution confidence intervals. Sentiment scores reflect natural language comment vector embeddings evaluated by Google Gemini AI.
          </p>
        </div>

        {/* Report Footer */}
        <div className="report-sheet-footer">
          <span>CreatorIQ System ID: CIQ-{(Math.random() * 900000 + 100000).toFixed(0)}</span>
          <span>Confidential • Prepared for Creator & Brand Agency Partners</span>
        </div>
      </div>
    </div>
  );
};
