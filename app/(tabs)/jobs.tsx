import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator, Linking, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

/* Jobs werden über /api/jobs (Vercel Serverless Proxy) geladen – kein direkter Browser-Aufruf */

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
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (query)    params.set('what', query);
    if (location) params.set('where', location);
    const res = await fetch(`/api/jobs?${params}`);
    if (!res.ok) return { jobs: [], total: 0, error: `HTTP ${res.status}` };
    const data = await res.json();
    if (data.error && !data.jobs?.length) return { jobs: [], total: 0, error: data.error };
    return { jobs: data.jobs ?? [], total: data.total ?? 0 };
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

  const loadJobs = async (q: string, loc: string) => {
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

  const summarize = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return text.length > 160 ? text.slice(0, 157) + '…' : text;
  };

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      {/* Sub-Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.back}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={s.title}>💼 Jobs in Zypern</Text>
        <Text style={s.subtitle}>Stellenangebote aus mehreren Quellen, täglich aktualisiert.</Text>
        <View style={s.headerActions}>
          <View style={s.countBadge}>
            <Text style={s.countIcon}>📋</Text>
            <Text style={s.countTxt}>
              {loading ? '…' : total > 0 ? total.toLocaleString('de') : '0'} Stellen
            </Text>
          </View>
          <TouchableOpacity style={[s.sitesBtn, showSites && s.sitesBtnActive]} onPress={() => setShowSites(v => !v)}>
            <Text style={s.sitesBtnTxt}>{showSites ? '▲' : '▼'} Job-Webseiten</Text>
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={{ color: '#aaa', marginTop: 12, fontSize: 13 }}>Stellenangebote werden geladen…</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.listContent}>
          {filtered.length === 0 ? (
            <View>
              {apiError ? (
                <View style={s.noKeyBox}>
                  <Text style={s.noKeyTitle}>⚠️ Fehler beim Laden</Text>
                  <Text style={s.noKeyText}>{apiError}</Text>
                  <TouchableOpacity style={s.noKeyBtn} onPress={() => loadJobs(search, location)}>
                    <Text style={s.noKeyBtnTxt}>↻ Erneut versuchen</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 24 }}>
                  <Text style={{ fontSize: 36 }}>🔍</Text>
                  <Text style={{ fontSize: 15, color: '#888', marginTop: 10 }}>Keine Stellen gefunden</Text>
                  <Text style={{ fontSize: 12, color: '#aaa', marginTop: 4, textAlign: 'center' }}>Direkt auf den Job-Webseiten suchen:</Text>
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
                {/* Quelle / Plattform-Badge */}
                <View style={s.jobSourceRow}>
                  <View style={s.jobSourceBadge}>
                    <Text style={s.jobSourceTxt} numberOfLines={1}>📢 {(job.source || '').toUpperCase()}</Text>
                  </View>
                  {job.created ? <Text style={s.jobDate}>{formatDate(job.created)}</Text> : null}
                </View>

                {/* Titel */}
                <Text style={s.jobTitle} numberOfLines={2}>{job.title}</Text>

                {/* Firma + Ort */}
                <View style={s.jobMeta}>
                  {job.company !== 'Unbekannt' && (
                    <View style={s.jobMetaItem}>
                      <Text style={s.jobMetaIcon}>🏢</Text>
                      <Text style={s.jobMetaTxt} numberOfLines={1}>{job.company}</Text>
                    </View>
                  )}
                  {job.location ? (
                    <View style={s.jobMetaItem}>
                      <Text style={s.jobMetaIcon}>📍</Text>
                      <Text style={s.jobMetaTxt} numberOfLines={1}>{job.location}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Zusammenfassung der Stelle */}
                {job.description ? (
                  <Text style={s.jobDesc} numberOfLines={3}>{summarize(job.description)}</Text>
                ) : null}

                {/* Button */}
                {job.url ? (
                  <TouchableOpacity style={s.jobBtn} onPress={() => openUrl(job.url)}>
                    <Text style={s.jobBtnTxt}>Anzeige ansehen ↗</Text>
                  </TouchableOpacity>
                ) : null}
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

  header: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  backBtn: { marginBottom: 4 },
  back: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 2 },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  countIcon: { fontSize: 14 },
  countTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  sitesBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  sitesBtnActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  sitesBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  sitesPanel: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 12 },
  siteRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  siteName: { color: '#fff', fontWeight: '700', fontSize: 14 },
  siteDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 },
  siteArrow: { color: '#fff', fontSize: 18, marginLeft: 10 },

  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 12, marginTop: 10, marginBottom: 4, borderRadius: 14, borderWidth: 1.5, borderColor: '#E0E8F0', paddingHorizontal: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 14, color: '#1A1A2E' },

  locScroll: { flexGrow: 0 },
  locRow: { paddingHorizontal: 12, gap: 8, paddingVertical: 8 },
  locChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#D0D8E8' },
  locChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  locTxt: { fontSize: 13, fontWeight: '700', color: '#555' },
  locTxtActive: { color: '#fff' },

  listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 40 },

  /* Job-Karte */
  jobCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 10, elevation: 3, overflow: 'hidden' },
  jobSourceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 },
  jobSourceBadge: { backgroundColor: Colors.primary + '18', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, flexShrink: 1 },
  jobSourceTxt: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  jobDate: { fontSize: 11, color: '#bbb', flexShrink: 0 },
  jobTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 8, lineHeight: 21 },
  jobMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  jobMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1, maxWidth: '48%' },
  jobMetaIcon: { fontSize: 12, flexShrink: 0 },
  jobMetaTxt: { fontSize: 12, color: '#555', fontWeight: '600', flexShrink: 1 },
  jobDesc: { fontSize: 12, color: '#777', lineHeight: 18, marginBottom: 12 },
  jobBtn: { backgroundColor: Colors.primary, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10, alignSelf: 'flex-start' },
  jobBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  noKeyBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  noKeyTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  noKeyText: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 12 },
  noKeyBtn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 12, marginBottom: 4 },
  noKeyBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center' },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 10, marginTop: 8 },
  siteCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  siteCardName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  siteCardDesc: { fontSize: 12, color: '#888' },
});
