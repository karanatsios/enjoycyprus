import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, ActivityIndicator, Linking, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

const ADMIN_EMAIL = 'karanatsios@mailbox.org';

const STATUS_COLORS: Record<string, string> = {
  pending: '#D4891A', approved: '#27AE60', expired: '#888', rejected: '#C0392B', inactive: '#999',
};
const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Wird geprüft', approved: '✅ Aktiv', expired: '⚠️ Abgelaufen', rejected: '❌ Abgelehnt', inactive: '⏸ Inaktiv',
};
const PLAN_COLORS: Record<string, string> = {
  standard: '#CD7F32', silver: '#A8A9AD', gold: '#FFD700', platin: '#9B59B6',
};

type Mode = 'login' | 'register' | 'forgot';

export default function MeinEintragScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) fetchBusinesses(u.id);
      setCheckingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchBusinesses(u.id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchBusinesses = async (userId: string) => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setBusinesses(data);
  };

  const clearMessages = () => { setErrorMsg(''); setSuccessMsg(''); };

  const handleLogin = async () => {
    if (!email || !password) { setErrorMsg('Bitte E-Mail und Passwort eingeben.'); return; }
    setLoading(true); clearMessages();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErrorMsg(error.message);
  };

  const handleRegister = async () => {
    if (!email || !password) { setErrorMsg('Bitte E-Mail und Passwort eingeben.'); return; }
    if (password.length < 6) { setErrorMsg('Passwort muss mindestens 6 Zeichen haben.'); return; }
    setLoading(true); clearMessages();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setErrorMsg(error.message);
    else setSuccessMsg('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail.');
  };

  const handleForgot = async () => {
    if (!email) { setErrorMsg('Bitte geben Sie Ihre E-Mail-Adresse ein.'); return; }
    setLoading(true); clearMessages();
    // Benachrichtigung an Admin
    const subject = encodeURIComponent('Passwort vergessen – Inside Cyprus');
    const body = encodeURIComponent(`Ein Nutzer hat "Passwort vergessen" angeklickt.\n\nE-Mail: ${email}\n\nBitte das Passwort manuell zurücksetzen oder dem Nutzer helfen.`);
    await Linking.openURL(`mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`);
    setLoading(false);
    setSuccessMsg('Eine E-Mail an den Support wurde vorbereitet. Bitte senden Sie diese ab.');
    setMode('login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (checkingSession) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  // ── Eingeloggt ───────────────────────────────────────────────────
  if (user) {
    return (
      <SafeAreaView style={s.safe}>
        <AppHeader />
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Mein Eintrag</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={s.backText}>Abmelden</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Profil-Card */}
          <View style={s.loggedInCard}>
            <Text style={s.loggedInIcon}>👤</Text>
            <Text style={s.loggedInTitle}>Willkommen!</Text>
            <Text style={s.loggedInEmail}>{user.email}</Text>
          </View>

          {/* Meine Einträge */}
          {businesses.length > 0 ? (
            <View style={s.bizSection}>
              <Text style={s.bizSectionTitle}>MEINE EINTRÄGE ({businesses.length})</Text>
              {businesses.map(b => {
                const planColor = PLAN_COLORS[b.plan] ?? '#888';
                const statusColor = STATUS_COLORS[b.status] ?? '#888';
                const isExpired = b.expires_at && new Date(b.expires_at) < new Date();
                return (
                  <View key={b.id} style={s.bizCard}>
                    <View style={s.bizCardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.bizName}>{b.company_name}</Text>
                        <Text style={s.bizMeta}>{b.city} · {b.category}</Text>
                      </View>
                      <View style={s.bizBadges}>
                        <View style={[s.badge, { borderColor: planColor }]}>
                          <Text style={[s.badgeText, { color: planColor }]}>{b.plan?.toUpperCase()}</Text>
                        </View>
                        <View style={[s.badge, { borderColor: statusColor, backgroundColor: statusColor + '15' }]}>
                          <Text style={[s.badgeText, { color: statusColor }]}>{STATUS_LABELS[b.status] ?? b.status}</Text>
                        </View>
                      </View>
                    </View>
                    {b.short_desc ? <Text style={s.bizDesc} numberOfLines={2}>{b.short_desc}</Text> : null}
                    {b.expires_at && (
                      <Text style={[s.bizExpiry, { color: isExpired ? '#C0392B' : '#27AE60' }]}>
                        {isExpired ? '⚠️ Abgelaufen am ' : '✅ Aktiv bis '}{new Date(b.expires_at).toLocaleDateString('de-DE')}
                      </Text>
                    )}
                    <View style={s.bizActions}>
                      <TouchableOpacity style={s.bizActionBtn} onPress={() => router.push('/submit' as any)}>
                        <Text style={s.bizActionBtnText}>✏️ Bearbeiten</Text>
                      </TouchableOpacity>
                      {(b.status === 'expired' || isExpired) && (
                        <TouchableOpacity style={[s.bizActionBtn, s.bizActionBtnPrimary]}>
                          <Text style={[s.bizActionBtnText, { color: '#fff' }]}>🔄 Verlängern</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={s.noEntryCard}>
              <Text style={s.noEntryIcon}>📋</Text>
              <Text style={s.noEntryTitle}>Noch kein Eintrag</Text>
              <Text style={s.noEntrySub}>Erstellen Sie jetzt Ihren ersten Unternehmenseintrag.</Text>
              <TouchableOpacity style={s.noEntryBtn} onPress={() => router.push('/submit' as any)}>
                <Text style={s.noEntryBtnText}>➕ Jetzt eintragen</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Marketing / Push-Aktionen */}
          <TouchableOpacity style={s.marketingBtn} onPress={() => router.push('/marketing' as any)}>
            <Text style={s.marketingBtnIcon}>📣</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.marketingBtnTitle}>Marketing & Push-Aktionen</Text>
              <Text style={s.marketingBtnSub}>Geo-zielgerichtete Benachrichtigungen versenden</Text>
            </View>
            <Text style={s.marketingBtnArrow}>›</Text>
          </TouchableOpacity>

          {/* Neuen Eintrag erstellen */}
          <TouchableOpacity style={s.addBtn} onPress={() => router.push('/submit' as any)}>
            <Text style={s.addBtnText}>➕ Weiteren Eintrag erstellen</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Login / Register / Forgot ────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Mein Eintrag</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.formCard}>

          {/* Mode tabs */}
          {mode !== 'forgot' && (
            <View style={s.modeTabs}>
              <TouchableOpacity style={[s.modeTab, mode === 'login' && s.modeTabActive]} onPress={() => { setMode('login'); clearMessages(); }}>
                <Text style={[s.modeTabText, mode === 'login' && s.modeTabTextActive]}>Einloggen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modeTab, mode === 'register' && s.modeTabActive]} onPress={() => { setMode('register'); clearMessages(); }}>
                <Text style={[s.modeTabText, mode === 'register' && s.modeTabTextActive]}>Registrieren</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={s.formTitle}>
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Neues Konto' : 'Passwort vergessen'}
          </Text>
          <Text style={s.formSub}>
            {mode === 'login'
              ? 'Mit der E-Mail und dem Passwort einloggen, die beim Registrieren verwendet wurden.'
              : mode === 'register'
              ? 'Erstellen Sie Ihr kostenloses Konto, um Ihren Eintrag zu verwalten.'
              : 'Geben Sie Ihre E-Mail-Adresse ein. Wir kontaktieren Sie schnellstmöglich.'}
          </Text>

          {/* E-Mail */}
          <Text style={s.fieldLabel}>E-Mail <Text style={s.required}>*</Text></Text>
          <TextInput
            style={s.input}
            placeholder="ihre@email.de"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Passwort */}
          {mode !== 'forgot' && (
            <>
              <Text style={s.fieldLabel}>Passwort <Text style={s.required}>*</Text></Text>
              <View style={s.pwRow}>
                <TextInput
                  style={s.inputPw}
                  placeholder="Passwort"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={s.eyeBtn}>
                  <Text style={s.eyeIcon}>{passwordVisible ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Fehler / Erfolg */}
          {errorMsg ? <Text style={s.errorMsg}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={s.successMsg}>{successMsg}</Text> : null}

          {/* Passwort vergessen Link */}
          {mode === 'login' && (
            <TouchableOpacity onPress={() => { setMode('forgot'); clearMessages(); }}>
              <Text style={s.forgotLink}>Passwort vergessen?</Text>
            </TouchableOpacity>
          )}
          {mode === 'forgot' && (
            <TouchableOpacity onPress={() => { setMode('login'); clearMessages(); }}>
              <Text style={s.forgotLink}>← Zurück zum Login</Text>
            </TouchableOpacity>
          )}

          {/* Hauptbutton */}
          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnDisabled]}
            onPress={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgot}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.submitBtnText}>
                  {mode === 'login' ? '⬤  Einloggen' : mode === 'register' ? '✓  Konto erstellen' : '📧  E-Mail senden'}
                </Text>
            }
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },

  header: {
    backgroundColor: Colors.primary, padding: 16, paddingTop: 20,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { paddingRight: 12, minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  headerSpacer: { minWidth: 70 },

  scroll: { flex: 1 },

  formCard: {
    backgroundColor: '#fff', borderRadius: 20, margin: 20, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },

  modeTabs: {
    flexDirection: 'row', backgroundColor: '#F0F4FA',
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  modeTab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeTabActive: { backgroundColor: Colors.primary },
  modeTabText: { fontSize: 14, fontWeight: '700', color: '#888' },
  modeTabTextActive: { color: '#fff' },

  formTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  formSub: { fontSize: 13, color: '#888', lineHeight: 18, marginBottom: 20 },

  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  required: { color: '#E74C3C' },
  input: {
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#1A1A2E', backgroundColor: '#FAFAFA', marginBottom: 16,
  },
  pwRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    backgroundColor: '#FAFAFA', marginBottom: 16,
  },
  inputPw: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: '#1A1A2E' },
  eyeBtn: { paddingHorizontal: 14 },
  eyeIcon: { fontSize: 18 },

  errorMsg: { color: '#E74C3C', fontSize: 13, marginBottom: 12, lineHeight: 18 },
  successMsg: { color: '#27AE60', fontSize: 13, marginBottom: 12, lineHeight: 18 },

  forgotLink: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginBottom: 20, textDecorationLine: 'underline' },

  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: '#aac4e8' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  bizSection: { paddingHorizontal: 20, marginBottom: 8 },
  bizSectionTitle: { fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 1, marginBottom: 10 },
  bizCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  bizCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  bizName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  bizMeta: { fontSize: 11, color: '#888', marginTop: 2 },
  bizBadges: { gap: 4, alignItems: 'flex-end' },
  badge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  bizDesc: { fontSize: 12, color: '#666', lineHeight: 18, marginBottom: 6 },
  bizExpiry: { fontSize: 11, fontWeight: '600', marginBottom: 10 },
  bizActions: { flexDirection: 'row', gap: 8 },
  bizActionBtn: {
    flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#F5F6FA',
  },
  bizActionBtnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  bizActionBtnText: { fontSize: 12, fontWeight: '700', color: '#1A1A2E' },

  noEntryCard: {
    backgroundColor: '#fff', borderRadius: 16, margin: 20, padding: 28,
    alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  noEntryIcon: { fontSize: 40 },
  noEntryTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },
  noEntrySub: { fontSize: 13, color: '#888', textAlign: 'center' },
  noEntryBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, marginTop: 4 },
  noEntryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  marketingBtn: {
    marginHorizontal: 20, marginBottom: 12, borderRadius: 16, padding: 16,
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  marketingBtnIcon: { fontSize: 28 },
  marketingBtnTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  marketingBtnSub: { fontSize: 11, color: '#888', marginTop: 2 },
  marketingBtnArrow: { fontSize: 22, color: '#ccc' },

  addBtn: {
    marginHorizontal: 20, marginBottom: 10, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed',
  },
  addBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },

  // ── Eingeloggt ──
  loggedInCard: {
    backgroundColor: Colors.primary, margin: 20, borderRadius: 20,
    padding: 28, alignItems: 'center', gap: 8,
  },
  loggedInIcon: { fontSize: 48 },
  loggedInTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  loggedInEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },

  section: {
    backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: '#999', letterSpacing: 1,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: '#F5F5F8',
  },
  menuItemIcon: { fontSize: 22 },
  menuItemText: { flex: 1 },
  menuItemLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  menuItemSub: { fontSize: 11, color: '#999', marginTop: 2 },
  menuItemArrow: { fontSize: 20, color: '#ccc' },

  logoutBtn: {
    marginHorizontal: 20, backgroundColor: '#FEE', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  logoutBtnText: { color: '#E74C3C', fontSize: 15, fontWeight: '700' },
});
