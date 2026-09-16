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
      <div className="page-header no-print apple-reveal">
        <div className="badge-pill">Media Kit & Rates</div>
        <h1 className="page-heading">Channel Media Kit & Rate Sheet</h1>
        <p className="page-subheading">
          Exportable channel overview and estimated rate card for brand outreach and sponsorship pitches.
        </p>
        <div className="action-row">
          <button className="primary-btn" onClick={handlePrintPdf}>
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Styled Printable Report Sheet */}
      <div className="printable-sheet glass-panel apple-reveal delay-1" id="printable-report">
        {/* Report Header */}
        <div className="report-header">
          <div className="report-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <div>
              <h2>CreatorIQ Performance Summary</h2>
              <span className="report-date">Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="verified-badge">
            Channel Overview
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
          <div className="report-box apple-reveal delay-1">
            <span className="box-lbl">Total Subscribers</span>
            <strong className="box-val">{(currentChannel.subscribers / 1000000).toFixed(2)}M</strong>
            <span className="box-sub">Active Channel Reach</span>
          </div>
          <div className="report-box apple-reveal delay-2">
            <span className="box-lbl">Lifetime Channel Views</span>
            <strong className="box-val">{(currentChannel.totalViews / 1000000000).toFixed(2)}B</strong>
            <span className="box-sub">Catalog Views</span>
          </div>
          <div className="report-box apple-reveal delay-3">
            <span className="box-lbl">Average Views / Upload</span>
            <strong className="box-val">{(currentChannel.avgViewsPerVideo / 1000000).toFixed(2)}M</strong>
            <span className="box-sub">Recent Video Baseline</span>
          </div>
          <div className="report-box apple-reveal delay-4">
            <span className="box-lbl">Audience Engagement</span>
            <strong className="box-val">{(currentChannel.engagementRate * 100).toFixed(1)}%</strong>
            <span className="box-sub">Interaction Ratio</span>
          </div>
        </div>

        {/* Sponsorship Rate Guidance */}
        <div className="report-section-block">
          <h4 className="report-section-heading">Estimated Sponsorship Pricing</h4>
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
          <h5>Pricing Methodology & Notes:</h5>
          <p>
            Rates are estimated using 30-day catalog viewership baselines, standard category CPM ranges, and verified audience engagement. Actual sponsorship contracts may vary based on exclusivity, deliverable rights, and campaign scope.
          </p>
        </div>

        {/* Report Footer */}
        <div className="report-sheet-footer">
          <span>Prepared with CreatorIQ Analytics</span>
          <span>Confidential • For Brand & Agency Inquiries</span>
        </div>
      </div>
    </div>
  );
};
