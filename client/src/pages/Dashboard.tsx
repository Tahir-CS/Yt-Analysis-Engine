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
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="badge-pill">🔥 2026 High-Throughput Intelligence</div>
          <h1 className="page-heading">YouTube Channel Tracker & Cost Estimator</h1>
          <p className="page-subheading">
            Live velocity tracking, logarithmic decay view forecasts, and AI-backed brand rate modeling.
          </p>

          {/* Search & Quick Selector */}
          <form className="channel-search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Enter YouTube Channel URL, ID, or @handle..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input-field"
            />
            <button type="submit" className="primary-btn">Track Channel</button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="quick-channels">
            <span className="quick-label">Try instant profiles:</span>
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
      <section className="channel-profile-card glass-panel">
        <div className="profile-left">
          <img src={currentChannel.avatar} alt={currentChannel.name} className="channel-avatar" />
          <div className="profile-info">
            <div className="profile-title-row">
              <h2 className="channel-name">{currentChannel.name}</h2>
              <span className="channel-badge">{currentChannel.niche}</span>
              <span className="country-badge">📍 {currentChannel.country}</span>
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
            {compareChannel ? 'Swap Comparison' : '⚖️ Compare Channel'}
          </button>
          <button className="accent-btn" onClick={() => onNavigate('valuation')}>
            💰 Calculate Sponsorship
          </button>
        </div>
      </section>

      {/* Main Metric Cards Grid */}
      <section className="metric-cards-grid">
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-icon">👥</span>
            <span className="metric-badge positive">+{(currentChannel.subscribers * 0.003).toLocaleString()} / wk</span>
          </div>
          <div className="metric-value">{(currentChannel.subscribers / 1000000).toFixed(1)}M</div>
          <div className="metric-title">Subscribers</div>
          <div className="metric-subtext">Velocity: +{Math.round(currentChannel.viewVelocityPerHour * 0.02).toLocaleString()} new subs/day</div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-icon">📈</span>
            <span className="metric-badge highlight">Live Telemetry</span>
          </div>
          <div className="metric-value">+{currentChannel.viewVelocityPerHour.toLocaleString()}</div>
          <div className="metric-title">Views / Hour</div>
          <div className="metric-subtext">Real-time aggregate consumption rate</div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-icon">💵</span>
            <span className="metric-badge positive">AdSense + RPM</span>
          </div>
          <div className="metric-value">
            ${(currentChannel.estimatedMonthlyEarnings.min / 1000).toFixed(0)}k - ${(currentChannel.estimatedMonthlyEarnings.max / 1000).toFixed(0)}k
          </div>
          <div className="metric-title">Est. Monthly Earnings</div>
          <div className="metric-subtext">Based on 55% creator revenue split</div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-icon">🎯</span>
            <span className="metric-badge positive">{(currentChannel.engagementRate * 100).toFixed(1)}% Eng.</span>
          </div>
          <div className="metric-value">{(currentChannel.avgViewsPerVideo / 1000000).toFixed(2)}M</div>
          <div className="metric-title">Avg Views / Upload</div>
          <div className="metric-subtext">Across historical benchmark dataset</div>
        </div>
      </section>

      {/* Comparison Section (If triggered) */}
      {compareChannel && (
        <section className="comparison-section glass-panel">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">⚖️ Head-to-Head Creator Comparison</h3>
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
            <h3 className="section-title">🎬 Recent Video Trajectory & Predictive Asymptote</h3>
            <p className="section-subtext">
              Early view accumulation curve fitted to logarithmic model \(V(t) = V_{'{max}'}(1 - e^{'-kt'})\)
            </p>
          </div>
          <button className="text-link-btn" onClick={() => onNavigate('predictor')}>
            Open Full ML Predictor ➔
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
