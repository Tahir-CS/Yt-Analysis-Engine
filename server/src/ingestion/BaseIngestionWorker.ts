/**
 * System Design Concept: Strategy Pattern & Polymorphism
 * 
 * The BaseIngestionWorker defines a common interface for fetching data from ANY platform.
 * By using this interface, our core scheduling system (BullMQ) doesn't need to know
 * if it's talking to YouTube, Reddit, or TikTok. It just calls `fetchLatestMetrics()`.
 * This makes the architecture highly extensible.
 */
export interface CreatorMetrics {
    platformId: string;
    subscriberCount?: number;
    viewCount?: number;
    engagementRate?: number;
    recentVideos: any[];
}

export interface BaseIngestionWorker {
    /**
     * The unique name of the platform (e.g., 'youtube', 'reddit')
     */
    platformName: string;

    /**
     * Fetches the latest metrics for a given creator.
     * Implementations MUST handle platform-specific rate limits and pagination here.
     */
    fetchLatestMetrics(platformId: string): Promise<CreatorMetrics>;

    /**
     * Verifies if the rate limits for the current platform allow another request.
     */
    checkRateLimits(): Promise<boolean>;
}
