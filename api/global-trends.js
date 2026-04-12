const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

async function getGlobalTrends() {
    const query = `
        SELECT
            video_title,
            view_count,
            like_count,
            comment_count,
            country_code
        FROM \`bigquery-public-data.youtube_trending.top_videos_24h\`
        ORDER BY view_count DESC
        LIMIT 10
    `;
    const options = {
        query: query,
        location: 'US',
    };
    const [rows] = await bigquery.query(options);
    return rows;
}

module.exports = async (req, res) => {
    try {
        const trends = await getGlobalTrends();
        res.status(200).json(trends);
    } catch (error) {
        console.error('Error fetching global trends:', error);
        res.status(500).json({ message: 'Error fetching global trends' });
    }
};
