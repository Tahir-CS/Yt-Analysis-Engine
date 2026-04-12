# 📊 YouTube Tracker Cost Estimator - Project Code Map

**Generated**: April 12, 2026  
**Project Type**: Full-stack JavaScript (Frontend + Backend/Serverless)  
**Main Tech Stack**: HTML5, ES6+ Modules, Chart.js, Supabase, Vercel, Google APIs

---

## 📁 Project Structure

```
client (Frontend - ES6 Modules - Browser)
├── index.html              - Entry point (HTML template)
├── main.js                 - Main app orchestration & earnings calculator
├── master.css              - Global styling
│
└── public/
    ├── api.js              - YouTube Data API & Gemini AI API calls
    ├── ai.js               - AI analysis UI & Gemini integration
    ├── charts.js           - Chart.js visualization
    ├── compare.js          - Channel comparison logic
    ├── ui.js               - UI utilities & notifications
    ├── utils.js            - Helper functions
    ├── index.html          - Static front-end (duplicate of root)
    ├── main.js             - Frontend app logic (duplicate of root)
    ├── master.css          - CSS (duplicate of root)
    │
    └── google-signin-custom.css - Google Sign-In styling

backend (Server - Node.js/Express)
├── main.js              - BACKUP (likely obsolete)
├── backend.js           - Express server + auth middleware
├── db_mock.js           - In-memory mock database
├── api/
│   ├── youtube.js       - YouTube API proxy (Vercel serverless)
│   ├── tracked-channels.js - Tracked channels CRUD
│   ├── alerts.js        - Alert conditions CRUD
│   ├── snapshots.js     - Channel snapshots CRUD
│   ├── global-trends.js - BigQuery global trends (NOT USING SUPABASE) ⚠️
│   └── ai/
│       └── analyze.js   - Gemini AI analysis endpoint
│
├── lib/
│   └── supabase.js      - Supabase DB client & functions (INCOMPLETE - see notes)
│
├── .env-template.txt    - Environment template
├── package.json         - Dependencies
└── vercel.json         - Vercel deployment config

Database
├── db_mock.js          - Mock in-memory DB (for local development)
└── supabase-schema.sql - Supabase schema (reference)

Config & Docs
├── railway.json        - Railway deployment config
├── vercel.json         - Vercel deployment config
├── DEPLOYMENT-GUIDE.md - Deployment instructions
├── README.md           - Project README
└── city_coordinates.csv - City data (unused?)
```

---

## 🔴 CRITICAL ISSUES FOUND

### 1. **DUPLICATE CODE - MAJOR CODE DUPLICATION**
- `main.js` (root) and `public/main.js` exist but are IDENTICAL
- `api.js` appears in BOTH root and `public/` directory - IDENTICAL copies
- `master.css` duplicated in root and `public/`
- `index.html` duplicated in root and `public/`
- **Impact**: Changes in one location won't reflect in the other. Maintenance nightmare.
- **Status**: BLOCKING ISSUE - Fix immediately

### 2. **INCOMPLETE SUPABASE INTEGRATION** ⚠️
- `backend.js` uses `db_mock.js` NOT `lib/supabase.js`
- `api/tracked-channels.js`, `api/alerts.js`, `api/snapshots.js` import from `lib/supabase.js`
- BUT `lib/supabase.js` is INCOMPLETE (file cut off mid-function)
- **Impact**: Backend DB operations will fail on production
- **Status**: CRITICAL - Need to complete supabase.js

### 3. **INCONSISTENT API BASE URL DETECTION** ⚠️
- `public/api.js` uses: `API_BASE_URL` = localhost:3000 OR window.location.origin
- `main.js` hardcodes some URLs to `http://localhost:3000`
- **Impact**: Breaks on production unless manually configured
- **Status**: HIGH PRIORITY

### 4. **CPM_TABLE DEFINED IN MULTIPLE PLACES** ⚠️
- **Location 1**: `main.js` lines ~30-40 (DUPLICATE)
- **Location 2**: `main.js` lines ~195-205 (DUPLICATE)
- **Impact**: If CPM rates change, you must update in 2 places
- **Status**: MEDIUM - Extract to constants file

### 5. **UNUSED/BROKEN CODE** 🔧
- `api/global-trends.js` - Uses BigQuery but never called from frontend
- `city_coordinates.csv` - Imported in structure but never used
- `main.js` (root) - Seems to be old/backup version
- `db_mock.js` - Still being used instead of Supabase in production
- **Status**: CLEANUP NEEDED

### 6. **CORS HARDCODED DOMAINS** ⚠️
- Localhost hardcoded in multiple API files
- Frontend domain URL marked as "Replace with your actual domain"
- **Impact**: Breaks on deployment
- **Status**: HIGH - Needs environment variable config

### 7. **MISSING SESSION TOKEN IN SOME CALLS** ⚠️
- Some functions accept optional `sessionToken` parameter
- But some calls don't pass it (e.g., `fetchChannelData()` may be called without token)
- **Impact**: Potential 401 auth errors in production
- **Status**: MEDIUM - Audit all API calls

---

## 📝 FUNCTION MAPPING

### **Frontend - public/api.js**
#### Authentication Functions
- `sendGoogleTokenToBackend(googleIdToken)` - POST to `/api/auth/google` → returns session token
- `fetchTrackedChannels(sessionToken)` - GET `/api/tracked-channels` → returns user's tracked channels
- `addTrackedChannel(sessionToken, channelId, channelName)` - POST `/api/tracked-channels`
- `removeTrackedChannel(sessionToken, channelId)` - DELETE `/api/tracked-channels`
- `setChannelAlert(sessionToken, channelId, alertConfig)` - POST `/api/alerts`
- `getChannelAlert(sessionToken, channelId)` - GET `/api/alerts`
- `getChannelSnapshots(sessionToken, channelId)` - GET `/api/snapshots`

#### YouTube Data API Functions
- `resolveToChannelId(input, sessionToken)` - Converts username/URL to channel ID
- `fetchChannelData(channelId, sessionToken)` - Gets channel stats (subscribers, views, videos)
- `fetchRecentVideos(channelId, sessionToken)` - Gets all videos with stats (paginated)
- `callGeminiAPI(data, sessionToken)` - Sends to `/api/ai/analyze` for AI insights

---

### **Frontend - main.js**
#### Earnings Calculator Functions
- `renderEarningsUI()` - Creates earnings estimator card + manual calculator card
- `updateAutoEarnings(totalViews)` - Updates auto earnings based on country CPM
- `manualEarningsCalc()` - Calculates custom earnings from user inputs
- `setupEarningsEvents(totalViews)` - Binds event listeners

#### Video Display Functions
- `displayVideos(videos, reset)` - Renders video list with pagination
- `loadChartJsIfNeeded()` - Lazy-loads Chart.js script
- `renderAllCharts()` (nested in displayVideos) - Renders individual video stat charts

#### Channel Comparison
- `addComparedChannel()` - Adds channel to comparison (from `compare.js`)
- `removeComparedChannel()` - Removes from comparison
- `renderComparisonCharts()` - Shows comparison charts (from `charts.js`)

---

### **Frontend - public/ui.js**
- `displayChannelInfo(channelData, sessionToken, addToDashboardCallback)` - Renders channel card
- `showNotification(msg, type)` - Shows toast notifications (success/error/warning/info)

---

### **Frontend - public/utils.js**
- `extractChannelId(input)` - Parses channel ID from URL or returns as-is
- `formatNumber(num)` - Formats large numbers (1B, 1M, 1K format)

---

### **Frontend - public/charts.js**
- `renderVideoStatsChart(ctx, views, likes, comments)` - Single video stat bar chart
- `renderComparisonCharts(comparedChannels)` - Multi-channel comparison charts
- `renderBarChart(canvasId, label, dataArr)` (nested) - Helper for bar charts

---

### **Frontend - public/compare.js**
- `addComparedChannel(channelData)` - Adds to comparison array
- `removeComparedChannel(idx)` - Removes by index
- `renderCompareSection()` - Renders comparison UI (exported: comparedChannels array)

---

### **Frontend - public/ai.js**
- `analyzeChannelTrendsWithAI(channelId, videos, channelData)` - Creates AI analysis section
- `performRealAIAnalysis(videos, channelData)` (nested) - Calls Gemini API
- `prepareDataForAI(videos, channelData)` (nested) - Formats data for AI prompt
- `displayAIAnalysis(insights)` (nested) - Renders AI insights card

---

### **Backend - backend.js**
#### Middleware
- `authenticateToken(req, res, next)` - JWT verification middleware

#### Auth Endpoints
- `POST /auth/google/callback` - Google OAuth verification → returns JWT session token

#### Tracked Channels Endpoints (protected by authenticateToken)
- `GET /api/tracked-channels` - Returns user's tracked channels
- `POST /api/tracked-channels` - Adds channel to tracking
- `DELETE /api/tracked-channels?channelId=X` - Removes tracked channel

#### Alerts Endpoints (protected)
- `GET /api/alerts?channelId=X` - Gets alert condition
- `POST /api/alerts?channelId=X` - Sets new alert condition

#### Snapshots Endpoints (protected)
- `GET /api/snapshots?channelId=X` - Gets channel growth snapshots
- `POST /api/snapshots?channelId=X` - Adds new snapshot

---

### **Backend - api/youtube.js** (Vercel Serverless)
- `handler(req, res)` - Proxies YouTube API requests
  - `GET /api/youtube?url=<encoded-youtube-api-url>`
  - Returns YouTube API response with CORS headers

---

### **Backend - api/tracked-channels.js** (Vercel Serverless)
- `verifyToken(req)` - Extracts and verifies JWT
- `handler(req, res)` - Handles tracked channels CRUD
  - `GET` - Fetch tracked channels
  - `POST` - Add channel
  - `DELETE` - Remove channel

---

### **Backend - api/alerts.js** (Vercel Serverless)
- `verifyToken(req)` - JWT verification
- `handler(req, res)` - Handles alert CRUD
  - `GET /api/alerts?channelId=X` - Get alert
  - `POST /api/alerts?channelId=X` - Set alert

---

### **Backend - api/snapshots.js** (Vercel Serverless)
- `verifyToken(req)` - JWT verification
- `handler(req, res)` - Handles snapshot CRUD
  - `GET /api/snapshots?channelId=X` - Get snapshots
  - `POST /api/snapshots?channelId=X` - Add snapshot

---

### **Backend - api/ai/analyze.js** (Vercel Serverless)
- `verifyToken(req)` - JWT verification
- `handler(req, res)` - Gemini AI analysis
  - `POST /api/ai/analyze` - Takes prompt, calls Gemini API

---

### **Backend - api/global-trends.js** (UNUSED ⚠️)
- `getGlobalTrends()` - Queries BigQuery for trending videos
- `handler(req, res)` - Returns BigQuery results
- **NOT CALLED** from frontend

---

### **Database - db_mock.js**
#### User Management
- `findOrCreateUser(profile)` - Creates user from Google profile
- `getUserById(googleId)` - Fetches user

#### Tracked Channels
- `addTrackedChannel(googleId, channelId, channelName)`
- `getTrackedChannels(googleId)`
- `removeTrackedChannel(googleId, channelId)`

#### Channel Snapshots
- `addChannelSnapshot(channelId, snapshot)`
- `getChannelSnapshots(channelId)`

#### Alert Conditions
- `setAlertCondition(googleId, channelId, condition)`
- `getAlertCondition(googleId, channelId)`

#### Utility
- `getAllUsers()` - Returns all users
- `getAllChannels()` - Returns all channels

---

### **Database - lib/supabase.js** (INCOMPLETE ⚠️)
#### User Management
- `findOrCreateUser(profile)` - Creates user in Supabase
- `getUserById(googleId)` - Fetches user

#### Tracked Channels
- `addTrackedChannel(googleId, channelId, channelName)` - INCOMPLETE in file ⚠️
- `getTrackedChannels(googleId)` - NOT IN CURRENT FILE
- `removeTrackedChannel(googleId, channelId)` - NOT IN CURRENT FILE

---

## 🎯 REFACTORING RECOMMENDATIONS

### Priority 1: CRITICAL (Fix First)
1. **Remove Duplicates** - Keep `public/` directory only, delete root duplicates
2. **Complete Supabase Integration** - Finish `lib/supabase.js` implementation
3. **Replace db_mock.js** - Point backend to Supabase instead

### Priority 2: HIGH (Fix Next Week)
4. **Extract Constants** - Create `config.js` for CPM_TABLE, API_BASE_URL
5. **Environment Variables** - Load CORS domains from `.env`
6. **Standardize API Calls** - Ensure all calls include session token

### Priority 3: MEDIUM (Fix Soon)
7. **Remove Unused Code** - Delete `api/global-trends.js`, unused imports
8. **Consolidate CSS** - Merge `google-signin-custom.css` into `master.css`
9. **Add Error Handling** - Improve error messages in all API functions

### Priority 4: LOW (Nice to Have)
10. **Add Loading States** - Better UX for long-running operations
11. **Code Comments** - Add JSDoc comments to complex functions
12. **Tests** - Add unit tests for utility functions

---

## 🔗 API FLOW DIAGRAM

```
User (Frontend)
    ↓
    ├→ Google OAuth Login
    │  ↓
    └→ backend.js: POST /auth/google/callback
       ↓
       Returns: JWT Session Token
       ↓
    ├→ Search YouTube Channel
    │  ↓
    │  api/youtube.js: GET /api/youtube?url=...
    │  ↓
    │  Returns: YouTube API Data
    │  ↓
    ├→ (Optional) Add to Dashboard
    │  ↓
    │  api/tracked-channels.js: POST /api/tracked-channels [HEADER: Auth Token]
    │  ↓
    │  lib/supabase.js: addTrackedChannel()
    │  ↓
    │  Returns: Success
    │  ↓
    ├→ Fetch AI Analysis
    │  ↓
    │  api/ai/analyze.js: POST /api/ai/analyze [HEADER: Auth Token]
    │  ↓
    │  Calls: Gemini API
    │  ↓
    │  Returns: AI Insights (JSON)
    │  ↓
    └→ Display Results
       ├ Channel Card
       ├ Video List with Stats
       ├ AI Analysis
       ├ Comparison Charts
       └ Earnings Calculator
```

---

## 🚀 DEPLOYMENT STATUS

- **Frontend**: Ready for Vercel
- **Backend**: Ready for Vercel (needs Supabase completion)
- **Database**: Supabase configured (schema exists, but `.js` functions incomplete)
- **Environment**: Needs `.env` configuration before deploy

---

## 📊 LIVE DEPENDENCIES AUDIT

**Frontend** (ES6 Modules):
- chart.js (lazy-loaded from CDN)
- Google Sign-In (loaded from HTML)
- Supabase JS SDK (in package.json but not used in frontend)

**Backend** (Node.js):
- express
- node-fetch
- cors
- dotenv
- google-auth-library
- jsonwebtoken
- @google-cloud/bigquery (for global-trends, not used)
- @supabase/supabase-js

---

## ✅ NEXT STEPS

Start with **PRIORITY 1** issues above. Suggest creating:
1. `config/constants.js` - CPM_TABLE, endpoints
2. `lib/supabase.js` - Complete all DB functions
3. Clean up duplicates
4. Test all API endpoints

This analysis is your blueprint. Which issue would you like to tackle first? 🚀
