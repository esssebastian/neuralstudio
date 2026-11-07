// Newsletter-gated Mac downloads: subscribe the email through the n8n webhook, then hand back the installer link.
// The links live in the DOWNLOADS env var (JSON {"slug": "url"}) so they never show up in this public repo or the page.
const WEBHOOK = 'https://n8n.srv864443.hstgr.cloud/webhook/neural-studio-subscribe';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const email = String(body.email || '').trim().toLowerCase();
  const app = String(body.app || '');
  const lang = body.lang === 'es' ? 'es' : 'en';

  let links = {};
  try { links = JSON.parse(process.env.DOWNLOADS || '{}'); } catch (e) {}

  if (email.length > 254 || !EMAIL.test(email)) return res.status(400).json({ error: 'email' });
  if (!links[app]) return res.status(404).json({ error: 'app' });

  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'mac-download', app, lang })
    });
    if (!r.ok) throw new Error('webhook ' + r.status);
  } catch (e) {
    console.error('[download] subscribe failed:', e.message);
    return res.status(502).json({ error: 'subscribe' });
  }

  return res.status(200).json({ url: links[app] });
};
