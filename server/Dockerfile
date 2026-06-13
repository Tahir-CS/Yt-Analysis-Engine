# =============================================================
# CreatorIQ - Node.js API Server Image
# =============================================================
# System Design Concept: Minimal, Reproducible Build Environments
#
# This Dockerfile packages our TypeScript backend into a container.
# We use the Alpine variant of Node.js 20 because:
#
#   - Alpine Linux is extremely lightweight (~5MB vs ~900MB full Debian)
#   - Node 20 is the current LTS (Long-Term Support) release, meaning
#     it gets security patches for years without breaking API changes.
#
# In DEVELOPMENT, the docker-compose volume mount (./server:/app)
# means this container runs the live code from your machine — so
# ts-node-dev can hot-reload on every file save.
#
# In PRODUCTION, you'd add a build step here:
#   RUN npm run build      ← compiles TypeScript to JavaScript
#   CMD ["node", "dist/index.js"]
# =============================================================

# Base image: Node.js 20 on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container.
# All subsequent commands (COPY, RUN, CMD) operate from here.
# /app is a standard convention for Node.js applications.
WORKDIR /app

# NOTE: We intentionally do NOT run `npm install` here for development.
# The docker-compose volume mount (./server:/app) overlays your local
# files into the container. Dependencies are managed by a separate
# node_modules anonymous volume defined in docker-compose.yml.
# You'd run `docker-compose exec api npm install` to install packages.

# Copy only the package files first (layer caching optimization).
# Docker caches each instruction as a layer. If package.json hasn't changed,
# Docker reuses the cached layer and skips reinstalling dependencies —
# making subsequent builds much faster.
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the source code
COPY . .

# Tell Docker that this container listens on port 3000.
# This is documentation only — the actual port binding happens in docker-compose.yml.
EXPOSE 3000

# Start the development server with hot-reloading via ts-node-dev.
# In production this would be: CMD ["node", "dist/index.js"]
CMD ["npm", "run", "dev"]
