import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';

/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: SERVER-SENT EVENTS (SSE) & REDIS PUB/SUB
 * ----------------------------------------------------------------------------
 * Polling (HTTP GET requests every 5 seconds) is highly inefficient:
 *   1. It creates massive HTTP connection overhead (TCP/TLS handshake every time).
 *   2. It scales poorly: 10,000 active users = 2,000 requests/sec hitting databases.
 *   3. It is not real-time; updates are delayed by the poll interval.
 * 
 * Instead, we use Server-Sent Events (SSE):
 *   - The client opens a single persistent connection (`Content-Type: text/event-stream`).
 *   - When the worker finishes ingestion, it publishes to a Redis Pub/Sub channel.
 *   - Fastify listens to that Pub/Sub event and writes it directly to the active stream.
 *   - Zero database polling, completely event-driven, and sub-second real-time UI.
 * ============================================================================
 */
export async function streamRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/api/v1/creators/:id/stream',
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const creatorId = request.params.id;

      // Establish headers required for a persistent SSE connection
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        // CORS setup (adjust in production)
        'Access-Control-Allow-Origin': '*',
      });

      console.log(`[SSE] Client connected to live stream for Creator: ${creatorId}`);

      // We need a dedicated Redis connection solely for subscribing.
      // A Redis client placed in subscriber mode cannot execute standard database commands.
      const subClient = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
      
      // Subscribe to this specific creator's update channel
      await subClient.subscribe(`creator:updates:${creatorId}`);

      // Push incoming Redis channel messages straight down the HTTP socket
      subClient.on('message', (channel, message) => {
        console.log(`[SSE] Event received on '${channel}'. Routing data to client stream...`);
        // SSE requires messages to prefix with "data: " and suffix with two newlines "\n\n"
        reply.raw.write(`data: ${message}\n\n`);
      });

      // Send immediate connection acknowledgement
      reply.raw.write(`data: ${JSON.stringify({ status: 'connected', connectedAt: new Date() })}\n\n`);

      // Keep-alive heartbeat to prevent intermediate proxies/routers from dropping idle sockets
      const heartbeatInterval = setInterval(() => {
        reply.raw.write(': heartbeat\n\n'); // SSE comment style heartbeat
      }, 15000);

      // Handle connection close event to prevent memory leaks!
      request.raw.on('close', () => {
        console.log(`[SSE] Connection closed for Creator: ${creatorId}. Cleaning resources.`);
        clearInterval(heartbeatInterval);
        subClient.unsubscribe();
        subClient.quit(); // Releases the Redis TCP connection
      });
    }
  );
}
