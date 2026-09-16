import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { FypHookAnalysis, TrendingNiche } from '../types';
import { analyzeViralHook, fetchFypTrends } from '../services/api';

export const FypRadar = () => {
  const [hookInput, setHookInput] = useState('I Tested 10 Autonomous AI Agents For 30 Days (Here Is What Happened)');
  const [analysis, setAnalysis] = useState<FypHookAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trendingNiches, setTrendingNiches] = useState<TrendingNiche[]>([]);

  useEffect(() => {
    fetchFypTrends().then(setTrendingNiches);
    handleAnalyze();
  }, []);

  const handleAnalyze = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!hookInput.trim()) return;
    setIsAnalyzing(true);
    const res = await analyzeViralHook(hookInput);
    setAnalysis(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="page-container fyp-radar-page">
      <div className="page-header apple-reveal">
        <div className="badge-pill">Content Strategy</div>
        <h1 className="page-heading">Title & Hook Analyzer</h1>
        <p className="page-subheading">
          Evaluate title structure, estimate potential click-through rate ranges, and review current category benchmarks.
        </p>
      </div>

      {/* Top: Viral Hook & Title Analyzer */}
      <section className="hook-analyzer-section glass-panel apple-reveal delay-1">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Title & Opening Hook Assessment</h2>
            <p className="section-subtext">Evaluates character length, numerical anchors, and curiosity elements against YouTube benchmarks</p>
          </div>
        </div>

        <form className="hook-input-form" onSubmit={handleAnalyze}>
          <div className="input-with-button">
            <input
              type="text"
              value={hookInput}
              onChange={(e) => setHookInput(e.target.value)}
              placeholder="Enter your video title or opening hook..."
              className="hook-text-input"
            />
            <button type="submit" className="primary-btn" disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Title'}
            </button>
          </div>
        </form>

        {/* Results Card */}
        {analysis && (
          <div className="hook-results-grid apple-reveal">
            <div className="score-tile glass-panel apple-reveal delay-1">
              <div className="tile-label">Hook Strength Score</div>
              <div className="tile-value highlight">{analysis.viralProbability} / 100</div>
              <div className="progress-bar-bg">
                <div className="progress-fill" style={{ width: `${analysis.viralProbability}%` }}></div>
              </div>
              <div className="tile-subtext">Based on keyword structure and clarity</div>
            </div>

            <div className="score-tile glass-panel apple-reveal delay-2">
              <div className="tile-label">Projected CTR Range</div>
              <div className="tile-value positive">{analysis.estimatedCTR}</div>
              <div className="tile-subtext">Typical platform baseline: 4.0% — 7.5%</div>
            </div>

            <div className="score-tile glass-panel apple-reveal delay-3">
              <div className="tile-label">Early Retention Factor</div>
              <div className="tile-value">{analysis.retentionRisk.split('(')[0]}</div>
              <div className="tile-subtext">{analysis.retentionRisk}</div>
            </div>

            <div className="suggestions-box glass-panel full-span apple-reveal delay-4">
              <h4 className="suggestions-title">Recommended Refinements:</h4>
              <ul className="suggestions-list">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i} className="suggestion-item">
                    <span className="bullet-icon">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Bottom: Trending Niche Momentum Radar */}
      <section className="trending-niches-section apple-reveal delay-1">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Category Demand & Saturation Benchmarks</h2>
            <p className="section-subtext">Viewer demand levels and content saturation across major categories</p>
          </div>
        </div>

        <div className="niches-grid">
          {trendingNiches.map((niche, idx) => (
            <div key={idx} className={`niche-card glass-panel apple-reveal delay-${(idx % 4) + 1}`}>
              <div className="niche-card-header">
                <h3 className="niche-title">{niche.category}</h3>
                <div className="momentum-score-badge">
                  <span className="score-num">{niche.momentumScore}</span>
                  <span className="score-label">DEMAND</span>
                </div>
              </div>

              <div className="niche-metrics">
                <div className="metric-line">
                  <span className="line-lbl">Hourly Consumption Velocity:</span>
                  <strong className="line-val">+{niche.avgViewVelocityHour.toLocaleString()} views/hr</strong>
                </div>
                <div className="metric-line">
                  <span className="line-lbl">Market Saturation:</span>
                  <span className={`saturation-tag ${niche.saturationIndex.toLowerCase().includes('low') ? 'low' : 'moderate'}`}>
                    {niche.saturationIndex}
                  </span>
                </div>
              </div>

              <div className="keywords-wrap">
                <span className="keywords-label">Breakout Topics:</span>
                <div className="keyword-pills">
                  {niche.topKeywords.map((kw, ki) => (
                    <span key={ki} className="kw-pill">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="recommended-hook">
                <strong>Recommended Hook Structure:</strong>
                <p>"{niche.recommendedHookStyle}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
