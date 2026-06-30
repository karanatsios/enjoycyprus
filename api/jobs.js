export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const APP_ID  = process.env.ADZUNA_APP_ID  || process.env.EXPO_PUBLIC_ADZUNA_APP_ID;
  const APP_KEY = process.env.ADZUNA_APP_KEY || process.env.EXPO_PUBLIC_ADZUNA_APP_KEY;

  if (!APP_ID || !APP_KEY) {
    return res.status(500).json({ error: 'API keys not configured', jobs: [], total: 0 });
  }

  const { what = '', where = '', page = '1' } = req.query;

  const buildUrl = (country, w, loc) => {
    const p = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: '50',
      sort_by: 'date',
    });
    if (w)   p.set('what', w);
    if (loc) p.set('where', loc);
    return `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${p}`;
  };

  try {
    // Versuche zuerst Cyprus-Endpoint
    let r = await fetch(buildUrl('cy', what, where !== 'Alle Orte' ? where : ''));
    let data = r.ok ? await r.json() : null;

    // Fallback: GB mit "Cyprus" als Where
    if (!data || data.count === 0) {
      const gbWhere = where && where !== 'Alle Orte' ? `${where} Cyprus` : 'Cyprus';
      r = await fetch(buildUrl('gb', what, gbWhere));
      if (r.ok) data = await r.json();
    }

    if (!data) return res.status(502).json({ error: `Adzuna error ${r.status}`, jobs: [], total: 0 });

    const jobs = (data.results ?? []).map(j => ({
      id:          j.id,
      title:       j.title,
      company:     j.company?.display_name ?? '',
      location:    j.location?.display_name ?? '',
      description: j.description ?? '',
      url:         j.redirect_url,
      source:      j.adref ? new URL(j.redirect_url).hostname.replace('www.', '') : 'Adzuna',
      created:     j.created ?? '',
      salary_min:  j.salary_min ?? null,
      salary_max:  j.salary_max ?? null,
    }));

    return res.status(200).json({ jobs, total: data.count ?? 0 });
  } catch (e) {
    return res.status(500).json({ error: e.message, jobs: [], total: 0 });
  }
}
