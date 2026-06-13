# =============================================================
# CreatorIQ - Custom Database Image
# =============================================================
# System Design Concept: Custom Base Images
#
# We cannot use the plain 'postgres' image from Docker Hub because
# we need TWO powerful extensions that don't come pre-installed:
#
#   1. TimescaleDB - Turns regular Postgres tables into "hypertables"
#      that are automatically partitioned by time. This makes queries
#      like "give me subscriber counts for the last 90 days" 10-100x
#      faster than a standard Postgres table would be.
#
#   2. pgvector - Adds a new column type called VECTOR that lets us
#      store AI-generated embeddings (numerical representations of text).
#      We can then run semantic similarity searches on them using
#      cosine distance, which is how we'll cluster audience sentiments.
#
# So we start from timescale's official image and LAYER pgvector
# on top of it via a compile-from-source step.
# =============================================================

# Base image: TimescaleDB on top of PostgreSQL 15 (LTS)
FROM timescale/timescaledb:latest-pg15

# Switch to root to install system dependencies
USER root

# Install the build tools needed to compile pgvector from source.
# We need: make, gcc (via build-essential), git, and the Postgres dev headers.
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-15

# Clone pgvector at a pinned version (v0.5.1) for reproducibility.
# Pinning versions is a production best practice — 'latest' can break builds.
# Then compile and install into the Postgres extension directory.
RUN cd /tmp && \
    git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install

# Clean up ALL build-time dependencies to keep the final image small.
# This is called a "single-layer cleanup" pattern. If we had run
# these in separate RUN commands, Docker would cache each layer
# including the large build tools — this way they never make it
# into the final image layer.
RUN rm -rf /tmp/pgvector && \
    apt-get remove -y build-essential git postgresql-server-dev-15 && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# The final image now has:
#   ✅ PostgreSQL 15
#   ✅ TimescaleDB extension (CREATE EXTENSION timescaledb)
#   ✅ pgvector extension   (CREATE EXTENSION vector)
