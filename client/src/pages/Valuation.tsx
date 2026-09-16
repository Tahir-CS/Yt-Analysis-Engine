import { useState, useEffect } from 'react';
import type { ChannelData, ValuationOutput } from '../types';
import { calculateValuation } from '../services/api';

interface ValuationProps {
  currentChannel: ChannelData;
}

export const Valuation = ({ currentChannel }: ValuationProps) => {
  const [views, setViews] = useState<number>(currentChannel.avgViewsPerVideo || 500000);
  const [niche, setNiche] = useState<string>(currentChannel.niche.toLowerCase());
  const [engagement, setEngagement] = useState<number>(currentChannel.engagementRate || 0.05);
  const [geoTier, setGeoTier] = useState<string>('tier1');
  const [valuation, setValuation] = useState<ValuationOutput | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    runValuation();
  }, [views, niche, engagement, geoTier]);

  const runValuation = async () => {
    let geoMultiplier = 1.0;
    if (geoTier === 'tier2') geoMultiplier = 0.8;
    if (geoTier === 'tier3') geoMultiplier = 0.5;

    const adjustedViews = views * geoMultiplier;
    const res = await calculateValuation(adjustedViews, niche, engagement);
    setValuation(res);
  };

  const copyRatePitch = () => {
    if (!valuation) return;
    const pitch = `Creator Rate Sheet: ${currentChannel.name}
Niche: ${niche.toUpperCase()} | Benchmark Engagement: ${(engagement * 100).toFixed(1)}%
Projected Baseline Views: ${views.toLocaleString()}

Recommended Sponsorship Rates:
- 30s Sponsored Mention: $${Math.round(valuation.minSponsorshipValue * 0.6).toLocaleString()}
- 60s Integrated Mid-Roll: $${valuation.minSponsorshipValue.toLocaleString()} - $${valuation.maxSponsorshipValue.toLocaleString()}
- Dedicated Showcase Video: $${Math.round(valuation.maxSponsorshipValue * 2.2).toLocaleString()}

Justification: ${valuation.explanation} Powered by CreatorIQ Valuation Engine.`;

    navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="page-container valuation-page">
      <div className="page-header">
        <div className="badge-pill">💰 Enterprise Sponsorship & AdSense Valuation</div>
        <h1 className="page-heading">Creator Sponsorship & Cost Estimator</h1>
        <p className="page-subheading">
          Multi-variable dynamic pricing engine adjusting for niche CPM baselines, engagement multipliers, and audience geography tiers.
        </p>
      </div>

      <div className="valuation-layout">
        {/* Controls Column */}
        <div className="valuation-controls glass-panel">
          <h3 className="section-title">Valuation Parameters</h3>

          <div className="input-group">
            <label className="field-label">Target Video Views:</label>
            <input
              type="number"
              value={views}
              onChange={(e) => setViews(Number(e.target.value))}
              className="number-input full-width"
              step="10000"
            />
          </div>

          <div className="input-group">
            <label className="field-label">Content Niche:</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="select-input full-width"
            >
              <option value="finance">Finance & Investing ($35 - $55 CPM)</option>
              <option value="tech">Tech & Software ($25 - $40 CPM)</option>
              <option value="education">Education & Science ($18 - $30 CPM)</option>
              <option value="lifestyle">Lifestyle & Fashion ($12 - $22 CPM)</option>
              <option value="entertainment">Entertainment & Comedy ($9 - $16 CPM)</option>
              <option value="gaming">Gaming & Esports ($6 - $14 CPM)</option>
            </select>
          </div>

          <div className="input-group">
            <div className="slider-header">
              <label className="field-label">Audience Engagement Rate:</label>
              <strong className="slider-value">{(engagement * 100).toFixed(1)}%</strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.005"
              value={engagement}
              onChange={(e) => setEngagement(Number(e.target.value))}
              className="slider-input"
            />
            <div className="slider-ticks">
              <span>1% (Low)</span>
              <span>5% (Avg)</span>
              <span>10%+ (Viral)</span>
            </div>
          </div>

          <div className="input-group">
            <label className="field-label">Audience Demographics / Region:</label>
            <select
              value={geoTier}
              onChange={(e) => setGeoTier(e.target.value)}
              className="select-input full-width"
            >
              <option value="tier1">Tier 1: US, UK, Canada, Australia (100% Rate)</option>
              <option value="tier2">Tier 2: Germany, France, Nordic, Western EU (80% Rate)</option>
              <option value="tier3">Tier 3: Global / Emerging Markets (50% Rate)</option>
            </select>
          </div>
        </div>

        {/* Output Column */}
        <div className="valuation-output glass-panel">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">Valuation Rate Sheet</h3>
              <p className="section-subtext">Verified enterprise pricing range based on current market rates</p>
            </div>
            <button className="copy-btn" onClick={copyRatePitch}>
              {copied ? '✓ Rate Sheet Copied!' : '📋 Copy Pitch Deck'}
            </button>
          </div>

          {valuation && (
            <>
              {/* Primary Rate Range Card */}
              <div className="primary-rate-card">
                <div className="rate-range-label">Recommended 60s Mid-Roll Integration</div>
                <div className="rate-range-values">
                  ${valuation.minSponsorshipValue.toLocaleString()} <span>—</span> ${valuation.maxSponsorshipValue.toLocaleString()}
                </div>
                <div className="effective-cpm">
                  Effective Suggested CPM: <strong>${valuation.suggestedCPM} / 1k views</strong>
                </div>
              </div>

              {/* Package Tier Breakdown */}
              <div className="packages-grid">
                <div className="package-tile glass-panel">
                  <div className="pkg-name">30s Pre-roll / Mention</div>
                  <div className="pkg-price">${Math.round(valuation.minSponsorshipValue * 0.6).toLocaleString()}</div>
                  <div className="pkg-desc">Quick verbal callout + description link</div>
                </div>

                <div className="package-tile glass-panel highlight-border">
                  <div className="pkg-badge">POPULAR</div>
                  <div className="pkg-name">60s Integrated Sponsor</div>
                  <div className="pkg-price">${valuation.minSponsorshipValue.toLocaleString()}</div>
                  <div className="pkg-desc">Dedicated segment, screen recording, pinned comment</div>
                </div>

                <div className="package-tile glass-panel">
                  <div className="pkg-name">Full Dedicated Video</div>
                  <div className="pkg-price">${Math.round(valuation.maxSponsorshipValue * 2.2).toLocaleString()}</div>
                  <div className="pkg-desc">Entire video centered on product/brand theme</div>
                </div>
              </div>

              {/* Justification Box */}
              <div className="pitch-justification-box">
                <h4>AI Data-Driven Pitch Justification:</h4>
                <p>{valuation.explanation}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
