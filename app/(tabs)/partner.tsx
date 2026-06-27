import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, ActivityIndicator, Alert, Clipboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../lib/supabase';

const APP_URL = 'https://cyprus-app-two.vercel.app';

type Mode = 'register' | 'login' | 'dashboard';

type Partner = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  affiliate_code: string;
  balance: number;
  paid_out: number;
  provisions: number;
  created_at: string;
};

function generateCode(): string {
  return 'CYPRUS_' + Math.floor(10000 + Math.random() * 90000);
}

function PasswordInput({ label, value, onChange, placeholder }: any) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.passwordRow}>
        <TextInput
          style={[s.input, { flex: 1, borderWidth: 0 }]}
          placeholder={placeholder ?? label}
          placeholderTextColor="#bbb"
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => setVisible(v => !v)} style={s.eyeBtn}>
          <Text style={s.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PartnerScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      await loadPartner(data.session.user.id);
    }
    setChecking(false);
  };

  const loadPartner = async (userId: string) => {
    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (data) {
      setPartner(data);
      setMode('dashboard');
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) { Alert.alert('Fehler', 'Bitte gib deinen Namen ein.'); return; }
    if (!email.trim()) { Alert.alert('Fehler', 'Bitte gib deine E-Mail ein.'); return; }
    if (password.length < 6) { Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein.'); return; }
    if (password !== passwordConfirm) { Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein.'); return; }

    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setLoading(false);
      Alert.alert('Fehler', authError.message);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) { setLoading(false); return; }

    const code = generateCode();
    const { data: partnerData, error: partnerError } = await supabase
      .from('partners')
      .insert({ user_id: userId, name, email, affiliate_code: code, balance: 0, paid_out: 0, provisions: 0 })
      .select()
      .single();

    setLoading(false);
    if (partnerError) {
      Alert.alert('Fehler', 'Registrierung fehlgeschlagen: ' + partnerError.message);
      return;
    }

    // GHL Webhook — Tag "Partner" setzen + Willkommens-E-Mail auslösen
    const affiliateLink = `https://cyprus-app-two.vercel.app?ref=${code}`;
    fetch('https://services.leadconnectorhq.com/hooks/k6wQ1eQsdB3AUdeOkN4Q/webhook-trigger/5bffab59-2476-4e58-bfd2-6fa7c01c671e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'partner_registered',
        name,
        email,
        affiliate_code: code,
        affiliate_link: affiliateLink,
        partner_id: partnerData.id,
        registered_at: new Date().toISOString(),
        tags: ['Partner'],
      }),
    }).catch(() => null); // Fehler still ignorieren — Registrierung trotzdem erfolgreich

    setPartner(partnerData);
    setMode('dashboard');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) { Alert.alert('Fehler', 'Bitte E-Mail und Passwort eingeben.'); return; }
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      Alert.alert('Fehler', 'Ungültige E-Mail oder Passwort.');
      return;
    }
    await loadPartner(authData.user.id);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPartner(null);
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setName('');
    setMode('register');
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Kopiert', `${label} wurde in die Zwischenablage kopiert.`);
  };

  if (checking) {
    return (
      <SafeAreaView style={s.safe}>
        <AppHeader />
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────
  if (mode === 'dashboard' && partner) {
    const affiliateLink = `${APP_URL}?ref=${partner.affiliate_code}`;
    return (
      <SafeAreaView style={s.safe}>
        <AppHeader />
        <View style={s.subHeader}>
          <View style={s.subHeaderRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <Text style={s.backText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.subHeaderTitle}>Partner</Text>
            <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
              <Text style={s.logoutText}>Ausloggen</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.welcomeName}>Willkommen, {partner.name}!</Text>
          <Text style={s.welcomeEmail}>{partner.email}</Text>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Guthaben */}
          <View style={s.balanceCard}>
            <Text style={s.balanceAmount}>{partner.balance.toFixed(2)} €</Text>
            <Text style={s.balanceLabel}>Aktuelles Guthaben</Text>
          </View>

          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={s.statAmount}>{partner.paid_out.toFixed(2)} €</Text>
              <Text style={s.statLabel}>Auszahlbar verdient</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statAmount}>{partner.provisions}</Text>
              <Text style={s.statLabel}>Provisionen</Text>
            </View>
          </View>

          {/* Affiliate Code */}
          <View style={[s.codeCard, s.codeCardActive]}>
            <Text style={s.codeCardLabel}>Dein Rabattcode</Text>
            <Text style={s.codeText}>{partner.affiliate_code}</Text>
            <Text style={s.codeDesc}>Kunden zahlen 49,00 € statt 59,00 € · Du erhältst 10,00 € Provision</Text>
            <TouchableOpacity style={s.copyBtn} onPress={() => copyToClipboard(partner.affiliate_code, 'Dein Rabattcode')}>
              <Text style={s.copyBtnText}>📋 Kopieren</Text>
            </TouchableOpacity>
          </View>

          {/* Affiliate Link */}
          <View style={s.codeCard}>
            <Text style={s.codeCardLabel}>Dein Affiliate-Link</Text>
            <Text style={s.linkText} numberOfLines={2}>{affiliateLink}</Text>
            <Text style={s.codeDesc}>25% Provision (14,75 €) · auch bei Verlängerungen</Text>
            <TouchableOpacity style={s.copyBtn} onPress={() => copyToClipboard(affiliateLink, 'Dein Affiliate-Link')}>
              <Text style={s.copyBtnText}>📋 Kopieren</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={s.infoCard}>
            <Text style={s.infoTitle}>💡 So funktioniert es</Text>
            <Text style={s.infoText}>Teile deinen Code oder Link mit Unternehmen. Sobald jemand zahlt, wird die Provision automatisch gutgeschrieben. Auszahlung ab 20 EUR.</Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Register / Login ─────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />
      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>Partner werden</Text>
          <View style={{ minWidth: 70 }} />
        </View>
        <Text style={s.subHeaderDomain}>enjoycyprus.de</Text>
        <Text style={s.subHeaderTagline}>💰 Verdiene Provision</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Vorteile */}
        <View style={s.benefitRow}>
          <View style={s.benefitCard}>
            <Text style={s.benefitTitle}>Rabattcode</Text>
            <Text style={s.benefitAmount}>10,00 €</Text>
            <Text style={s.benefitSub}>Pro Nutzung deines Codes. Kunden sparen 10 €.</Text>
          </View>
          <View style={s.benefitCard}>
            <Text style={s.benefitTitle}>Affiliate-Link</Text>
            <Text style={s.benefitAmount}>14,75 €</Text>
            <Text style={s.benefitSub}>25% Provision. Auch bei Verlängerungen!</Text>
          </View>
        </View>

        <View style={s.infoCard}>
          <Text style={s.infoText}>Nach der Registrierung erhältst du deinen persönlichen Link und einen Rabattcode. Teile beides mit Firmen die du kennst — sobald jemand zahlt wird deine Provision automatisch gutgeschrieben. Auszahlung ab 20 EUR.</Text>
        </View>

        {/* Tab-Umschalter */}
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tab, mode === 'register' && s.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[s.tabText, mode === 'register' && s.tabTextActive]}>Registrieren</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, mode === 'login' && s.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[s.tabText, mode === 'login' && s.tabTextActive]}>Einloggen</Text>
          </TouchableOpacity>
        </View>

        {mode === 'register' && (
          <View>
            <View style={s.fieldWrap}>
              <Text style={s.label}>Dein Name</Text>
              <TextInput style={s.input} placeholder="Dein Name" placeholderTextColor="#bbb"
                value={name} onChangeText={setName} autoCorrect={false} />
            </View>
            <View style={s.fieldWrap}>
              <Text style={s.label}>E-Mail</Text>
              <TextInput style={s.input} placeholder="deine@email.de" placeholderTextColor="#bbb"
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <PasswordInput label="Passwort" value={password} onChange={setPassword} placeholder="Passwort" />
            <Text style={s.hint}>Mit diesem Passwort loggst du dich in dein Dashboard ein.</Text>
            <PasswordInput label="Passwort wiederholen" value={passwordConfirm} onChange={setPasswordConfirm} placeholder="Passwort wiederholen" />

            <TouchableOpacity style={[s.submitBtn, loading && s.submitBtnDisabled]} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitBtnText}>Jetzt Partner werden</Text>}
            </TouchableOpacity>
          </View>
        )}

        {mode === 'login' && (
          <View>
            <View style={s.fieldWrap}>
              <Text style={s.label}>E-Mail</Text>
              <TextInput style={s.input} placeholder="deine@email.de" placeholderTextColor="#bbb"
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <PasswordInput label="Passwort" value={password} onChange={setPassword} placeholder="Passwort" />

            <TouchableOpacity style={[s.submitBtn, loading && s.submitBtnDisabled]} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitBtnText}>Einloggen</Text>}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 16, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  logoutBtn: { minWidth: 70, alignItems: 'flex-end' },
  logoutText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  subHeaderDomain: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '700', textAlign: 'center', marginTop: 6 },
  subHeaderTagline: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', marginTop: 2 },
  welcomeName: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 10 },
  welcomeEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  benefitRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  benefitCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  benefitTitle: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 4 },
  benefitAmount: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  benefitSub: { fontSize: 11, color: '#888', lineHeight: 16 },

  infoCard: {
    backgroundColor: '#EEF3FA', borderRadius: 14, padding: 14, marginBottom: 16,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 6 },
  infoText: { fontSize: 13, color: '#555', lineHeight: 20 },

  tabRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
    marginBottom: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: '#888' },
  tabTextActive: { color: '#fff' },

  fieldWrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: '#1A1A2E', backgroundColor: '#fff',
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    backgroundColor: '#fff', paddingRight: 8,
  },
  eyeBtn: { padding: 8 },
  eyeIcon: { fontSize: 18 },
  hint: { fontSize: 11, color: '#aaa', marginTop: -8, marginBottom: 10 },

  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  submitBtnDisabled: { backgroundColor: '#aaa' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  balanceCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: Colors.primary },
  balanceLabel: { fontSize: 13, color: '#888', marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statAmount: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },

  codeCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#E0E0E8',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  codeCardActive: { borderColor: Colors.primary },
  codeCardLabel: { fontSize: 12, color: '#888', fontWeight: '600', marginBottom: 6 },
  codeText: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 6, letterSpacing: 1 },
  linkText: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginBottom: 6 },
  codeDesc: { fontSize: 12, color: '#666', marginBottom: 12 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  copyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
