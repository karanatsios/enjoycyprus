import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, ActivityIndicator, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';

// ── Credit-Pakete ────────────────────────────────────────────────────
const PACKAGES = [
  { id: 'starter',   label: 'Starter',   credits: 1,   price: 5,   unit: '5,00 € / Aktion', popular: false, color: '#27AE60' },
  { id: 'basic',     label: 'Basic',     credits: 5,   price: 20,  unit: '4,00 € / Aktion', popular: false, color: '#2980B9' },
  { id: 'pro',       label: 'Pro',       credits: 15,  price: 45,  unit: '3,00 € / Aktion', popular: true,  color: Colors.primary },
  { id: 'business',  label: 'Business',  credits: 40,  price: 99,  unit: '2,48 € / Aktion', popular: false, color: '#8E44AD' },
  { id: 'unlimited', label: 'Unlimited', credits: 999, price: 199, unit: 'Unbegrenzt / Jahr', popular: false, color: '#C0392B' },
];

const RADII = [
  { label: '5 km',  value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
];

type Tab = 'aktion' | 'kampagnen' | 'credits';

export default function MarketingScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('aktion');
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [radius, setRadius] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locName, setLocName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) { fetchCredits(u.id); fetchCampaigns(u.id); }
      setLoading(false);
    });
  }, []);

  async function fetchCredits(userId: string) {
    const { data } = await supabase.from('notification_credits').select('credits').eq('user_id', userId).single();
    setCredits(data?.credits ?? 0);
  }

  async function fetchCampaigns(userId: string) {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20);
    if (data) setCampaigns(data);
  }

  function getLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setMsg({ type: 'err', text: 'Standort nicht verfügbar.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocName(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setUseMyLocation(true);
      },
      () => setMsg({ type: 'err', text: 'Standort konnte nicht ermittelt werden.' })
    );
  }

  async function sendCampaign() {
    if (!user) return;
    if (credits < 1) { setMsg({ type: 'err', text: 'Nicht genug Credits. Bitte Paket kaufen.' }); return; }
    if (!businessName || !title || !body) { setMsg({ type: 'err', text: 'Bitte alle Pflichtfelder ausfüllen.' }); return; }
    if (!lat || !lng) { setMsg({ type: 'err', text: 'Bitte Standort festlegen.' }); return; }
    if (!startDate || !startTime || !endTime) { setMsg({ type: 'err', text: 'Bitte Datum und Uhrzeiten angeben.' }); return; }

    setSending(true);
    setMsg(null);
    try {
      const startsAt = new Date(`${startDate}T${startTime}`);
      const endsAt = new Date(`${startDate}T${endTime}`);
      if (endsAt <= startsAt) { setMsg({ type: 'err', text: 'Endzeit muss nach Startzeit liegen.' }); setSending(false); return; }

      const { error } = await supabase.from('notifications').insert({
        user_id: user.id,
        business_name: businessName,
        title,
        body,
        lat,
        lng,
        location: `SRID=4326;POINT(${lng} ${lat})`,
        radius_km: radius,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: 'scheduled',
        credits_used: 1,
      });

      if (error) throw error;

      // Deduct credit
      await supabase.from('notification_credits').upsert({
        user_id: user.id,
        credits: Math.max(0, credits - 1),
      }, { onConflict: 'user_id' });

      setCredits(c => Math.max(0, c - 1));
      setMsg({ type: 'ok', text: '✅ Aktion wurde geplant! Sie wird zur gewählten Zeit versendet.' });
      setTitle(''); setBody(''); setBusinessName(''); setStartDate(''); setStartTime(''); setEndTime('');
      fetchCampaigns(user.id);
    } catch (e: any) {
      setMsg({ type: 'err', text: e.message || 'Fehler beim Erstellen.' });
    }
    setSending(false);
  }

  function openStripe(pkg: typeof PACKAGES[0]) {
    // Stripe Payment Link – hier deine echten Links einsetzen
    const links: Record<string, string> = {
      starter:   'https://buy.stripe.com/REPLACE_STARTER',
      basic:     'https://buy.stripe.com/REPLACE_BASIC',
      pro:       'https://buy.stripe.com/REPLACE_PRO',
      business:  'https://buy.stripe.com/REPLACE_BUSINESS',
      unlimited: 'https://buy.stripe.com/REPLACE_UNLIMITED',
    };
    const url = links[pkg.id];
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (loading) {
    return <SafeAreaView style={s.safe}><ActivityIndicator color={Colors.primary} style={{ marginTop: 80 }} /></SafeAreaView>;
  }

  if (!user) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Zurück</Text></TouchableOpacity>
          <Text style={s.topTitle}>Marketing</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={s.loginBox}>
          <Text style={s.loginIcon}>🔐</Text>
          <Text style={s.loginTitle}>Login erforderlich</Text>
          <Text style={s.loginSub}>Bitte melden Sie sich in „Mein Eintrag" an, um Push-Aktionen zu erstellen.</Text>
          <TouchableOpacity style={s.loginBtn} onPress={() => router.push('/(tabs)/mein-eintrag' as any)}>
            <Text style={s.loginBtnText}>→ Zum Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Top Bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Zurück</Text></TouchableOpacity>
        <Text style={s.topTitle}>Marketing</Text>
        <View style={s.creditBadge}>
          <Text style={s.creditNum}>{credits === 999 ? '∞' : credits}</Text>
          <Text style={s.creditLabel}>Credits</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {(['aktion', 'kampagnen', 'credits'] as Tab[]).map(t => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === 'aktion' ? '📣 Aktion' : t === 'kampagnen' ? '📋 Meine' : '💳 Credits'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── TAB: AKTION ERSTELLEN ── */}
        {tab === 'aktion' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>📣 Push-Aktion erstellen</Text>
            <Text style={s.cardSub}>
              Ihre Kunden in der Nähe erhalten eine Push-Benachrichtigung – direkt auf das Handy.
            </Text>

            {/* Unternehmensname */}
            <Text style={s.label}>Unternehmensname <Text style={s.req}>*</Text></Text>
            <TextInput style={s.input} placeholder="z.B. My German Döner" value={businessName} onChangeText={setBusinessName} placeholderTextColor="#bbb" />

            {/* Titel */}
            <Text style={s.label}>Titel der Aktion <Text style={s.req}>*</Text></Text>
            <TextInput style={s.input} placeholder="z.B. Happy Hour – 20% auf alles!" value={title} onChangeText={setTitle} placeholderTextColor="#bbb" maxLength={60} />
            <Text style={s.charCount}>{title.length}/60</Text>

            {/* Nachricht */}
            <Text style={s.label}>Nachricht <Text style={s.req}>*</Text></Text>
            <TextInput
              style={[s.input, s.textarea]}
              placeholder="z.B. Heute von 17–23 Uhr: Döner + Getränk für 8 € statt 12 €. Nur solange der Vorrat reicht!"
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={3}
              maxLength={160}
              placeholderTextColor="#bbb"
            />
            <Text style={s.charCount}>{body.length}/160</Text>

            {/* Standort */}
            <Text style={s.label}>Standort (Mittelpunkt) <Text style={s.req}>*</Text></Text>
            <View style={s.locRow}>
              <TouchableOpacity style={[s.locBtn, useMyLocation && s.locBtnActive]} onPress={getLocation}>
                <Text style={s.locBtnText}>📍 {useMyLocation ? locName : 'Mein Standort'}</Text>
              </TouchableOpacity>
            </View>
            {!useMyLocation && (
              <Text style={s.locHint}>Tippen Sie auf „Mein Standort", um Ihren aktuellen Standort zu verwenden.</Text>
            )}

            {/* Radius */}
            <Text style={s.label}>Radius</Text>
            <View style={s.radioRow}>
              {RADII.map(r => (
                <TouchableOpacity
                  key={r.value}
                  style={[s.radioBtn, radius === r.value && s.radioBtnActive]}
                  onPress={() => setRadius(r.value)}
                >
                  <Text style={[s.radioBtnText, radius === r.value && s.radioBtnTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Datum & Uhrzeit */}
            <Text style={s.label}>Datum <Text style={s.req}>*</Text></Text>
            <TextInput style={s.input} placeholder="2026-07-01" value={startDate} onChangeText={setStartDate} placeholderTextColor="#bbb" />

            <View style={s.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Von <Text style={s.req}>*</Text></Text>
                <TextInput style={s.input} placeholder="17:00" value={startTime} onChangeText={setStartTime} placeholderTextColor="#bbb" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Bis <Text style={s.req}>*</Text></Text>
                <TextInput style={s.input} placeholder="23:00" value={endTime} onChangeText={setEndTime} placeholderTextColor="#bbb" />
              </View>
            </View>

            {/* Feedback */}
            {msg && (
              <View style={[s.msgBox, msg.type === 'ok' ? s.msgOk : s.msgErr]}>
                <Text style={[s.msgText, msg.type === 'ok' ? s.msgTextOk : s.msgTextErr]}>{msg.text}</Text>
              </View>
            )}

            {/* Kosten-Info */}
            <View style={s.costBox}>
              <Text style={s.costIcon}>💳</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.costTitle}>Kosten: 1 Credit</Text>
                <Text style={s.costSub}>Sie haben noch {credits === 999 ? '∞' : credits} Credits. {credits < 1 && 'Bitte kaufen Sie zuerst Credits.'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.sendBtn, (sending || credits < 1) && s.sendBtnDisabled]}
              onPress={sendCampaign}
              disabled={sending || credits < 1}
            >
              {sending
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.sendBtnText}>📣 Aktion jetzt planen</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* ── TAB: MEINE KAMPAGNEN ── */}
        {tab === 'kampagnen' && (
          <View>
            {campaigns.length === 0 ? (
              <View style={s.emptyBox}>
                <Text style={s.emptyIcon}>📋</Text>
                <Text style={s.emptyTitle}>Noch keine Aktionen</Text>
                <Text style={s.emptySub}>Erstellen Sie Ihre erste Push-Aktion im Tab „Aktion".</Text>
              </View>
            ) : (
              campaigns.map(c => (
                <View key={c.id} style={s.campaignCard}>
                  <View style={s.campaignTop}>
                    <Text style={s.campaignTitle}>{c.title}</Text>
                    <StatusBadge status={c.status} />
                  </View>
                  <Text style={s.campaignBiz}>{c.business_name}</Text>
                  <Text style={s.campaignBody} numberOfLines={2}>{c.body}</Text>
                  <View style={s.campaignMeta}>
                    <Text style={s.campaignMetaText}>📍 {c.radius_km} km Radius</Text>
                    <Text style={s.campaignMetaText}>🕐 {formatDate(c.starts_at)} – {formatTime(c.ends_at)}</Text>
                    <Text style={s.campaignMetaText}>👥 {c.recipients_count ?? 0} Empfänger</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ── TAB: CREDITS KAUFEN ── */}
        {tab === 'credits' && (
          <View>
            <View style={s.creditsHeader}>
              <Text style={s.creditsHeaderTitle}>Ihr Guthaben</Text>
              <View style={s.creditsBigBadge}>
                <Text style={s.creditsBigNum}>{credits === 999 ? '∞' : credits}</Text>
                <Text style={s.creditsBigLabel}>Credits</Text>
              </View>
              <Text style={s.creditsHeaderSub}>1 Credit = 1 Push-Aktion an alle Nutzer im gewählten Radius</Text>
            </View>

            <Text style={s.packagesTitle}>PAKETE KAUFEN</Text>
            {PACKAGES.map(pkg => (
              <TouchableOpacity key={pkg.id} style={[s.packageCard, pkg.popular && s.packageCardPopular]} onPress={() => openStripe(pkg)}>
                {pkg.popular && <View style={s.popularBadge}><Text style={s.popularBadgeText}>BELIEBT</Text></View>}
                <View style={s.packageLeft}>
                  <Text style={[s.packageLabel, { color: pkg.color }]}>{pkg.label}</Text>
                  <Text style={s.packageCredits}>{pkg.credits === 999 ? '∞ Aktionen' : `${pkg.credits} Aktionen`}</Text>
                  <Text style={s.packageUnit}>{pkg.unit}</Text>
                </View>
                <View style={s.packageRight}>
                  <Text style={[s.packagePrice, { color: pkg.color }]}>{pkg.price} €</Text>
                  <View style={[s.packageBtn, { backgroundColor: pkg.color }]}>
                    <Text style={s.packageBtnText}>Kaufen</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View style={s.infoBox}>
              <Text style={s.infoTitle}>ℹ️ So funktioniert's</Text>
              <Text style={s.infoText}>
                {'1. Paket kaufen → Credits landen sofort auf Ihrem Konto\n'}
                {'2. Aktion erstellen: Titel, Nachricht, Radius & Zeit\n'}
                {'3. Zur gewählten Zeit erhalten alle Nutzer im Radius eine Push-Notification\n'}
                {'4. Sie sehen die Reichweite (Empfängeranzahl) in „Meine Aktionen"'}
              </Text>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; label: string }> = {
    scheduled: { color: '#D4891A', label: '⏳ Geplant' },
    sent:      { color: '#27AE60', label: '✅ Gesendet' },
    expired:   { color: '#888',    label: '⌛ Abgelaufen' },
    cancelled: { color: '#E74C3C', label: '❌ Abgebrochen' },
  };
  const c = configs[status] ?? { color: '#888', label: status };
  return (
    <View style={[bs.badge, { borderColor: c.color, backgroundColor: c.color + '15' }]}>
      <Text style={[bs.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

const bs = StyleSheet.create({
  badge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  topBar: {
    backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  back: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  creditBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minWidth: 60 },
  creditNum: { color: '#fff', fontSize: 18, fontWeight: '800' },
  creditLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 9, fontWeight: '700' },

  tabRow: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: '#E8EEF5' },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: '#F0F4FA' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: '#888' },
  tabTextActive: { color: '#fff' },

  card: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#888', lineHeight: 18, marginBottom: 20 },

  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 4 },
  req: { color: '#E74C3C' },
  input: { borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1A1A2E', backgroundColor: '#FAFAFA', marginBottom: 4 },
  textarea: { height: 90, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: '#bbb', textAlign: 'right', marginBottom: 12 },

  locRow: { marginBottom: 4 },
  locBtn: { borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#FAFAFA' },
  locBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  locBtnText: { fontSize: 14, color: '#444', fontWeight: '600' },
  locHint: { fontSize: 11, color: '#bbb', marginBottom: 12 },

  radioRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  radioBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: '#D0D8E8', alignItems: 'center', backgroundColor: '#F5F6FA' },
  radioBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  radioBtnText: { fontSize: 13, fontWeight: '700', color: '#666' },
  radioBtnTextActive: { color: '#fff' },

  timeRow: { flexDirection: 'row', gap: 12 },

  msgBox: { borderRadius: 12, padding: 12, marginBottom: 12 },
  msgOk: { backgroundColor: '#EAFAF1', borderWidth: 1, borderColor: '#27AE60' },
  msgErr: { backgroundColor: '#FDEDEC', borderWidth: 1, borderColor: '#E74C3C' },
  msgText: { fontSize: 13, fontWeight: '600' },
  msgTextOk: { color: '#27AE60' },
  msgTextErr: { color: '#E74C3C' },

  costBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F0F7FF', borderRadius: 12, padding: 12, marginBottom: 16 },
  costIcon: { fontSize: 22 },
  costTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  costSub: { fontSize: 11, color: '#888', marginTop: 2 },

  sendBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#B0C4DE' },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  emptyBox: { alignItems: 'center', padding: 48, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },
  emptySub: { fontSize: 13, color: '#888', textAlign: 'center' },

  campaignCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  campaignTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  campaignTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: '#1A1A2E', paddingRight: 8 },
  campaignBiz: { fontSize: 11, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  campaignBody: { fontSize: 12, color: '#666', lineHeight: 17, marginBottom: 8 },
  campaignMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  campaignMetaText: { fontSize: 11, color: '#888' },

  creditsHeader: { backgroundColor: Colors.primary, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center', gap: 6 },
  creditsHeaderTitle: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  creditsBigBadge: { alignItems: 'center' },
  creditsBigNum: { color: '#fff', fontSize: 52, fontWeight: '800' },
  creditsBigLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '600' },
  creditsHeaderSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, textAlign: 'center' },

  packagesTitle: { fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8 },

  packageCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10,
    borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    position: 'relative',
  },
  packageCardPopular: { borderWidth: 2, borderColor: Colors.primary },
  popularBadge: { position: 'absolute', top: -10, right: 16, backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  popularBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  packageLeft: { flex: 1 },
  packageLabel: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  packageCredits: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  packageUnit: { fontSize: 11, color: '#888', marginTop: 2 },
  packageRight: { alignItems: 'flex-end', gap: 8 },
  packagePrice: { fontSize: 24, fontWeight: '800' },
  packageBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  packageBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  infoBox: { backgroundColor: '#F0F7FF', margin: 16, borderRadius: 16, padding: 16 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#555', lineHeight: 20 },

  loginBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
  loginIcon: { fontSize: 48 },
  loginTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  loginSub: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 18 },
  loginBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28, marginTop: 8 },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
