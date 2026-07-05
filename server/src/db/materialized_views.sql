-- ============================================================================
-- SYSTEM DESIGN CONCEPT: MATERIALIZED VIEWS & BATCH PRE-COMPUTATION
-- ----------------------------------------------------------------------------
-- Running percentile calculations across millions of rows for every API request
-- would cripple the database. Instead, we use Materialized Views.
-- These pre-calculate and store the results physically. We then run a scheduled 
-- job (e.g. every midnight) to run `REFRESH MATERIALIZED VIEW` to update them.
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS creator_cohort_percentiles AS
WITH metrics_summary AS (
    SELECT 
        c.id AS creator_id,
        c.niche,
        AVG(m.metric_value) FILTER (WHERE m.metric_type = 'engagement_rate') AS avg_engagement,
        MAX(m.metric_value) FILTER (WHERE m.metric_type = 'view_count') AS max_views
    FROM creators c
    JOIN unified_creator_metrics m ON c.id = m.creator_id
    GROUP BY c.id, c.niche
)
SELECT 
    creator_id,
    niche,
    PERCENT_RANK() OVER (PARTITION BY niche ORDER BY avg_engagement) AS engagement_percentile,
    PERCENT_RANK() OVER (PARTITION BY niche ORDER BY max_views) AS views_percentile
FROM metrics_summary;

-- Creating an index on the materialized view makes API lookups instant
CREATE UNIQUE INDEX IF NOT EXISTS idx_cohort_percentiles_creator_id ON creator_cohort_percentiles(creator_id);
