# 🚀 CreatorIQ 2026 Engine - Render Deployment Guide

This repository is configured so you can deploy it to [Render](https://render.com) in **under 2 minutes**.

---

## ⭐ Option 1: Single Full-Stack Web Service (Simplest & Recommended)

Deploy the **entire application** (Fastify API + React 19 Frontend) as a single Web Service. The Fastify backend automatically serves the compiled React frontend at `/` and all API endpoints at `/api/v1/...` and `/health`.

### Steps:
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: **`Tahir-CS/Yt-Analysis-Engine`**.
4. Configure these fields:
   * **Name**: `creatoriq` (or any name you choose)
   * **Region**: Oregon (or closest to you)
   * **Branch**: `main`
   * **Root Directory**: *(Leave blank)*
   * **Runtime**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Plan**: `Free`
5. **Environment Variables** (Optional):
   * `NODE_ENV` = `production`
   * `GEMINI_API_KEY` = *(Your Google Gemini API Key from AI Studio)*
   * `YOUTUBE_API_KEY` = *(Your YouTube Data v3 API Key)*
   * `DATABASE_URL` = *(Optional: PostgreSQL connection string)*
6. Click **Deploy Web Service**!

---

## ⚡ Option 2: 1-Click Blueprint Deployment (`render.yaml`)

If you want separate dedicated services (Web Service + Static Site + Managed Postgres DB):

1. Go to [dashboard.render.com](https://dashboard.render.com/blueprints).
2. Click **New +** → **Blueprint**.
3. Select **`Tahir-CS/Yt-Analysis-Engine`**.
4. Render will read [`render.yaml`](./render.yaml) and configure:
   * `creatoriq-api`: Fastify API Web Service
   * `creatoriq-client`: Vite React Static Site
   * `creatoriq-db`: PostgreSQL Database
5. Click **Apply**.

---

## 🔍 How to Fix the "Cannot find module index.html" Error

If you encountered:
```
Error: Cannot find module '/opt/render/project/src/index.html'
==> Running 'node index.html'
```
**Why it happened**: Render tried to run `node index.html` because the older legacy `package.json` had `"main": "index.html"`.

**The Fix (Already applied in the latest commit)**:
1. Root `package.json` now points to `"main": "server/dist/index.js"`.
2. The start script is now `"start": "node server/dist/index.js"`.
3. In your Render Dashboard under **Settings** for your Web Service:
   * Ensure **Start Command** is set to: `npm start` (or `node server/dist/index.js`).
   * Ensure **Build Command** is set to: `npm run build`.
   * Click **Save Changes** and click **Manual Deploy** → **Deploy latest commit**.
