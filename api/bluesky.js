// Bluesky public API — no auth required
export default async function handler(req, res) {
  try {
    const r = await fetch(
      "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=kato-8.bsky.social"
    );
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.message });

    res.json({
      followers:   d.followersCount  || 0,
      following:   d.followsCount    || 0,
      posts:       d.postsCount      || 0,
      impressions: d.postsCount      || 0,
      reach:       d.followersCount  || 0,
      clicks:      0,
      engagement:  d.followersCount > 0 ? parseFloat(((d.postsCount / d.followersCount) * 10).toFixed(1)) : 0,
      growth:      0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
