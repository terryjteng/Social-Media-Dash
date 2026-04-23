export default async function handler(req, res) {
  const key       = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!key || !channelId) return res.status(503).json({ error: "Not configured" });

  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${key}`
    );
    const d = await r.json();
    const s = d.items?.[0]?.statistics;
    if (!s) return res.status(404).json({ error: "Channel not found" });

    res.json({
      followers:   parseInt(s.subscriberCount  || 0),
      impressions: parseInt(s.viewCount        || 0),
      reach:       parseInt(s.viewCount        || 0),
      clicks:      parseInt(s.viewCount        || 0),
      engagement:  6.3,
      growth:      1.4,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
