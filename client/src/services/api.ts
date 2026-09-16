import type { ChannelData, PredictionPoint, PredictionResult, ValuationOutput, FypHookAnalysis, TrendingNiche } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const DEMO_CHANNELS: Record<string, ChannelData> = {
  mrbeast: {
    id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
    name: 'MrBeast',
    handle: '@MrBeast',
    avatar: 'https://yt3.googleusercontent.com/nxYrc_1_2f77DoBadyxMTmv7ZpRZapHR5jbuYe7PlPd5cIRJxtNNEYyOC0ZsxaDyJJzXrnJiuDE=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 360000000,
    totalViews: 68500000000,
    videoCount: 840,
    avgViewsPerVideo: 81500000,
    viewVelocityPerHour: 385000,
    niche: 'Entertainment',
    country: 'United States',
    estimatedMonthlyEarnings: { min: 2500000, max: 6200000 },
    engagementRate: 0.082,
    recentVideos: [
      { id: 'v1', title: '$1 vs $1,000,000 Hotel Room!', views: 142000000, hoursAgo: 72, likeRatio: 0.97, predictedLifetime: 175000000 },
      { id: 'v2', title: 'Ages 1 - 100 Fight For $500,000', views: 118000000, hoursAgo: 168, likeRatio: 0.96, predictedLifetime: 145000000 },
      { id: 'v3', title: 'Survive 100 Days In A Nuclear Bunker', views: 185000000, hoursAgo: 360, likeRatio: 0.98, predictedLifetime: 210000000 },
    ]
  },
  mkbhd: {
    id: 'UCBJycsmduvYEL83R_U4JriQ',
    name: 'Marques Brownlee',
    handle: '@MKBHD',
    avatar: 'https://yt3.googleusercontent.com/qu4TmIaYUlS41-dJ9gZ7DUR3nilvmB5_11i6OKSdvNnBNiyOusZP1bMN6ICnuxtjFBb6ioKgRQ=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 19400000,
    totalViews: 4400000000,
    videoCount: 1680,
    avgViewsPerVideo: 2600000,
    viewVelocityPerHour: 34000,
    niche: 'Tech',
    country: 'United States',
    estimatedMonthlyEarnings: { min: 140000, max: 320000 },
    engagementRate: 0.054,
    recentVideos: [
      { id: 'v4', title: 'The Apple Vision Pro 2: What Happened?', views: 3400000, hoursAgo: 48, likeRatio: 0.95, predictedLifetime: 4800000 },
      { id: 'v5', title: 'Blind Smartphone Camera Test Results', views: 6200000, hoursAgo: 120, likeRatio: 0.98, predictedLifetime: 7500000 },
      { id: 'v6', title: 'Why Everyone Is Abandoning Electric Cars', views: 4100000, hoursAgo: 240, likeRatio: 0.94, predictedLifetime: 5200000 },
    ]
  },
  lexfridman: {
    id: 'UCSHZKyawb77ixDdsGog4iWA',
    name: 'Lex Fridman',
    handle: '@LexFridman',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_ljfMy9kUR1PH9VRf-XsTsPqFMgORC_zodOQVEAm4hx36lC=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 4450000,
    totalViews: 650000000,
    videoCount: 460,
    avgViewsPerVideo: 1400000,
    viewVelocityPerHour: 18500,
    niche: 'Education',
    country: 'United States',
    estimatedMonthlyEarnings: { min: 85000, max: 210000 },
    engagementRate: 0.061,
    recentVideos: [
      { id: 'v7', title: 'Sam Altman: OpenAI and Future of Computing', views: 4200000, hoursAgo: 96, likeRatio: 0.96, predictedLifetime: 6100000 },
      { id: 'v8', title: 'Yann LeCun: Limitations of Modern LLMs', views: 2800000, hoursAgo: 216, likeRatio: 0.95, predictedLifetime: 3900000 },
    ]
  },
  veritasium: {
    id: 'UCHnyfMqiRRG1u-2MsSQLbXA',
    name: 'Veritasium',
    handle: '@veritasium',
    avatar: 'https://yt3.googleusercontent.com/7vCbvtCqtjQ3YLgsJt7Y952MQV1sBvhllSCSxHP8_sVZdcPCBrITfhkN2RdyCuwPnsByq-1GoA=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 17100000,
    totalViews: 2900000000,
    videoCount: 390,
    avgViewsPerVideo: 7400000,
    viewVelocityPerHour: 42000,
    niche: 'Education',
    country: 'Canada',
    estimatedMonthlyEarnings: { min: 120000, max: 290000 },
    engagementRate: 0.078,
    recentVideos: [
      { id: 'v9', title: 'The Infinite Speed of Light Paradox', views: 8900000, hoursAgo: 60, likeRatio: 0.98, predictedLifetime: 12000000 },
      { id: 'v10', title: 'How Math Proved What Computers Can Never Do', views: 5300000, hoursAgo: 180, likeRatio: 0.97, predictedLifetime: 7800000 },
    ]
  },
  pewdiepie: {
    id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
    name: 'PewDiePie',
    handle: '@pewdiepie',
    avatar: 'https://yt3.googleusercontent.com/vik8mAiwHQbXiFyKfZ3__p55_VBdGvwxPpuPJBBwdbF0PjJxikXhrP-C3nLQAMAxGNd_-xQCIg=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 111000000,
    totalViews: 29300000000,
    videoCount: 4750,
    avgViewsPerVideo: 3800000,
    viewVelocityPerHour: 55000,
    niche: 'Gaming & Vlogs',
    country: 'Japan',
    estimatedMonthlyEarnings: { min: 65000, max: 180000 },
    engagementRate: 0.065,
    recentVideos: [
      { id: 'v11', title: 'Life in Japan With a Newborn Baby', views: 4200000, hoursAgo: 96, likeRatio: 0.98, predictedLifetime: 5600000 },
      { id: 'v12', title: 'I Built My Ultimate Workshop', views: 3500000, hoursAgo: 240, likeRatio: 0.97, predictedLifetime: 4800000 },
    ]
  }
};

export async function checkBackendHealth(): Promise<{ online: boolean; latencyMs: number }> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return { online: true, latencyMs: Math.round(performance.now() - start) };
    }
  } catch {
    // Backend offline or unreachable
  }
  return { online: false, latencyMs: 0 };
}

export async function predictViewsCurve(
  points: PredictionPoint[],
  videoTitle?: string
): Promise<PredictionResult> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points, videoTitle }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.fit) {
        return {
          vMax: data.fit.vMax,
          k: data.fit.k,
          confidenceInterval: data.fit.confidenceInterval,
          aiExplanation: data.aiCheck?.explanation,
          isAnomaly: data.aiCheck?.isAnomaly,
        };
      }
    }
  } catch {
    // Fall back to client-side curve fitting
  }

  // Client-side fallback calculation V(t) = Vmax * (1 - e^(-kt))
  return clientFitCurve(points);
}

function clientFitCurve(points: PredictionPoint[]): PredictionResult {
  let bestK = 0.1;
  let bestVMax = 0;
  let minSSE = Infinity;

  for (let k = 0.01; k <= 1.5; k += 0.01) {
    let num = 0;
    let den = 0;
    for (const p of points) {
      const f = 1 - Math.exp(-k * p.t);
      num += p.v * f;
      den += f * f;
    }
    const vMax = den > 0 ? num / den : 0;
    let sse = 0;
    for (const p of points) {
      const pred = vMax * (1 - Math.exp(-k * p.t));
      sse += Math.pow(p.v - pred, 2);
    }
    if (sse < minSSE) {
      minSSE = sse;
      bestK = k;
      bestVMax = vMax;
    }
  }

  const roundedVMax = Math.round(bestVMax);
  const margin = Math.round(roundedVMax * 0.12);
  const lastObserved = points[points.length - 1]?.v || 0;

  return {
    vMax: roundedVMax,
    k: Number(bestK.toFixed(3)),
    confidenceInterval: {
      lower: Math.max(lastObserved, roundedVMax - margin),
      upper: roundedVMax + margin,
    },
    aiExplanation: 'Client-side mathematical logarithmic regression fitted successfully.',
    isAnomaly: false,
  };
}

export async function calculateValuation(
  predictedVMax: number,
  niche: string,
  engagementRate = 0.05
): Promise<ValuationOutput> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/valuation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ predictedVMax, niche, engagementRate }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.valuation) {
        return data.valuation;
      }
    }
  } catch {
    // Fall back to client calculation
  }

  const cpmMap: Record<string, { min: number; max: number }> = {
    finance: { min: 35, max: 55 },
    tech: { min: 25, max: 40 },
    education: { min: 18, max: 30 },
    gaming: { min: 6, max: 14 },
    lifestyle: { min: 12, max: 22 },
    entertainment: { min: 9, max: 16 },
  };

  const benchmark = cpmMap[niche.toLowerCase()] || { min: 12, max: 24 };
  const engagementFactor = Math.min(1.5, Math.max(0.8, engagementRate / 0.05));
  const minCPM = Math.round(benchmark.min * engagementFactor);
  const maxCPM = Math.round(benchmark.max * engagementFactor);
  const suggestedCPM = Math.round((minCPM + maxCPM) / 2);

  const minValue = Math.round((predictedVMax / 1000) * minCPM);
  const maxValue = Math.round((predictedVMax / 1000) * maxCPM);

  return {
    minSponsorshipValue: minValue,
    maxSponsorshipValue: maxValue,
    suggestedCPM,
    explanation: `Calculated using ${niche.toUpperCase()} baseline CPM of $${benchmark.min}-$${benchmark.max} adjusted by engagement rate (${(engagementRate * 100).toFixed(1)}%).`,
  };
}

export async function fetchFypTrends(): Promise<TrendingNiche[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/fyp-radar`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.radarData) {
        return data.radarData;
      }
    }
  } catch {}

  return [
    {
      category: 'Autonomous AI Agents & Reasoning Models',
      momentumScore: 98,
      avgViewVelocityHour: 28400,
      saturationIndex: 'Moderate (High Growth)',
      topKeywords: ['Local DeepSeek', 'Autonomous Coding', 'Computer Use Agents', 'OpenAI Operator'],
      recommendedHookStyle: 'Live Paradox / Immediate Proof of Failure or Triumph',
    },
    {
      category: 'Macro Economics & Wealth Preservation',
      momentumScore: 91,
      avgViewVelocityHour: 19500,
      saturationIndex: 'High',
      topKeywords: ['Fed Rate Cuts', 'Hyperinflation Prep', 'Gold vs Bitcoin 2026', 'Debt Cycle'],
      recommendedHookStyle: 'Direct Hard Numbers / Contrarian Warning',
    },
    {
      category: 'Next-Gen Silicon & Minimalist Tech',
      momentumScore: 88,
      avgViewVelocityHour: 22100,
      saturationIndex: 'Moderate',
      topKeywords: ['2nm Chips', 'Foldable Ecosystems', 'Offline EDC', 'Spatial Computing'],
      recommendedHookStyle: 'Cinematic B-Roll Hook + Decisive Unfiltered Verdict',
    },
    {
      category: 'Solo Indie SaaS & Creative Devlogs',
      momentumScore: 85,
      avgViewVelocityHour: 14200,
      saturationIndex: 'Low (Prime Opportunity)',
      topKeywords: ['Building in Public', '$10k MRR Journey', 'Vibe Coding', 'Micro-SaaS Exit'],
      recommendedHookStyle: 'Raw Vulnerability / Behind-the-Scenes Revenue Breakdown',
    },
  ];
}

export async function analyzeViralHook(title: string): Promise<FypHookAnalysis> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/fyp-radar/hook-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.analysis) return data.analysis;
    }
  } catch {}

  const length = title.length;
  const hasNumbers = /\d/.test(title);
  const hasQuestion = title.includes('?');
  const hasEmotionalTrigger = /(how|why|secret|never|biggest|ultimate|exposed|million|free|warning|stop)/i.test(title);

  let viralProbability = 58;
  if (hasNumbers) viralProbability += 14;
  if (hasEmotionalTrigger) viralProbability += 16;
  if (length >= 35 && length <= 65) viralProbability += 10;
  if (hasQuestion) viralProbability += 6;
  viralProbability = Math.min(99, Math.max(30, viralProbability));

  return {
    title,
    viralProbability,
    estimatedCTR: (viralProbability / 10).toFixed(1) + '%',
    retentionRisk: viralProbability > 75 ? 'Low (Strong Viewer Curiosity)' : 'Moderate (Slow Opening Risk)',
    suggestions: [
      'Front-load your high-stakes outcome in the first 4 words.',
      'Remove buzzword filler words like "In this video" or "A quick guide to".',
      'Match this title with high-contrast, uncluttered thumbnail imagery.',
    ],
  };
}

export async function lookupChannelOnline(query: string): Promise<ChannelData | null> {
  const cleanQuery = query.toLowerCase().replace('@', '').trim();

  // 1. Instant match against featured profiles
  if (DEMO_CHANNELS[cleanQuery]) {
    return DEMO_CHANNELS[cleanQuery];
  }
  const localMatch = Object.values(DEMO_CHANNELS).find(
    (c) => c.name.toLowerCase().includes(cleanQuery) || c.handle.toLowerCase().includes(cleanQuery)
  );
  if (localMatch) {
    return localMatch;
  }

  // 2. Query backend live lookup
  try {
    const res = await fetch(`${API_BASE}/api/v1/channel/lookup?handle=${encodeURIComponent(cleanQuery)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.channel) {
        return data.channel;
      }
    }
  } catch {}

  return null;
}

