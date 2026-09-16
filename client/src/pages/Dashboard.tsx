import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ChannelData, NavTab } from '../types';
import { DEMO_CHANNELS } from '../services/api';

interface DashboardProps {
  currentChannel: ChannelData;
  onSelectChannel: (channel: ChannelData) => void;
  onNavigate: (tab: NavTab) => void;
  onLoadVideoToPredictor?: (videoTitle: string, initialViews: number) => void;
}

export const Dashboard = ({
  currentChannel,
  onSelectChannel,
  onNavigate,
  onLoadVideoToPredictor,
}: DashboardProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [compareChannelKey, setCompareChannelKey] = useState<string | null>(null);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchInput.toLowerCase().replace('@', '').trim();
    if (DEMO_CHANNELS[query]) {
      onSelectChannel(DEMO_CHANNELS[query]);
    } else {
      // Find matching by name or fallback
      const found = Object.values(DEMO_CHANNELS).find(
        (c) => c.name.toLowerCase().includes(query) || c.handle.toLowerCase().includes(query)
      );
      if (found) {
        onSelectChannel(found);
      } else {
        alert(`Demo mode: Channel "${searchInput}" not found. Try @MrBeast, @MKBHD, @LexFridman, or @Veritasium.`);
      }
    }
    setSearchInput('');
  };

  const compareChannel = compareChannelKey ? DEMO_CHANNELS[compareChannelKey] : null;

  return (
    <div className="page-container dashboard-page">
      {/* Top Hero Section */}
      <section className="dashboard-hero apple-reveal">
        <div className="hero-content">
          <div className="apple-eyebrow">CREATOR ANALYTICS & VALUATION</div>
          <h1 className="page-heading">
            Channel Analytics.<br />
            Sponsorship Valued.
          </h1>
          <p className="page-subheading">
            Track channel performance, project 48-hour video reach, and calculate fair sponsorship rates.
          </p>

          {/* Search & Quick Selector */}
          <form className="channel-search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search channel (@MrBeast, @MKBHD, @veritasium)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input-field"
            />
            <button type="submit" className="primary-btn">Search</button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="quick-channels">
            <span className="quick-label">Featured profiles:</span>
            {Object.entries(DEMO_CHANNELS).map(([key, ch]) => (
              <button
                key={key}
                className={`quick-pill ${currentChannel.name === ch.name ? 'active-pill' : ''}`}
                onClick={() => onSelectChannel(ch)}
              >
                {ch.handle}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Channel Header Card */}
      <section className="channel-profile-card glass-panel apple-reveal delay-1">
        <div className="profile-left">
          <img src={currentChannel.avatar} alt={currentChannel.name} className="channel-avatar" />
          <div className="profile-info">
            <div className="profile-title-row">
              <h2 className="channel-name">{currentChannel.name}</h2>
              <span className="channel-badge">{currentChannel.niche}</span>
              <span className="country-badge">{currentChannel.country}</span>
            </div>
            <p className="channel-handle">{currentChannel.handle} • {currentChannel.videoCount} Uploads</p>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="secondary-btn"
            onClick={() => {
              const keys = Object.keys(DEMO_CHANNELS).filter(k => DEMO_CHANNELS[k].name !== currentChannel.name);
              setCompareChannelKey(keys[0] || null);
            }}
          >
            {compareChannel ? 'Change Comparison' : 'Compare Channel'}
          </button>
          <button className="accent-btn" onClick={() => onNavigate('valuation')}>
            Calculate Sponsorship &rsaquo;
          </button>
        </div>
      </section>

      {/* Main Metric Cards Grid */}
      <section className="metric-cards-grid">
        <div className="metric-card glass-panel apple-reveal delay-1">
          <div className="metric-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metric-icon-svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="metric-badge positive">+{(currentChannel.subscribers * 0.003).toLocaleString()} / wk</span>
          </div>
          <div className="metric-value">{(currentChannel.subscribers / 1000000).toFixed(1)}M</div>
          <div className="metric-title">Subscribers</div>
          <div className="metric-subtext">Estimated growth: +{Math.round(currentChannel.viewVelocityPerHour * 0.02).toLocaleString()} / day</div>
        </div>

        <div className="metric-card glass-panel apple-reveal delay-2">
          <div className="metric-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metric-icon-svg">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <span className="metric-badge highlight">Active Pace</span>
          </div>
          <div className="metric-value">+{currentChannel.viewVelocityPerHour.toLocaleString()}</div>
          <div className="metric-title">Views / Hour</div>
          <div className="metric-subtext">Estimated aggregate channel velocity</div>
        </div>

        <div className="metric-card glass-panel apple-reveal delay-3">
          <div className="metric-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metric-icon-svg">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span className="metric-badge positive">Estimated RPM</span>
          </div>
          <div className="metric-value">
            ${(currentChannel.estimatedMonthlyEarnings.min / 1000).toFixed(0)}k - ${(currentChannel.estimatedMonthlyEarnings.max / 1000).toFixed(0)}k
          </div>
          <div className="metric-title">Est. Monthly Ad Revenue</div>
          <div className="metric-subtext">Standard 55% creator share baseline</div>
        </div>

        <div className="metric-card glass-panel apple-reveal delay-4">
          <div className="metric-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metric-icon-svg">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <span className="metric-badge positive">{(currentChannel.engagementRate * 100).toFixed(1)}% Eng.</span>
          </div>
          <div className="metric-value">{(currentChannel.avgViewsPerVideo / 1000000).toFixed(2)}M</div>
          <div className="metric-title">Avg Views / Upload</div>
          <div className="metric-subtext">Based on recent video catalog average</div>
        </div>
      </section>

      {/* Comparison Section (If triggered) */}
      {compareChannel && (
        <section className="comparison-section glass-panel apple-reveal delay-1">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">Channel Comparison</h3>
              <p className="section-subtext">Side-by-side performance benchmarking & sponsorship value divergence</p>
            </div>
            <button className="close-btn" onClick={() => setCompareChannelKey(null)}>✕ Close</button>
          </div>

          <div className="compare-grid">
            <div className="compare-col current-col">
              <h4>{currentChannel.name} ({currentChannel.niche})</h4>
              <div className="compare-metric">
                <span className="lbl">Subs:</span>
                <span className="val">{(currentChannel.subscribers / 1000000).toFixed(1)}M</span>
              </div>
              <div className="compare-metric">
                <span className="lbl">Hourly Views:</span>
                <span className="val">+{currentChannel.viewVelocityPerHour.toLocaleString()}</span>
              </div>
              <div className="compare-metric">
                <span className="lbl">Engagement:</span>
                <span className="val">{(currentChannel.engagementRate * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="compare-vs">VS</div>

            <div className="compare-col target-col">
              <h4>{compareChannel.name} ({compareChannel.niche})</h4>
              <div className="compare-metric">
                <span className="lbl">Subs:</span>
                <span className="val">{(compareChannel.subscribers / 1000000).toFixed(1)}M</span>
              </div>
              <div className="compare-metric">
                <span className="lbl">Hourly Views:</span>
                <span className="val">+{compareChannel.viewVelocityPerHour.toLocaleString()}</span>
              </div>
              <div className="compare-metric">
                <span className="lbl">Engagement:</span>
                <span className="val">{(compareChannel.engagementRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Videos & Predictions Table */}
      <section className="recent-videos-section glass-panel">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">Recent Uploads & 48-Hour Forecast</h3>
            <p className="section-subtext">
              Early view growth fitted to asymptotic saturation model
            </p>
          </div>
          <button className="text-link-btn" onClick={() => onNavigate('predictor')}>
            Open View Forecast &rsaquo;
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Video Title</th>
                <th>Age</th>
                <th>Current Views</th>
                <th>Audience Sentiment</th>
                <th>Projected Lifetime (Vmax)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentChannel.recentVideos.map((video) => (
                <tr key={video.id}>
                  <td className="video-title-cell">
                    <span className="video-play-icon">▶</span>
                    <strong>{video.title}</strong>
                  </td>
                  <td>{video.hoursAgo}h ago</td>
                  <td>{(video.views / 1000000).toFixed(2)}M</td>
                  <td>
                    <div className="sentiment-pill positive">
                      <span className="dot"></span> {(video.likeRatio * 100).toFixed(0)}% Approval
                    </div>
                  </td>
                  <td className="predicted-cell">
                    <strong>{(video.predictedLifetime / 1000000).toFixed(2)}M</strong>
                    <span className="trend-arrow"> ↗</span>
                  </td>
                  <td>
                    <button
                      className="table-action-btn"
                      onClick={() => {
                        if (onLoadVideoToPredictor) {
                          onLoadVideoToPredictor(video.title, video.views);
                        }
                        onNavigate('predictor');
                      }}
                    >
                      Fit Model
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
