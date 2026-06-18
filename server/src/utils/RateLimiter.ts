/**
 * System Design Concept: Token Bucket Rate Limiting (Distributed via Redis)
 * 
 * YouTube Data API has strict daily quotas. If we scale to multiple worker instances,
 * an in-memory rate limiter will fail. We use Redis to implement a distributed
 * Token Bucket algorithm to coordinate rate limits across all workers.
 */
import Redis from 'ioredis';

// We assume Redis is injected or instantiated globally
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class TokenBucketRateLimiter {
    private key: string;
    private maxTokens: number;
    private refillRatePerSecond: number;

    constructor(platform: string, maxTokens: number, refillRatePerSecond: number) {
        this.key = `rate_limit:${platform}`;
        this.maxTokens = maxTokens;
        this.refillRatePerSecond = refillRatePerSecond;
    }

    /**
     * Attempts to consume 'tokens' from the bucket.
     * Returns true if successful, false if rate limited.
     */
    async consume(tokens: number = 1): Promise<boolean> {
        // Lua script ensures atomic check-and-decrement in Redis
        const luaScript = `
            local key = KEYS[1]
            local tokensToConsume = tonumber(ARGV[1])
            local maxTokens = tonumber(ARGV[2])
            local refillRate = tonumber(ARGV[3])
            local now = tonumber(ARGV[4])

            local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
            local currentTokens = tonumber(bucket[1]) or maxTokens
            local lastRefill = tonumber(bucket[2]) or now

            -- Refill tokens based on time passed
            local timePassed = math.max(0, now - lastRefill)
            local newTokens = math.min(maxTokens, currentTokens + (timePassed * refillRate))

            if newTokens >= tokensToConsume then
                -- Consume and update
                redis.call('HMSET', key, 'tokens', newTokens - tokensToConsume, 'last_refill', now)
                -- Expire the key eventually if unused to save memory
                redis.call('EXPIRE', key, 86400)
                return 1
            else
                -- Not enough tokens, just update the refill time
                redis.call('HMSET', key, 'tokens', newTokens, 'last_refill', now)
                return 0
            end
        `;

        const now = Date.now() / 1000;
        const result = await redis.eval(
            luaScript,
            1,
            this.key,
            tokens,
            this.maxTokens,
            this.refillRatePerSecond,
            now
        );

        return result === 1;
    }
}
