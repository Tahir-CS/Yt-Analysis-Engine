# 🚀 CreatorIQ 2026 Engine - Render Deployment Guide

This guide walks you through deploying the **CreatorIQ (YouTube Tracker & Cost Estimator)** production-grade stack to [Render](https://render.com).

---

## ⚡ Option 1: 1-Click Blueprint Deployment (Recommended)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint file that automatically configures:
1. **`creatoriq-api`**: Fastify Node.js Web Service (Port 10000)
2. **`creatoriq-client`**: Vite + React Static Site (with SPA routing)
3. **`creatoriq-db`**: Managed PostgreSQL Database

### Steps:
1. **Push your code to GitHub**:
   Make sure all commits are pushed to your GitHub repository:
   `https://github.com/Tahir-CS/Yt-Analysis-Engine`
2. **Log into Render**:
   Go to [dashboard.render.com](https://dashboard.render.com).
3. **Create New Blueprint**:
   - Click **New +** → **Blueprint**.
   - Connect your GitHub repository: `Tahir-CS/Yt-Analysis-Engine`.
   - Render will parse `render.yaml` and show the 3 resources to provision.
   - Click **Apply**.
4. **Add Optional API Keys** (in the Render Dashboard for `creatoriq-api`):
   - `GEMINI_API_KEY`: Your Google AI Studio API key (for AI sanity checks and comment sentiment).
   - `YOUTUBE_API_KEY`: Your YouTube Data API v3 key (for live video queries).
   - `REDIS_URL`: (Optional) Free Redis URL from [Upstash](https://upstash.com) or Render Redis for queue workers.

---

## 🛠️ Option 2: Manual Service-by-Service Deployment on Render

If you prefer to configure the services manually in Render:

### Service 1: Backend Web Service
* **Name**: `creatoriq-api`
* **Environment**: `Node`
* **Root Directory**: `server`
* **Build Command**: `npm install && npm run build`
* **Start Command**: `node dist/index.js`
* **Health Check Path**: `/health`
* **Environment Variables**:
  * `NODE_ENV` = `production`
  * `PORT` = `10000`
  * `HOST` = `0.0.0.0`
  * `DATABASE_URL` = *(Your Render or external PostgreSQL connection string)*
  * `GEMINI_API_KEY` = *(Your Gemini API key)*
  * `YOUTUBE_API_KEY` = *(Your YouTube Data v3 API key)*

### Service 2: Frontend Static Site
* **Name**: `creatoriq-client`
* **Root Directory**: `client`
* **Build Command**: `npm install && npm run build`
* **Publish Directory**: `dist`
* **Rewrites / Redirects**:
  * **Source**: `/*`
  * **Destination**: `/index.html`
  * **Action**: `Rewrite`
* **Environment Variables**:
  * `VITE_API_BASE_URL` = `https://creatoriq-api.onrender.com` *(Replace with your API's Render URL)*

---

## 💻 Local Development & Testing

You can run both services locally before deploying:

### Backend:
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:3000
# Health check: http://localhost:3000/health
```

### Frontend:
```bash
cd client
npm install
npm run dev
# React Vite client starts on http://localhost:5173
```

---

## 🛡️ Resilient Fallback Architecture

The CreatorIQ 2026 Engine is built with **zero-crash graceful fallbacks**:
* If `DATABASE_URL` or `REDIS_URL` are not provided, the API server boots normally and serves logarithmic curve regressions, sponsorship pricing, and FYP viral analytics.
* If the backend server is temporarily sleeping (e.g. Render free tier spin-up), the React client automatically uses high-fidelity mathematical client-side regression curves so users never see an error or broken page.
