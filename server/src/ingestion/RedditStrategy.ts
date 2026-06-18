/**
 * System Design Concept: Second Concrete Strategy
 * 
 * Demonstrates the extensibility of the ingestion layer. To add a new platform,
 * we just create a new class implementing BaseIngestionWorker without touching
 * the core scheduler logic.
 */
import { BaseIngestionWorker, CreatorMetrics } from './BaseIngestionWorker';

export class RedditStrategy implements BaseIngestionWorker {
    platformName = 'reddit';

    async checkRateLimits(): Promise<boolean> {
        // Reddit has different limits (e.g., 60 requests per minute).
        // We would use a different configuration for TokenBucketRateLimiter here.
        return true; 
    }

    async fetchLatestMetrics(platformId: string): Promise<CreatorMetrics> {
        // Reddit's platformId would be a subreddit or username. e.g., 'r/programming'
        const url = `https://www.reddit.com/${platformId}/about.json`;
        
        const response = await fetch(url, {
            headers: { 'User-Agent': 'CreatorIQ-Bot/1.0' }
        });

        if (!response.ok) throw new Error("Reddit API Error");

        const data = await response.json();

        return {
            platformId: platformId,
            subscriberCount: data.data.subscribers,
            // Reddit doesn't have an exact equivalent of "total views", 
            // so we map active users to engagement metrics or leave it blank.
            engagementRate: data.data.active_user_count, 
            recentVideos: [] // Or recent posts
        };
    }
}
