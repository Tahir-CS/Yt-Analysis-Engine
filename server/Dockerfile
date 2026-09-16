# =============================================================
# CreatorIQ - 2026 Production Node.js API Server Image
# =============================================================

FROM node:20-alpine

WORKDIR /app

# Install Chromium and required fonts/libraries for headless Puppeteer PDF generation
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production

# Copy package manifests
COPY package*.json ./

# Install all dependencies including devDependencies for TypeScript build
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript to dist/
RUN npm run build

EXPOSE 3000

# Start compiled server
CMD ["node", "dist/index.js"]
