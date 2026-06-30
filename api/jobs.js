/* Fetches Cyprus job listings from public RSS feeds of real job sites */

const RSS_SOURCES = [
  { name: 'carierista.com', url: 'https://www.carierista.com/en/rss/jobs' },
  { name: 'cyprusjobs.com', url: 'https://www.cyprusjobs.com/rss/jobs.xml' },
  { name: 'bazaraki.com',   url: 'https://www.bazaraki.com/jobs-and-services/?category=1&type=rss' },
];

function parseRSSItem(item, source) {
  const get = (tag) => {
    const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
           || item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return m ? m[1].trim() : '';
  };
  const title       = get('title');
  const link        = get('link') || get('guid');
  const description = get('description');
  const pubDate     = get('pubDate');
  const company     = get('author') || get('dc:creator') || '';
  const location    = get('location') || 'Zypern';
  const guid        = get('guid') || link;

  if (!title || !link) return null;

  return {
    id:          guid,
    title,
    company,
    location,
    description: description.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(),
    url:         link,
    source,
    created:     pubDate ? new Date(pubDate).toISOString() : '',
    salary_min:  null,
    salary_max:  null,
  };
}

async function fetchRSS(source) {
  try {
    const res = await fetch(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InsideCyprus/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
    return items.map(item => parseRSSItem(item, source.name)).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300'); // 5 Min Cache
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { what = '', where = '' } = req.query;

  try {
    const results = await Promise.all(RSS_SOURCES.map(fetchRSS));
    let jobs = results.flat();

    // Filter nach Ort wenn angegeben
    if (where && where !== 'Alle Orte') {
      const w = where.toLowerCase();
      jobs = jobs.filter(j =>
        j.location.toLowerCase().includes(w) ||
        j.title.toLowerCase().includes(w) ||
        j.description.toLowerCase().includes(w)
      );
    }

    // Filter nach Suchbegriff
    if (what) {
      const q = what.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }

    // Sortiere nach Datum (neueste zuerst)
    jobs.sort((a, b) => {
      if (!a.created) return 1;
      if (!b.created) return -1;
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    return res.status(200).json({ jobs, total: jobs.length });
  } catch (e) {
    return res.status(500).json({ error: e.message, jobs: [], total: 0 });
  }
}
