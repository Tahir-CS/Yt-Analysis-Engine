import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { query } from '../db';
import { YouTubeStrategy } from '../ingestion/YouTubeStrategy';
import { RedditStrategy } from '../ingestion/RedditStrategy';
import { BaseIngestionWorker } from '../ingestion/BaseIngestionWorker';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Registry of supported platform strategies (Polymorphic Strategy Pattern)
const strategies: Record<string, BaseIngestionWorker> = {
  youtube: new YouTubeStrategy(),
  reddit: new RedditStrategy()
};

/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: DECOUPLED BACKGROUND WORKERS
 * ----------------------------------------------------------------------------
 * Workers are isolated consumer processes that poll jobs off Redis and process
 * them asynchronously. This ensures that slow third-party API calls (Google, Reddit)
 * do not block user-facing HTTP request-response cycles.
 * ============================================================================
 */
export const ingestionWorker = new Worker(
  'creator-ingestion',
  async (job: Job) => {
    const { creatorId, platform, platformId } = job.data;
    console.log(`[Worker] Started processing job ${job.id} for Creator: ${creatorId} (${platform})`);

    // Retrieve correct Strategy class for platform polymorphism
    const strategy = strategies[platform.toLowerCase()];
    if (!strategy) {
      throw new Error(`Ingestion strategy not found for platform: ${platform}`);
    }

    try {
      // 1. Fetch metrics from the API (rate limits are handled inside strategy)
      const metrics = await strategy.fetchLatestMetrics(platformId);

      // 2. Append metrics to TimescaleDB Hypertable
      // Appending instead of overwriting gives us historical tracking capabilities.
      if (metrics.subscriberCount !== undefined) {
        await query(
          `INSERT INTO unified_creator_metrics (time, creator_id, metric_type, metric_value, metadata)
           VALUES (NOW(), $1, 'subscriber_count', $2, $3)`,
          [creatorId, metrics.subscriberCount, JSON.stringify({ raw: metrics })]
        );
      }

      if (metrics.engagementRate !== undefined) {
        await query(
          `INSERT INTO unified_creator_metrics (time, creator_id, metric_type, metric_value, metadata)
           VALUES (NOW(), $1, 'engagement_rate', $2, $3)`,
          [creatorId, metrics.engagementRate, JSON.stringify({ raw: metrics })]
        );
      }

      // 3. Event-Driven Real-time Updates (Redis Pub/Sub)
      // When ingestion completes, we publish an event. The API servers subscribing to Redis
      // will instantly push these updates to user dashboards using Server-Sent Events (SSE).
      const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      const eventPayload = {
        creatorId,
        platform,
        metrics: {
          subscriberCount: metrics.subscriberCount,
          engagementRate: metrics.engagementRate
        },
        timestamp: new Date()
      };
      
      await pubClient.publish(`creator:updates:${creatorId}`, JSON.stringify(eventPayload));
      pubClient.disconnect();

      console.log(`[Worker] Completed metrics ingestion for Creator: ${creatorId}`);
    } catch (error: any) {
      console.error(`[Worker Error] Failed processing job ${job.id}:`, error.message);
      // Re-throwing notifies BullMQ of failure, allowing retry backoffs to take place.
      throw error;
    }
  },
  { connection: redisConnection }
);

// Subscribe to worker events for operations monitoring
ingestionWorker.on('completed', (job) => {
  console.log(`[Worker Monitoring] Job ${job.id} successfully finished.`);
});

ingestionWorker.on('failed', (job, err) => {
  console.error(`[Worker Monitoring] Job ${job?.id} failed with error: ${err.message}`);
});
