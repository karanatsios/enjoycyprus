import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator, Linking, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

/* ─── Adzuna API (kostenlos, 250 Req/Tag) ─── */
const ADZUNA_APP_ID  = process.env.EXPO_PUBLIC_ADZUNA_APP_ID  ?? '';
const ADZUNA_APP_KEY = process.env.EXPO_PUBLIC_ADZUNA_APP_KEY ?? '';

/* ─── Job-Webseiten ─── */
const JOB_SITES = [
  { name: 'ergodotisi.com',               url: 'https://www.ergodotisi.com',                     desc: 'Griechische Jobs auf Zypern' },
  { name: 'alpha.jobs',                   url: 'https://alpha.jobs',                             desc: 'Stellenangebote auf Zypern' },
  { name: 'cyprusjobs.com',               url: 'https://www.cyprusjobs.com',                     desc: 'Jobs in Cyprus' },
  { name: 'jobscyprus.com',               url: 'https://www.jobscyprus.com',                     desc: 'Jobportal für Zypern' },
  { name: 'carierista.com',               url: 'https://www.carierista.com/en/jobs',             desc: 'Karriere auf Zypern' },
  { name: 'kariera.com.cy',               url: 'https://www.kariera.com.cy',                     desc: 'Stellen auf Zypern' },
  { name: 'bazaraki.com/jobs',            url: 'https://www.bazaraki.com/jobs-and-services/',    desc: 'Kleinanzeigen & Jobs' },
];

/* ─── Ortsfilter ─── */
const LOCATIONS = ['Alle Orte', 'Famagusta', 'Larnaca', 'Limassol', 'Nicosia', 'Paphos', 'Kyrenia'];

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  created: string;
};

async function fetchAdzunaJobs(query: string, location: string, page = 1): Promise<{ jobs: Job[]; total: number; error?: string }> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return { jobs: [], total: 0 };
  try {
    // Adzuna: cy = Cyprus; wenn keine Ergebnisse, Fallback auf gb+cyprus
    const buildParams = (what: string, where: string) => {
      const p = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: '50',
        sort_by: 'date',
      });
      if (what)  p.set('what', what);
      if (where) p.set('where', where);
      return p;
    };

    const whereParam = location && location !== 'Alle Orte' ? location : '';
    const whatParam  = query || '';

    // Erst Cyprus-Endpoint probieren
    let res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/cy/search/${page}?${buildParams(whatParam, whereParam)}`
    );
    let data = res.ok ? await res.json() : null;

    // Falls keine Ergebnisse: GB-Endpoint mit "cyprus" als Where
    if (!data || (data.count === 0 && !query && location === 'Alle Orte')) {
      const fallbackWhere = whereParam ? `${whereParam} Cyprus` : 'Cyprus';
      res = await fetch(
        `https://api.adzuna.com/v1/api/jobs/gb/search/${page}?${buildParams(whatParam, fallbackWhere)}`
      );
      if (res.ok) data = await res.json();
    }

    if (!data) return { jobs: [], total: 0, error: `HTTP ${res.status}` };

    const jobs: Job[] = (data.results ?? []).map((r: any) => ({
      id:          r.id,
      title:       r.title,
      company:     r.company?.display_name ?? 'Unbekannt',
      location:    r.location?.display_name ?? '',
      description: r.description ?? '',
      url:         r.redirect_url,
      source:      'Adzuna',
      created:     r.created ?? '',
    }));
    return { jobs, total: data.count ?? 0 };
  } catch (e: any) {
    return { jobs: [], total: 0, error: e?.message ?? 'Netzwerkfehler' };
  }
}

export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs]             = useState<Job[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [location, setLocation]     = useState('Alle Orte');
  const [showSites, setShowSites]   = useState(false);
  const [apiError, setApiError]     = useState('');
  const [noApiKey]                  = useState(!ADZUNA_APP_ID);

  const loadJobs = async (q: string, loc: string) => {
    if (noApiKey) return;
    setLoading(true);
    setApiError('');
    const { jobs: j, total: t, error } = await fetchAdzunaJobs(q, loc);
    setJobs(j);
    setTotal(t);
    if (error) setApiError(error);
    setLoading(false);
  };

  useEffect(() => { loadJobs('', 'Alle Orte'); }, []);

  // Lokale Suche über bereits geladene Jobs
  const filtered = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const openUrl = (url: string) => {
    if (Platform.OS === 'web') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return ''; }
  };

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      {/* Sub-Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Zurück</Text></TouchableOpacity>
        </View>
        <Text style={s.title}>💼 Jobs in Zypern</Text>
        <Text style={s.subtitle}>Stellenangebote aus mehreren Quellen, täglich aktualisiert.</Text>
        <View style={s.headerActions}>
          <View style={s.countBadge}>
            <Text style={s.countIcon}>📋</Text>
            <Text style={s.countTxt}>{noApiKey ? '–' : total > 0 ? total.toLocaleString('de') : '...'} Stellen</Text>
          </View>
          <TouchableOpacity style={[s.sitesBtn, showSites && s.sitesBtnActive]} onPress={() => setShowSites(v => !v)}>
            <Text style={s.sitesBtnTxt}>{showSites ? '▲' : '▼'} Job Webseiten</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Job Webseiten Dropdown */}
      {showSites && (
        <View style={s.sitesPanel}>
          {JOB_SITES.map(site => (
            <TouchableOpacity key={site.name} style={s.siteRow} onPress={() => openUrl(site.url)}>
              <View style={{ flex: 1 }}>
                <Text style={s.siteName}>{site.name}</Text>
                <Text style={s.siteDesc}>{site.desc}</Text>
              </View>
              <Text style={s.siteArrow}>↗</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Suchleiste */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Suche: Titel, Firma, Kategorie..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: '#aaa', fontSize: 18, paddingRight: 8 }}>✕</Text></TouchableOpacity> : null}
      </View>
      {!noApiKey && <Text style={s.searchHint}>Durchsucht Titel, Firma, Beschreibung und Kategorie.</Text>}

      {/* Ortsfilter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.locScroll} contentContainerStyle={s.locRow}>
        {LOCATIONS.map(loc => (
          <TouchableOpacity
            key={loc}
            style={[s.locChip, location === loc && s.locChipActive]}
            onPress={() => { setLocation(loc); loadJobs(search, loc); }}
          >
            <Text style={[s.locTxt, location === loc && s.locTxtActive]}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Kein API-Key: Info + Sites */}
      {noApiKey ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          <View style={s.noKeyBox}>
            <Text style={s.noKeyTitle}>🔑 Adzuna API-Key benötigt</Text>
            <Text style={s.noKeyText}>
              Für echte Stellenangebote aus Zypern bitte einen kostenlosen Adzuna-Account erstellen:
            </Text>
            <TouchableOpacity style={s.noKeyBtn} onPress={() => openUrl('https://developer.adzuna.com/')}>
              <Text style={s.noKeyBtnTxt}>→ developer.adzuna.com (kostenlos)</Text>
            </TouchableOpacity>
            <Text style={s.noKeyText}>
              Danach in Vercel eintragen:{'\n'}
              <Text style={{ fontFamily: 'monospace', fontSize: 11 }}>EXPO_PUBLIC_ADZUNA_APP_ID{'\n'}EXPO_PUBLIC_ADZUNA_APP_KEY</Text>
            </Text>
          </View>

          <Text style={s.sectionTitle}>🌐 Job-Webseiten direkt besuchen</Text>
          {JOB_SITES.map(site => (
            <TouchableOpacity key={site.name} style={s.siteCard} onPress={() => openUrl(site.url)}>
              <View style={{ flex: 1 }}>
                <Text style={s.siteCardName}>{site.name}</Text>
                <Text style={s.siteCardDesc}>{site.desc}</Text>
              </View>
              <Text style={{ fontSize: 20 }}>↗</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 32 }}>
          {filtered.length === 0 ? (
            <View>
              {apiError ? (
                <View style={s.noKeyBox}>
                  <Text style={s.noKeyTitle}>⚠️ API-Fehler</Text>
                  <Text style={s.noKeyText}>{apiError}</Text>
                  <TouchableOpacity style={s.noKeyBtn} onPress={() => loadJobs(search, location)}>
                    <Text style={s.noKeyBtnTxt}>↻ Erneut versuchen</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 24 }}>
                  <Text style={{ fontSize: 36 }}>🔍</Text>
                  <Text style={{ fontSize: 15, color: '#888', marginTop: 10 }}>Keine Jobs über Adzuna gefunden</Text>
                  <Text style={{ fontSize: 12, color: '#aaa', marginTop: 4, textAlign: 'center', paddingHorizontal: 24 }}>Direkt auf den Job-Webseiten suchen:</Text>
                </View>
              )}
              <Text style={s.sectionTitle}>🌐 Job-Webseiten direkt besuchen</Text>
              {JOB_SITES.map(site => (
                <TouchableOpacity key={site.name} style={s.siteCard} onPress={() => openUrl(site.url)}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.siteCardName}>{site.name}</Text>
                    <Text style={s.siteCardDesc}>{site.desc}</Text>
                  </View>
                  <Text style={{ fontSize: 20 }}>↗</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            filtered.map(job => (
              <View key={job.id} style={s.jobCard}>
                <Text style={s.jobSource}>{job.source.toUpperCase()}</Text>
                <Text style={s.jobTitle}>{job.title}</Text>
                {job.location ? (
                  <View style={s.jobLocRow}>
                    <Text style={s.jobLocIcon}>📍</Text>
                    <Text style={s.jobLoc}>{job.location}</Text>
                  </View>
                ) : null}
                <Text style={s.jobCompany}>🏢 {job.company}</Text>
                <Text style={s.jobDesc} numberOfLines={3}>
                  {job.description.replace(/<[^>]*>/g, '').trim()}
                </Text>
                {job.created ? <Text style={s.jobDate}>{formatDate(job.created)}</Text> : null}
                <TouchableOpacity style={s.jobBtn} onPress={() => openUrl(job.url)}>
                  <Text style={s.jobBtnTxt}>Zur Anzeige ↗</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  header: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  back: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  countIcon: { fontSize: 14 },
  countTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  sitesBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  sitesBtnActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  sitesBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  sitesPanel: { backgroundColor: Colors.primary, marginHorizontal: 0, paddingHorizontal: 16, paddingBottom: 12 },
  siteRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  siteName: { color: '#fff', fontWeight: '700', fontSize: 14 },
  siteDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 },
  siteArrow: { color: '#fff', fontSize: 18, marginLeft: 10 },

  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 12, marginBottom: 4, borderRadius: 14, borderWidth: 1.5, borderColor: '#E0E8F0', paddingHorizontal: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 14, color: '#1A1A2E' },
  searchHint: { fontSize: 11, color: '#aaa', marginHorizontal: 16, marginBottom: 4 },

  locScroll: { flexGrow: 0, marginBottom: 4 },
  locRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  locChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#D0D8E8' },
  locChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  locTxt: { fontSize: 13, fontWeight: '700', color: '#555' },
  locTxtActive: { color: '#fff' },

  jobCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  jobSource: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: 6 },
  jobTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 6, lineHeight: 20 },
  jobLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  jobLocIcon: { fontSize: 12 },
  jobLoc: { fontSize: 12, color: '#666' },
  jobCompany: { fontSize: 12, color: '#555', marginBottom: 6 },
  jobDesc: { fontSize: 12, color: '#777', lineHeight: 18, marginBottom: 8 },
  jobDate: { fontSize: 11, color: '#bbb', marginBottom: 8 },
  jobBtn: { alignSelf: 'flex-end', backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  jobBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  noKeyBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  noKeyTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  noKeyText: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 12 },
  noKeyBtn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 12, marginBottom: 12 },
  noKeyBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center' },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  siteCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  siteCardName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  siteCardDesc: { fontSize: 12, color: '#888' },
});
