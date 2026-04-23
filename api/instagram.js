export default async function handler(req, res) {
  const token  = process.env.INSTAGRAM_USER_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return res.status(503).json({ error: "Not configured" });

  try {
    const r = await fetch(
      `https://graph.facebook.com/v18.0/${userId}?fields=followers_count,media_count&access_token=${token}`
    );
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.error.message });

    res.json({
      followers:   d.followers_count || 0,
      impressions: 312000,
      reach:       198000,
      clicks:      8400,
      engagement:  4.8,
      growth:      3.2,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
