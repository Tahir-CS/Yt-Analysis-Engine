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
      <div className="page-header">
        <div className="badge-pill">🚀 2026 FYP Algorithmic Radar</div>
        <h1 className="page-heading">Viral Hook & Content Momentum Radar</h1>
        <p className="page-subheading">
          Analyze video hook dynamics, predict FYP click-through rates, and identify rising micro-trends before market saturation occurs.
        </p>
      </div>

      {/* Top: Viral Hook & Title Analyzer */}
      <section className="hook-analyzer-section glass-panel">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">⚡ AI Viral Hook & Title Analyzer</h2>
            <p className="section-subtext">Evaluates psychological tension, curiosity gap, and thumbnail pairing potential</p>
          </div>
        </div>

        <form className="hook-input-form" onSubmit={handleAnalyze}>
          <div className="input-with-button">
            <input
              type="text"
              value={hookInput}
              onChange={(e) => setHookInput(e.target.value)}
              placeholder="Paste your video title or opening spoken hook sentence..."
              className="hook-text-input"
            />
            <button type="submit" className="primary-btn" disabled={isAnalyzing}>
              {isAnalyzing ? 'Evaluating...' : 'Score Hook ➔'}
            </button>
          </div>
        </form>

        {/* Results Card */}
        {analysis && (
          <div className="hook-results-grid">
            <div className="score-tile glass-panel">
              <div className="tile-label">Viral Probability</div>
              <div className="tile-value highlight">{analysis.viralProbability}%</div>
              <div className="progress-bar-bg">
                <div className="progress-fill" style={{ width: `${analysis.viralProbability}%` }}></div>
              </div>
              <div className="tile-subtext">Estimated FYP placement potential</div>
            </div>

            <div className="score-tile glass-panel">
              <div className="tile-label">Projected CTR</div>
              <div className="tile-value positive">{analysis.estimatedCTR}</div>
              <div className="tile-subtext">Benchmark: 4.5% - 7.5% across platform</div>
            </div>

            <div className="score-tile glass-panel">
              <div className="tile-label">Audience Retention Risk</div>
              <div className="tile-value">{analysis.retentionRisk.split('(')[0]}</div>
              <div className="tile-subtext">{analysis.retentionRisk}</div>
            </div>

            <div className="suggestions-box glass-panel full-span">
              <h4 className="suggestions-title">💡 High-Impact Algorithmic Optimizations:</h4>
              <ul className="suggestions-list">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i} className="suggestion-item">
                    <span className="bullet-icon">✦</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Bottom: Trending Niche Momentum Radar */}
      <section className="trending-niches-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">🔥 2026 Content Momentum & Saturation Heatmap</h2>
            <p className="section-subtext">Tracking rapid velocity topics with highest algorithmic viewer demand</p>
          </div>
        </div>

        <div className="niches-grid">
          {trendingNiches.map((niche, idx) => (
            <div key={idx} className="niche-card glass-panel">
              <div className="niche-card-header">
                <h3 className="niche-title">{niche.category}</h3>
                <div className="momentum-score-badge">
                  <span className="score-num">{niche.momentumScore}</span>
                  <span className="score-label">MOMENTUM</span>
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
