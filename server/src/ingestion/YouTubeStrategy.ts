/**
 * System Design Concept: Concrete Strategy Implementation
 * 
 * This strategy specifically handles YouTube API quirks, applying the BaseIngestionWorker
 * interface. It uses the Redis Token Bucket to respect the 10,000 daily quota.
 */
import { BaseIngestionWorker, CreatorMetrics } from './BaseIngestionWorker';
import { TokenBucketRateLimiter } from '../utils/RateLimiter';

export class YouTubeStrategy implements BaseIngestionWorker {
    platformName = 'youtube';
    private rateLimiter: TokenBucketRateLimiter;
    private apiKey: string;

    constructor() {
        // YouTube grants 10,000 units per day.
        // Let's allow a burst of 50, and refill at ~0.11 tokens/second (10000 / 86400).
        this.rateLimiter = new TokenBucketRateLimiter('youtube', 50, 0.115);
        this.apiKey = process.env.YOUTUBE_API_KEY || '';
    }

    async checkRateLimits(): Promise<boolean> {
        // We'll check if we can consume 1 token (a basic API call cost)
        return await this.rateLimiter.consume(1);
    }

    async fetchLatestMetrics(platformId: string): Promise<CreatorMetrics> {
        // 1. Check Rate Limit before making external call
        const canProceed = await this.checkRateLimits();
        if (!canProceed) {
            throw new Error(`[YouTubeStrategy] Rate limit exceeded. Backing off.`);
        }

        // 2. Fetch Channel Stats (Costs 1 quota unit)
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${platformId}&key=${this.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`[YouTubeStrategy] YouTube API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error(`[YouTubeStrategy] Channel ${platformId} not found.`);
        }

        const stats = data.items[0].statistics;

        // 3. Normalize to our unified schema
        return {
            platformId: platformId,
            subscriberCount: parseInt(stats.subscriberCount || '0', 10),
            viewCount: parseInt(stats.viewCount || '0', 10),
            recentVideos: [] // In a full implementation, we'd make a 2nd API call here for /search or /playlistItems
        };
    }
}
