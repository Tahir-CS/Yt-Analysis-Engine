"use strict";
/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: MATHEMATICAL PREDICTIVE MODELING
 * ----------------------------------------------------------------------------
 * Instead of estimating lifetime views using simple linear scaling or historic averages,
 * we model the velocity of view accumulation using a logarithmic decay curve:
 *
 *    V(t) = Vmax * (1 - e^(-kt))
 *
 * Where:
 *   - V(t) is the cumulative view count at time t (hours since upload).
 *   - Vmax is the estimated asymptotic ceiling (lifetime view ceiling).
 *   - k is the growth factor / decay rate.
 *
 * We use Separable Least Squares (grid search over k, analytical linear least-squares
 * solving for Vmax) to fit the curve to early-stage metrics (first 6 hours).
 * ============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fitVideoViewsCurve = fitVideoViewsCurve;
exports.sanityCheckPredictionWithAI = sanityCheckPredictionWithAI;
/**
 * Fits a series of cumulative view counts over time to the logarithmic decay curve.
 *
 * @param points Array of cumulative view data points
 */
function fitVideoViewsCurve(points) {
    if (points.length < 3) {
        throw new Error('At least 3 data points are required to fit a logarithmic decay curve.');
    }
    let bestK = 0.1;
    let bestVMax = 0;
    let minSSE = Infinity;
    // Grid search to optimize the non-linear parameter k, and analytically solve for Vmax
    // step size of 0.005 gives us highly accurate fits under 1ms execution time.
    for (let k = 0.01; k <= 2.0; k += 0.005) {
        let numerator = 0;
        let denominator = 0;
        for (const p of points) {
            const f = 1 - Math.exp(-k * p.t);
            numerator += p.v * f;
            denominator += f * f;
        }
        const vMax = denominator > 0 ? numerator / denominator : 0;
        // Evaluate Sum of Squared Errors (SSE)
        let sse = 0;
        for (const p of points) {
            const predicted = vMax * (1 - Math.exp(-k * p.t));
            sse += Math.pow(p.v - predicted, 2);
        }
        if (sse < minSSE) {
            minSSE = sse;
            bestK = k;
            bestVMax = vMax;
        }
    }
    // Calculate standard error of the regression model
    const n = points.length;
    const standardError = Math.sqrt(minSSE / (n - 2));
    // Scale the confidence interval boundary using Student's t-distribution
    // reflecting higher uncertainty when fewer data points have been collected.
    const tStudentValue = n === 3 ? 4.303 : n === 4 ? 3.182 : n === 5 ? 2.776 : 2.571;
    const margin = tStudentValue * standardError;
    const finalVMax = Math.round(bestVMax);
    const lastObservedView = points[points.length - 1].v;
    return {
        vMax: finalVMax,
        k: bestK,
        sse: minSSE,
        confidenceInterval: {
            // Lower bound can never be less than the actual views already observed!
            lower: Math.round(Math.max(lastObservedView, finalVMax - margin)),
            upper: Math.round(finalVMax + margin)
        }
    };
}
/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: AI-IN-THE-LOOP CONSTRAINT VALIDATION
 * ----------------------------------------------------------------------------
 * Pure math models are blind to contextual reality. A video that explodes in the
 * first 2 hours might trick a logarithmic curve into projecting 10 Million views,
 * even if the creator's historical peak is 50,000 views.
 *
 * We pass the mathematical projection alongside the creator's historical baselines
 * to Gemini, acting as an intelligent safety constraint/sanity check.
 * ============================================================================
 */
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
async function sanityCheckPredictionWithAI(calculatedVMax, baseline, videoTitle) {
    const prompt = `
    Analyze a predictive view-count model outcome for a new video.
    
    Video Title: "${videoTitle}"
    Creator Niche: ${baseline.niche}
    Mathematical Model Predicted VMax (Lifetime views): ${calculatedVMax.toLocaleString()}
    
    Creator's Historical Benchmarks (Lifetime views):
    - Average: ${baseline.averageLifetimeViews.toLocaleString()}
    - Peak/Highest: ${baseline.highestLifetimeViews.toLocaleString()}
    - Lowest: ${baseline.lowestLifetimeViews.toLocaleString()}
    
    Tasks:
    1. Evaluate if the mathematical prediction of ${calculatedVMax} is a realistic expectation, or an extreme math anomaly (due to sudden early view spikes or model fitting errors).
    2. Provide a sanitized/adjusted VMax prediction. If it is realistic, keep it. If it is unrealistic, apply a capped threshold based on historical limits.
    3. Return a JSON response matching this schema:
       {
         "sanitizedVMax": number,
         "isAnomaly": boolean,
         "explanation": "string explaining adjustment logic"
       }
  `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const result = JSON.parse(response.text || '{}');
        return {
            sanitizedVMax: result.sanitizedVMax || calculatedVMax,
            explanation: result.explanation || 'No adjustment required.',
            isAnomaly: !!result.isAnomaly
        };
    }
    catch (e) {
        console.error('[Gemini Sanity Check Error]', e.message);
        return {
            sanitizedVMax: calculatedVMax,
            explanation: 'Fallback triggered: Gemini sanity check failed. Utilizing mathematical fitting.',
            isAnomaly: false
        };
    }
}
