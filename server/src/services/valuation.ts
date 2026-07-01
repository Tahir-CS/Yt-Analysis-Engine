import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ValuationMetrics {
  predictedVMax: number;
  engagementRate: number; // e.g. 0.045 for 4.5%
  niche: string;
}

export interface ValuationResult {
  minSponsorshipValue: number;
  maxSponsorshipValue: number;
  suggestedCPM: number;
  explanation: string;
}

/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: BRAND VALUATION ENGINE
 * ----------------------------------------------------------------------------
 * Combines statistical forecasting (Vmax) with audience interaction metrics
 * (engagement rates) and niche CPM indexes to produce dynamic value pricing.
 * ============================================================================
 */
const NICHE_CPM_BENCHMARKS: Record<string, { min: number; max: number }> = {
  finance: { min: 30, max: 50 },
  tech: { min: 20, max: 35 },
  business: { min: 25, max: 40 },
  education: { min: 15, max: 25 },
  gaming: { min: 5, max: 12 },
  lifestyle: { min: 10, max: 20 },
  entertainment: { min: 8, max: 15 },
  default: { min: 10, max: 20 }
};

/**
 * Computes sponsorship valuation range and generates AI-written justifications
 * for pitch decks and brand reports.
 */
export async function calculateSponsorshipValuation(metrics: ValuationMetrics): Promise<ValuationResult> {
  const normNiche = metrics.niche.toLowerCase();
  const benchmark = NICHE_CPM_BENCHMARKS[normNiche] || NICHE_CPM_BENCHMARKS.default;
  
  // System Design Concept: Multi-variable Pricing Model
  // Sponsorship Rate = (Views / 1000) * CPM * Engagement Factor
  // Engagement rates above 5% standard boost the value modifier positively
  const engagementMultiplier = Math.min(1.5, Math.max(0.8, metrics.engagementRate / 0.05));
  
  const calculatedMinCPM = benchmark.min * engagementMultiplier;
  const calculatedMaxCPM = benchmark.max * engagementMultiplier;
  const avgCPM = (calculatedMinCPM + calculatedMaxCPM) / 2;

  const minSponsorshipValue = (metrics.predictedVMax / 1000) * calculatedMinCPM;
  const maxSponsorshipValue = (metrics.predictedVMax / 1000) * calculatedMaxCPM;

  const prompt = `
    Compose a concise data-driven justification for a creator rate sheet.
    
    Details:
    - Creator Niche: ${metrics.niche}
    - Estimated Lifetime Views (VMax): ${metrics.predictedVMax.toLocaleString()}
    - Engagement Rate: ${(metrics.engagementRate * 100).toFixed(2)}%
    - Suggested Sponsorship Rate: $${Math.round(minSponsorshipValue)} - $${Math.round(maxSponsorshipValue)}
    - Average CPM: $${avgCPM.toFixed(2)}
    
    Write 2 brief professional paragraphs justifying this pricing range. Focus on target audience value, 
    niche density (CPM justifications), and engagement multipliers. The output must be ready for 
    direct insertion into a media kit or pitch deck.
  `;

  let explanation = '';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    explanation = response.text || '';
  } catch (e: any) {
    explanation = `Valuation estimated based on industry benchmark CPMs of $${benchmark.min.toFixed(2)}-$${benchmark.max.toFixed(2)} for the ${metrics.niche} vertical, adjusted dynamically by an engagement factor of ${engagementMultiplier.toFixed(2)}x.`;
  }

  return {
    minSponsorshipValue: Math.round(minSponsorshipValue),
    maxSponsorshipValue: Math.round(maxSponsorshipValue),
    suggestedCPM: Math.round(avgCPM),
    explanation
  };
}
