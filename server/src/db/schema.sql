-- Enable necessary extensions
-- TimescaleDB gives us hypertables for efficient time-series data storage and querying
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
-- pgvector gives us vector storage and similarity search for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store channels/creators
CREATE TABLE IF NOT EXISTS creators (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- e.g., 'youtube', 'reddit'
    platform_id VARCHAR(255) NOT NULL UNIQUE, -- e.g., YouTube Channel ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    niche VARCHAR(100), -- 'tech', 'gaming', etc. (Classified by Gemini)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hypertable for time-series metrics (Ingestion Layer writes here continuously)
-- This is a key system design concept: instead of overwriting a row, we append
-- data points over time to track growth curves and anomalies.
CREATE TABLE IF NOT EXISTS unified_creator_metrics (
    time TIMESTAMPTZ NOT NULL,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- 'subscriber_count', 'view_count', 'engagement_rate'
    metric_value DOUBLE PRECISION NOT NULL,
    metadata JSONB -- Flexible metadata (e.g., specific video ID this metric relates to)
);

-- Convert standard table to a TimescaleDB hypertable partitioned by time
-- This chunks the data automatically behind the scenes for massive scalability.
SELECT create_hypertable('unified_creator_metrics', 'time', if_not_exists => TRUE);

-- Indexes for efficient time-series querying (getting latest metrics fast)
CREATE INDEX IF NOT EXISTS ix_metrics_creator_time ON unified_creator_metrics (creator_id, time DESC);

-- Table for Audience Sentiment & Embeddings
CREATE TABLE IF NOT EXISTS comment_sentiments (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    video_id VARCHAR(255),
    comment_text TEXT NOT NULL,
    sentiment_score DOUBLE PRECISION,
    -- Store Gemini generated vector embedding (768 dims for Gemini standard)
    embedding VECTOR(768), 
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an HNSW index on the vector column for lightning fast cosine similarity search
-- This allows us to quickly find "similar comments" to identify audience clusters.
CREATE INDEX IF NOT EXISTS hnsw_embedding_idx ON comment_sentiments USING hnsw (embedding vector_cosine_ops);

-- Table for Anomaly Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- 'anomaly', 'milestone', 'drop'
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
