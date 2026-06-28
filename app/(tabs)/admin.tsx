import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, ScrollView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../lib/supabase';

const ADMIN_EMAILS = ['karanatsios@mailbox.org', 'vitali.vs@gmx.de'];

const PLANS = [
  { id: 'standard', label: 'Standard', score: 25,  price: '59 €/Jahr',  color: '#CD7F32', days: 365 },
  { id: 'silver',   label: 'Silver',   score: 50,  price: '79 €/Jahr',  color: '#A8A9AD', days: 365 },
  { id: 'gold',     label: 'Gold',     score: 75,  price: '99 €/Jahr',  color: '#FFD700', days: 365 },
  { id: 'platin',   label: 'Platin',   score: 100, price: '159 €/Jahr', color: '#9B59B6', days: 365 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: '#D4891A', approved: '#27AE60', expired: '#888', rejected: '#C0392B', inactive: '#999',
};

type Business = {
  id: string; company_name: string; category: string; region: string; city: string;
  email: string; phone: string; plan: string; plan_score: number;
  status: string; created_at: string; expires_at: string | null; user_id: string;
};

type Tab = 'pending' | 'approved' | 'expired' | 'all' | 'users';

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  admin:   { label: 'Admin',   color: '#9B59B6', bg: '#F5EEF8', icon: '🔐' },
  partner: { label: 'Partner', color: '#D4891A', bg: '#FEF9E7', icon: '⭐' },
  user:    { label: 'Kunde',   color: '#27AE60', bg: '#EAFAF1', icon: '👤' },
};

type UserBusiness = {
  company_name: string; plan: string; plan_score: number; status: string; expires_at: string | null;
};

type UserProfile = {
  id: string; email: string; role: string; tag?: string; created_at: string;
  isPartner?: boolean; partnerCode?: string;
  partnerBalance?: number; partnerProvisions?: number;
  userBusinesses?: UserBusiness[];
};

function PlanBadge({ plan }: { plan: string }) {
  const p = PLANS.find(x => x.id === plan) ?? PLANS[0];
  return (
    <View style={[bs.planBadge, { borderColor: p.color }]}>
      <Text style={[bs.planBadgeText, { color: p.color }]}>{p.label}</Text>
    </View>
  );
}

export default function AdminScreen() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>('pending');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, expired: 0, all: 0 });

  useEffect(() => { checkAdmin(); }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAll();
    fetchUsers();

    // Echtzeit-Abo: Änderungen sofort anzeigen ohne Neuladen
    const bizSub = supabase.channel('businesses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => fetchAll())
      .subscribe();
    const profileSub = supabase.channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUsers())
      .subscribe();
    const partnerSub = supabase.channel('partners-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partners' }, () => fetchUsers())
      .subscribe();

    return () => {
      supabase.removeChannel(bizSub);
      supabase.removeChannel(profileSub);
      supabase.removeChannel(partnerSub);
    };
  }, [isAdmin]);

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getSession();
    if (ADMIN_EMAILS.includes(data.session?.user?.email ?? '')) {
      setIsAdmin(true);
    }
    setChecking(false);
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: partners } = await supabase.from('partners').select('user_id, affiliate_code, balance, provisions');
    const { data: bizList } = await supabase.from('businesses').select('user_id, company_name, plan, plan_score, status, expires_at');
    if (profiles) {
      const partnerMap = new Map((partners ?? []).map(p => [p.user_id, p]));
      const bizMap = new Map<string, typeof bizList>() ;
      (bizList ?? []).forEach(b => {
        if (!bizMap.has(b.user_id)) bizMap.set(b.user_id, []);
        bizMap.get(b.user_id)!.push(b);
      });
      const enriched = profiles.map(p => {
        const isPartner = partnerMap.has(p.id);
        const tag = p.role === 'admin' ? 'Admin' : isPartner ? 'Affiliate-Partner' : 'Kunde';
        return {
          ...p,
          tag,
          isPartner,
          partnerCode: partnerMap.get(p.id)?.affiliate_code,
          partnerBalance: partnerMap.get(p.id)?.balance ?? 0,
          partnerProvisions: partnerMap.get(p.id)?.provisions ?? 0,
          userBusinesses: bizMap.get(p.id) ?? [],
        };
      });
      setUsers(enriched);
      // Tags in DB synchronisieren (ohne await um UI nicht zu blockieren)
      enriched.forEach(u => {
        supabase.from('profiles').update({ tag: u.tag }).eq('id', u.id).then(() => {});
      });
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const isPartnerUser = users.find(u => u.id === userId)?.isPartner;
    const tag = newRole === 'admin' ? 'Admin' : isPartnerUser ? 'Affiliate-Partner' : 'Kunde';
    await supabase.from('profiles').update({ role: newRole, tag }).eq('id', userId);
    // Sofort lokal aktualisieren – nicht auf Realtime warten
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !ADMIN_EMAILS.includes(data.user?.email ?? '')) {
      Alert.alert('Kein Zugriff', 'Ungültige Zugangsdaten oder keine Admin-Berechtigung.');
      setLoginLoading(false);
      return;
    }
    setIsAdmin(true);
    setLoginLoading(false);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
    if (data) {
      setBusinesses(data);
      setCounts({
        pending: data.filter(b => b.status === 'pending').length,
        approved: data.filter(b => b.status === 'approved').length,
        expired: data.filter(b => b.status === 'expired').length,
        all: data.length,
      });
    }
    setLoading(false);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('businesses').update({ status }).eq('id', id);
    fetchAll();
  };

  const updatePlan = async (id: string, planId: string) => {
    const plan = PLANS.find(p => p.id === planId)!;
    const expires = new Date();
    expires.setDate(expires.getDate() + plan.days);
    await supabase.from('businesses').update({
      plan: planId,
      plan_score: plan.score,
      expires_at: expires.toISOString(),
      status: 'approved',
    }).eq('id', id);
    fetchAll();
  };

  const deleteBusiness = async (id: string, name: string) => {
    Alert.alert('Löschen', `"${name}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: async () => {
        await supabase.from('businesses').delete().eq('id', id);
        fetchAll();
      }},
    ]);
  };

  const filtered = tab === 'all' ? businesses : businesses.filter(b => b.status === tab);

  // ── Login ────────────────────────────────────────────────────────
  if (checking) return (
    <SafeAreaView style={bs.safe}><AppHeader />
      <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 60 }} />
    </SafeAreaView>
  );

  if (!isAdmin) return (
    <SafeAreaView style={bs.safe}>
      <AppHeader />
      <View style={bs.subHeader}>
        <View style={bs.subHeaderRow}>
          <TouchableOpacity style={bs.backBtn} onPress={() => router.back()}>
            <Text style={bs.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={bs.subHeaderTitle}>Admin</Text>
          <View style={{ minWidth: 70 }} />
        </View>
      </View>
      <View style={bs.loginWrap}>
        <Text style={bs.loginIcon}>🔐</Text>
        <Text style={bs.loginTitle}>Admin-Bereich</Text>
        <Text style={bs.loginSub}>Nur für autorisierte Administratoren.</Text>
        <TextInput style={bs.input} placeholder="E-Mail" placeholderTextColor="#bbb"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={bs.input} placeholder="Passwort" placeholderTextColor="#bbb"
          value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[bs.loginBtn, loginLoading && { opacity: 0.6 }]}
          onPress={handleLogin} disabled={loginLoading}>
          {loginLoading ? <ActivityIndicator color="#fff" /> : <Text style={bs.loginBtnText}>Einloggen</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // ── Dashboard ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={bs.safe}>
      <AppHeader />
      <View style={bs.subHeader}>
        <View style={bs.subHeaderRow}>
          <TouchableOpacity style={bs.backBtn} onPress={() => router.back()}>
            <Text style={bs.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={bs.subHeaderTitle}>⚙️ Admin</Text>
          <TouchableOpacity onPress={() => { supabase.auth.signOut(); setIsAdmin(false); }}>
            <Text style={bs.backText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={bs.statsRow}>
        {[
          { label: 'Ausstehend', count: counts.pending, color: '#D4891A' },
          { label: 'Aktiv', count: counts.approved, color: '#27AE60' },
          { label: 'Abgelaufen', count: counts.expired, color: '#888' },
          { label: 'Gesamt', count: counts.all, color: Colors.primary },
        ].map(s => (
          <View key={s.label} style={bs.statCard}>
            <Text style={[bs.statNum, { color: s.color }]}>{s.count}</Text>
            <Text style={bs.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={bs.tabScroll} contentContainerStyle={bs.tabRow}>
        {([
          { key: 'pending', label: `Ausstehend (${counts.pending})` },
          { key: 'approved', label: `Aktiv (${counts.approved})` },
          { key: 'expired', label: `Abgelaufen (${counts.expired})` },
          { key: 'all', label: `Alle (${counts.all})` },
          { key: 'users', label: `👥 Nutzer (${users.length})` },
        ] as const).map(t => (
          <TouchableOpacity key={t.key} style={[bs.tabChip, tab === t.key && bs.tabChipActive]}
            onPress={() => setTab(t.key)}>
            <Text style={[bs.tabChipText, tab === t.key && bs.tabChipTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tab === 'users' ? (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 30, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={bs.empty}><Text style={bs.emptyText}>Keine Nutzer</Text></View>}
          renderItem={({ item }) => {
            const effectiveRole = item.role === 'admin' ? 'admin' : item.isPartner ? 'partner' : 'user';
            const rc = ROLE_CONFIG[effectiveRole];
            return (
              <View style={bs.card}>
                {/* Kopfzeile: E-Mail + Rolle */}
                <View style={bs.cardTop}>
                  <View style={bs.cardInfo}>
                    <Text style={bs.cardName}>{item.email}</Text>
                    <View style={[bs.tagBadge, { backgroundColor: rc.bg, borderColor: rc.color }]}>
                      <Text style={[bs.tagBadgeText, { color: rc.color }]}>{rc.icon} {item.tag ?? rc.label}</Text>
                    </View>
                    <Text style={bs.cardMeta}>Registriert: {new Date(item.created_at).toLocaleDateString('de-DE')}</Text>
                  </View>
                  {/* Rolle Badge */}
                  <View style={[bs.roleBadge, { backgroundColor: rc.bg, borderColor: rc.color }]}>
                    <Text style={bs.roleBadgeIcon}>{rc.icon}</Text>
                    <Text style={[bs.roleBadgeText, { color: rc.color }]}>{rc.label}</Text>
                  </View>
                </View>

                {/* Partner-Info */}
                {item.isPartner && (
                  <View style={bs.partnerBlock}>
                    <Text style={bs.partnerLabel}>⭐ Partner-Code: {item.partnerCode}</Text>
                    <Text style={bs.partnerMeta}>💰 Guthaben: {item.partnerBalance?.toFixed(2)} € · 📦 Provisionen: {item.partnerProvisions}</Text>
                  </View>
                )}

                {/* Berechtigungs-Umschalter */}
                <View style={bs.permRow}>
                  <Text style={bs.permLabel}>Berechtigung:</Text>
                  <TouchableOpacity
                    style={[bs.permBtn, item.role === 'admin' ? bs.permBtnActive : bs.permBtnInactive]}
                    onPress={() => toggleAdmin(item.id, item.role)}
                  >
                    <Text style={bs.permBtnIcon}>{item.role === 'admin' ? '🔐' : '👤'}</Text>
                    <Text style={[bs.permBtnText, { color: item.role === 'admin' ? '#9B59B6' : '#888' }]}>
                      {item.role === 'admin' ? 'Admin – Tippen zum Entfernen' : 'Kein Admin – Tippen zum Ernennen'}
                    </Text>
                    <View style={[bs.permSwitch, item.role === 'admin' && bs.permSwitchOn]}>
                      <View style={[bs.permSwitchDot, item.role === 'admin' && bs.permSwitchDotOn]} />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Einträge */}
                {(item.userBusinesses ?? []).length > 0 && (
                  <View style={bs.bizSection}>
                    <Text style={bs.bizSectionTitle}>🏢 EINTRÄGE ({item.userBusinesses?.length})</Text>
                    {(item.userBusinesses ?? []).map((b, i) => {
                      const p = PLANS.find(x => x.id === b.plan) ?? PLANS[0];
                      const expired = b.expires_at ? new Date(b.expires_at) < new Date() : false;
                      return (
                        <View key={i} style={bs.bizRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={bs.bizName}>{b.company_name}</Text>
                            <Text style={[bs.bizMeta, { color: expired ? '#C0392B' : '#27AE60' }]}>
                              {b.expires_at
                                ? `${expired ? '⚠️ Abgelaufen' : '✓ Aktiv'} bis ${new Date(b.expires_at).toLocaleDateString('de-DE')}`
                                : '⏳ Kein Ablaufdatum'}
                            </Text>
                          </View>
                          <View style={[bs.planBadge, { borderColor: p.color }]}>
                            <Text style={[bs.planBadgeText, { color: p.color }]}>{p.label}</Text>
                          </View>
                          <View style={[bs.statusBadge, { borderColor: STATUS_COLORS[b.status] ?? '#888', backgroundColor: (STATUS_COLORS[b.status] ?? '#888') + '20' }]}>
                            <Text style={[bs.statusText, { color: STATUS_COLORS[b.status] ?? '#888' }]}>{b.status}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
                {(item.userBusinesses ?? []).length === 0 && (
                  <Text style={bs.noBiz}>Noch keine Einträge</Text>
                )}
              </View>
            );
          }}
        />
      ) : loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 30, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={bs.empty}><Text style={bs.emptyText}>Keine Einträge</Text></View>
          }
          renderItem={({ item }) => (
            <View style={bs.card}>
              <View style={bs.cardTop}>
                <View style={bs.cardInfo}>
                  <Text style={bs.cardName}>{item.company_name}</Text>
                  <Text style={bs.cardMeta}>{item.city} · {item.category}</Text>
                  {item.email ? <Text style={bs.cardMeta}>{item.email}</Text> : null}
                  {item.expires_at ? (
                    <Text style={[bs.cardMeta, { color: new Date(item.expires_at) < new Date() ? '#C0392B' : '#27AE60' }]}>
                      {new Date(item.expires_at) < new Date() ? '⚠️ Abgelaufen' : '✓ Aktiv'} bis {new Date(item.expires_at).toLocaleDateString('de-DE')}
                    </Text>
                  ) : null}
                </View>
                <View style={bs.cardBadges}>
                  <View style={[bs.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20', borderColor: STATUS_COLORS[item.status] }]}>
                    <Text style={[bs.statusText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
                  </View>
                  <PlanBadge plan={item.plan} />
                </View>
              </View>

              {/* Status-Aktionen */}
              <View style={bs.actionRow}>
                {item.status !== 'approved' && (
                  <TouchableOpacity style={[bs.btn, bs.btnGreen]} onPress={() => updateStatus(item.id, 'approved')}>
                    <Text style={bs.btnText}>✓ Freischalten</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'approved' && (
                  <TouchableOpacity style={[bs.btn, bs.btnOrange]} onPress={() => updateStatus(item.id, 'inactive')}>
                    <Text style={bs.btnText}>⏸ Deaktivieren</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[bs.btn, bs.btnRed]} onPress={() => deleteBusiness(item.id, item.company_name)}>
                  <Text style={bs.btnText}>🗑 Löschen</Text>
                </TouchableOpacity>
              </View>

              {/* Plan ändern */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                <View style={bs.planRow}>
                  {PLANS.map(p => (
                    <TouchableOpacity key={p.id}
                      style={[bs.planBtn, item.plan === p.id && { borderColor: p.color, backgroundColor: p.color + '15' }]}
                      onPress={() => updatePlan(item.id, p.id)}>
                      <Text style={[bs.planBtnText, { color: p.color }]}>{p.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const bs = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },
  subHeader: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 16, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },

  loginWrap: { flex: 1, justifyContent: 'center', padding: 30, gap: 12 },
  loginIcon: { fontSize: 48, textAlign: 'center' },
  loginTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', textAlign: 'center' },
  loginSub: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 8 },
  input: {
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 14,
    color: '#1A1A2E', backgroundColor: '#fff',
  },
  loginBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 9, color: '#888', fontWeight: '600', marginTop: 2 },

  tabScroll: { flexGrow: 0 },
  tabRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 8 },
  tabChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff' },
  tabChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabChipText: { fontSize: 12, fontWeight: '700', color: '#666' },
  tabChipTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  cardMeta: { fontSize: 11, color: '#888', marginTop: 1 },
  cardBadges: { gap: 6, alignItems: 'flex-end' },

  statusBadge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  planBadge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  planBadgeText: { fontSize: 11, fontWeight: '700' },

  actionRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  btnGreen: { backgroundColor: '#27AE6020', borderWidth: 1, borderColor: '#27AE60' },
  btnOrange: { backgroundColor: '#D4891A20', borderWidth: 1, borderColor: '#D4891A' },
  btnRed: { backgroundColor: '#C0392B20', borderWidth: 1, borderColor: '#C0392B' },
  btnText: { fontSize: 12, fontWeight: '700', color: '#1A1A2E' },

  planRow: { flexDirection: 'row', gap: 6 },
  planBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderColor: '#ddd' },
  planBtnText: { fontSize: 11, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#888' },

  partnerBlock: { marginTop: 4 },
  partnerLabel: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  partnerMeta: { fontSize: 11, color: '#888', marginTop: 1 },

  bizSection: { borderTopWidth: 1, borderTopColor: '#F0F0F5', marginTop: 10, paddingTop: 8, gap: 6 },
  bizSectionTitle: { fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 0.5, marginBottom: 2 },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bizName: { fontSize: 12, fontWeight: '700', color: '#1A1A2E' },
  bizMeta: { fontSize: 10, marginTop: 1 },

  tagBadge: {
    alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2, marginBottom: 3,
  },
  tagBadgeText: { fontSize: 11, fontWeight: '800' },

  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  roleBadgeIcon: { fontSize: 13 },
  roleBadgeText: { fontSize: 12, fontWeight: '800' },

  permRow: { marginTop: 10, gap: 4 },
  permLabel: { fontSize: 10, fontWeight: '800', color: '#999', letterSpacing: 0.8 },
  permBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderRadius: 12, padding: 10,
  },
  permBtnActive: { borderColor: '#9B59B6', backgroundColor: '#F5EEF8' },
  permBtnInactive: { borderColor: '#E0E0E8', backgroundColor: '#F8F9FA' },
  permBtnIcon: { fontSize: 16 },
  permBtnText: { flex: 1, fontSize: 12, fontWeight: '700' },
  permSwitch: {
    width: 36, height: 20, borderRadius: 10, backgroundColor: '#E0E0E8',
    justifyContent: 'center', paddingHorizontal: 2,
  },
  permSwitchOn: { backgroundColor: '#9B59B6' },
  permSwitchDot: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
  permSwitchDotOn: { alignSelf: 'flex-end' },

  noBiz: { fontSize: 11, color: '#bbb', marginTop: 8, fontStyle: 'italic' },
});
