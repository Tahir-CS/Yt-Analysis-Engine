export type NavTab = 
  | 'dashboard'
  | 'predictor'
  | 'fyp-radar'
  | 'valuation'
  | 'reports'
  | 'about'
  | 'contact';

export interface ChannelData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  avgViewsPerVideo: number;
  viewVelocityPerHour: number;
  niche: string;
  country: string;
  estimatedMonthlyEarnings: { min: number; max: number };
  engagementRate: number;
  recentVideos: {
    id: string;
    title: string;
    views: number;
    hoursAgo: number;
    likeRatio: number;
    predictedLifetime: number;
  }[];
}

export interface PredictionPoint {
  t: number;
  v: number;
}

export interface PredictionResult {
  vMax: number;
  k: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  aiExplanation?: string;
  isAnomaly?: boolean;
}

export interface ValuationOutput {
  minSponsorshipValue: number;
  maxSponsorshipValue: number;
  suggestedCPM: number;
  explanation: string;
}

export interface FypHookAnalysis {
  title: string;
  viralProbability: number;
  estimatedCTR: string;
  retentionRisk: string;
  suggestions: string[];
}

export interface TrendingNiche {
  category: string;
  momentumScore: number;
  avgViewVelocityHour: number;
  saturationIndex: string;
  topKeywords: string[];
  recommendedHookStyle: string;
}
