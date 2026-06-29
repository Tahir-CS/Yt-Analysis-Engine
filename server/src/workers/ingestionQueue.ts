import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Establish a connection to the Redis instance
const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: DISTRIBUTED TASK SCHEDULING (BULLMQ + REDIS)
 * ----------------------------------------------------------------------------
 * In production architectures, we avoid standard timers (setInterval) because:
 *   1. If the API container crashes or restarts, all memory-based schedules are lost.
 *   2. Running timers inside HTTP servers prevents horizontal scaling (multiple nodes
 *      would trigger the same scheduled jobs at once, causing duplicate ingestion).
 * 
 * BullMQ addresses this by persisting jobs and state in Redis.
 * Multiple background worker containers can pull jobs from the shared Queue,
 * distributing the load horizontally and ensuring no two containers run the same job.
 * ============================================================================
 */
export const ingestionQueue = new Queue('creator-ingestion', {
  connection: redisConnection,
  defaultJobOptions: {
    // Retry failing jobs up to 3 times
    attempts: 3,
    // System Design Concept: Exponential Backoff with Jitter
    // Prevents "Thundering Herd" syndrome on third-party APIs during outages
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, then 10s, then 20s...
    },
    // Autoclean: Successful jobs are removed from Redis state to preserve memory
    removeOnComplete: true,
    removeOnFail: false, // Keep logs for failed jobs for debugging
  }
});

/**
 * Registers a repeatable ingestion job for a creator channel.
 * Polls the metrics on a schedule (e.g. hourly cron expression).
 * 
 * @param creatorId Primary Key of creator in PostgreSQL
 * @param platform Platform name ('youtube', 'reddit')
 * @param platformId Unique external identifier (e.g. Channel ID)
 * @param cronExpression Cron definition (defaults to hourly)
 */
export async function scheduleCreatorPolling(
  creatorId: number, 
  platform: string, 
  platformId: string, 
  cronExpression: string = '0 * * * *'
) {
  const jobName = `poll-${platform}-${creatorId}`;
  
  await ingestionQueue.add(
    jobName,
    { creatorId, platform, platformId },
    {
      repeat: {
        pattern: cronExpression
      },
      // jobId prevents duplicate duplicate scheduling for the same creator
      jobId: `repeat-${creatorId}`
    }
  );
  console.log(`[Queue] Registered cron '${cronExpression}' for creator ID ${creatorId}`);
}
