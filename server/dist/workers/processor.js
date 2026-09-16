"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestionWorker = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const db_1 = require("../db");
const YouTubeStrategy_1 = require("../ingestion/YouTubeStrategy");
const RedditStrategy_1 = require("../ingestion/RedditStrategy");
const redisConnection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
// Registry of supported platform strategies (Polymorphic Strategy Pattern)
const strategies = {
    youtube: new YouTubeStrategy_1.YouTubeStrategy(),
    reddit: new RedditStrategy_1.RedditStrategy()
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
exports.ingestionWorker = new bullmq_1.Worker('creator-ingestion', async (job) => {
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
            await (0, db_1.query)(`INSERT INTO unified_creator_metrics (time, creator_id, metric_type, metric_value, metadata)
           VALUES (NOW(), $1, 'subscriber_count', $2, $3)`, [creatorId, metrics.subscriberCount, JSON.stringify({ raw: metrics })]);
        }
        if (metrics.engagementRate !== undefined) {
            await (0, db_1.query)(`INSERT INTO unified_creator_metrics (time, creator_id, metric_type, metric_value, metadata)
           VALUES (NOW(), $1, 'engagement_rate', $2, $3)`, [creatorId, metrics.engagementRate, JSON.stringify({ raw: metrics })]);
        }
        // 3. Event-Driven Real-time Updates (Redis Pub/Sub)
        // When ingestion completes, we publish an event. The API servers subscribing to Redis
        // will instantly push these updates to user dashboards using Server-Sent Events (SSE).
        const pubClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
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
    }
    catch (error) {
        console.error(`[Worker Error] Failed processing job ${job.id}:`, error.message);
        // Re-throwing notifies BullMQ of failure, allowing retry backoffs to take place.
        throw error;
    }
}, { connection: redisConnection });
// Subscribe to worker events for operations monitoring
exports.ingestionWorker.on('completed', (job) => {
    console.log(`[Worker Monitoring] Job ${job.id} successfully finished.`);
});
exports.ingestionWorker.on('failed', (job, err) => {
    console.error(`[Worker Monitoring] Job ${job?.id} failed with error: ${err.message}`);
});
