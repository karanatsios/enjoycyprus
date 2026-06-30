const SUPABASE_URL     = 'https://jewactcyhvzrceoiajau.supabase.co';
const SUPABASE_ANON    = 'sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { what = '', where = '' } = req.query;

  try {
    let url = `${SUPABASE_URL}/rest/v1/jobs?select=*&active=eq.true&order=created_at.desc&limit=100`;

    if (where && where !== 'Alle Orte') {
      url += `&city=ilike.*${encodeURIComponent(where)}*`;
    }

    const r = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
      },
    });

    if (!r.ok) return res.status(502).json({ error: `Supabase error ${r.status}`, jobs: [], total: 0 });

    let jobs = await r.json();

    // Client-side text filter
    if (what) {
      const q = what.toLowerCase();
      jobs = jobs.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.category?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ jobs, total: jobs.length });
  } catch (e) {
    return res.status(500).json({ error: e.message, jobs: [], total: 0 });
  }
}
