import { requireUser } from "./_auth.js";

// Only signed-in staff can use the studio key, and only for the model the
// dashboard assistant uses.
const STAFF_ROLES = ["super_admin", "team_lead", "social_media_manager", "member"];
const ALLOWED_MODELS = new Set(["claude-sonnet-4-20250514"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!(await requireUser(req, res, { roles: STAFF_ROLES }))) return;
  if (!ALLOWED_MODELS.has(req.body?.model)) return res.status(400).json({ error: "Model not allowed" });
  const max_tokens = Math.min(Number(req.body.max_tokens) || 1000, 4000);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ ...req.body, max_tokens }),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
