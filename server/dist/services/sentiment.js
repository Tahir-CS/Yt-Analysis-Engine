"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAndStoreCommentSentiment = analyzeAndStoreCommentSentiment;
exports.findSimilarComments = findSimilarComments;
const genai_1 = require("@google/genai");
const db_1 = require("../db");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: VECTOR EMBEDDINGS & HNSW SEARCH
 * ----------------------------------------------------------------------------
 * Natural language processing (NLP) to understand audience sentiment.
 * We convert raw comment text into 768-dimensional float arrays (embeddings).
 * We store these in pgvector, which allows us to perform lightning-fast
 * cosine-similarity searches to find comments with identical "vibes" and cluster
 * audiences by sentiment types.
 * ============================================================================
 */
async function analyzeAndStoreCommentSentiment(creatorId, videoId, commentText) {
    try {
        // 1. Generate text embedding vector using Gemini
        const embeddingResponse = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: commentText,
        });
        // We expect an array of numbers representing semantic meaning
        const embeddingVector = embeddingResponse.embeddings?.[0]?.values;
        if (!embeddingVector) {
            throw new Error('Failed to generate embedding vector from Gemini');
        }
        // 2. Generate a simple sentiment score for quick tabular filtering
        // (We prompt a small model to just give a -1.0 to 1.0 float)
        const sentimentPrompt = `Analyze the sentiment of this YouTube comment. Reply with ONLY a floating point number between -1.0 (extremely negative) and 1.0 (extremely positive).\n\nComment: "${commentText}"`;
        const scoreResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: sentimentPrompt
        });
        const sentimentScore = parseFloat(scoreResponse.text || '0');
        // 3. Store in Postgres using pgvector
        // Notice the specific vector string casting: '[0.1, 0.2, ...]'
        await (0, db_1.query)(`INSERT INTO comment_sentiments (creator_id, video_id, comment_text, sentiment_score, embedding)
       VALUES ($1, $2, $3, $4, $5)`, [creatorId, videoId, commentText, sentimentScore, JSON.stringify(embeddingVector)]);
        console.log(`[Sentiment] Stored embedding and score (${sentimentScore}) for creator ${creatorId}`);
    }
    catch (error) {
        console.error(`[Sentiment Error]:`, error.message);
    }
}
/**
 * Finds the top N most semantically similar comments using HNSW Cosine Distance operator (<=>).
 */
async function findSimilarComments(commentText, limit = 5) {
    const embeddingResponse = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: commentText,
    });
    const embeddingVector = embeddingResponse.embeddings?.[0]?.values;
    // The <=> operator is provided by pgvector for Cosine Distance
    // The HNSW index makes this O(log N) instead of O(N) full table scan
    const res = await (0, db_1.query)(`SELECT comment_text, sentiment_score, 1 - (embedding <=> $1) as similarity
     FROM comment_sentiments
     ORDER BY embedding <=> $1 ASC
     LIMIT $2`, [JSON.stringify(embeddingVector), limit]);
    return res.rows;
}
