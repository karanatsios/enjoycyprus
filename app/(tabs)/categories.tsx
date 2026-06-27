import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TextInput, TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../lib/supabase';

const CATEGORY_LABELS: Record<string, string> = {
  handwerk: 'Handwerk', gastronomie: 'Gastronomie', medizin: 'Medizin & Gesundheit',
  immobilien: 'Immobilien', finanzen: 'Finanzen & Recht', shopping: 'Shopping',
  beauty: 'Schönheit & Wellness', dienstleistung: 'Dienstleistungen',
  mobilitaet: 'Auto & Mobilität', tourismus: 'Tourismus & Freizeit', auswandern: 'Auswandern',
};

type Business = {
  id: string; company_name: string; category: string; region_group: string;
  region: string; city: string; phone: string; whatsapp: string;
  short_desc: string; languages: string[]; plan: string;
};

// Mock-Daten bis echte Einträge vorhanden
const MOCK: Business[] = [
  { id: '1', company_name: 'German Döner House', category: 'gastronomie', region_group: 'Süden', region: 'Nikosia / Nicosia', city: 'Nikosia', phone: '+357 22 000 001', whatsapp: '', short_desc: 'Authentische Döner-Küche im Herzen Nikosias.', languages: ['DE','EN','EL'], plan: 'standard' },
  { id: '2', company_name: 'German Döner House', category: 'gastronomie', region_group: 'Süden', region: 'Larnaka / Larnaca', city: 'Larnaka', phone: '+357 24 000 002', whatsapp: '', short_desc: 'Zweigstelle in Larnaka.', languages: ['DE','EN','EL'], plan: 'standard' },
  { id: '3', company_name: '3D Global', category: 'finanzen', region_group: 'Süden', region: 'Limassol', city: 'Limassol', phone: '+357 25 000 003', whatsapp: '+357 99 000 003', short_desc: 'Versicherungen & Finanzberatung auf Zypern.', languages: ['DE','EN'], plan: 'premium' },
  { id: '4', company_name: 'Cyprus Realty Pro', category: 'immobilien', region_group: 'Süden', region: 'Nikosia / Nicosia', city: 'Nikosia', phone: '+357 22 000 004', whatsapp: '', short_desc: 'Ihr Immobilienmakler auf Zypern.', languages: ['DE','EN','RU'], plan: 'free' },
  { id: '5', company_name: 'Dr. Maria Petrides', category: 'medizin', region_group: 'Süden', region: 'Larnaka / Larnaca', city: 'Larnaka', phone: '+357 24 000 005', whatsapp: '', short_desc: 'Allgemeinmedizin & Hausarztpraxis.', languages: ['EL','EN','DE'], plan: 'standard' },
  { id: '6', company_name: 'Kyrenia Car Rentals', category: 'mobilitaet', region_group: 'Norden', region: 'Kyrenia / Girne', city: 'Kyrenia', phone: '+90 392 000 006', whatsapp: '+90 548 000 006', short_desc: 'Autovermietung im Norden Zyperns.', languages: ['TR','EN','DE'], plan: 'free' },
];

function BusinessCard({ item }: { item: Business }) {
  const router = useRouter();
  const catLabel = CATEGORY_LABELS[item.category] ?? item.category;
  const initials = item.company_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.85}>
      {/* Logo placeholder */}
      <View style={s.logo}>
        <Text style={s.logoText}>{initials}</Text>
      </View>

      <View style={s.cardBody}>
        <Text style={s.cardName}>{item.company_name}</Text>
        <Text style={s.cardCat}>{catLabel}</Text>
        <View style={s.cardLocation}>
          <Text style={s.locationIcon}>📍</Text>
          <Text style={s.locationText}>{item.region} · {item.region_group}</Text>
        </View>
        <View style={s.langRow}>
          {(item.languages ?? []).map(l => (
            <View key={l} style={s.langChip}><Text style={s.langChipText}>{l}</Text></View>
          ))}
        </View>
      </View>

      <View style={s.cardActions}>
        {item.phone ? (
          <TouchableOpacity style={s.actionBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
            <Text style={s.actionIcon}>📞</Text>
          </TouchableOpacity>
        ) : null}
        {item.whatsapp ? (
          <TouchableOpacity style={[s.actionBtn, s.actionBtnWA]} onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp.replace(/\D/g, '')}`)}>
            <Text style={s.actionIcon}>💬</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function CategoriesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Alle' | 'Süden' | 'Norden'>('Alle');
  const [businesses, setBusinesses] = useState<Business[]>(MOCK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    if (data && data.length > 0) setBusinesses([...data, ...MOCK]);
    setLoading(false);
  };

  const filtered = businesses.filter(b => {
    const matchRegion = filter === 'Alle' || b.region_group === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.company_name.toLowerCase().includes(q) ||
      (CATEGORY_LABELS[b.category] ?? '').toLowerCase().includes(q) ||
      (b.region ?? '').toLowerCase().includes(q) ||
      (b.city ?? '').toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      {/* Sub-header */}
      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>Alle Einträge</Text>
          <View style={{ minWidth: 70 }} />
        </View>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Suche nach Firma oder Kategorie..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={s.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={s.filterRow}>
        {(['Alle', 'Süden', 'Norden'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterChip, filter === f && s.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={s.nearbyBtn}>
          <Text style={s.nearbyIcon}>📍</Text>
          <Text style={s.nearbyText}>In meiner Nähe</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <BusinessCard item={item} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🔍</Text>
              <Text style={s.emptyTitle}>Keine Einträge gefunden</Text>
              <Text style={s.emptySub}>Versuche einen anderen Suchbegriff oder Filter.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    marginTop: -1,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A2E' },
  clearBtn: { color: '#aaa', fontSize: 14, paddingHorizontal: 4 },

  filterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 14, fontWeight: '700', color: '#555' },
  filterChipTextActive: { color: '#fff' },
  nearbyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#D0D8E8',
  },
  nearbyIcon: { fontSize: 14 },
  nearbyText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  list: { paddingHorizontal: 16, paddingBottom: 30, paddingTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  logo: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  cardBody: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  cardCat: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 4 },
  cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationIcon: { fontSize: 11 },
  locationText: { fontSize: 12, color: '#888' },
  langRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  langChip: {
    backgroundColor: '#EEF3FA', borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  langChipText: { fontSize: 11, fontWeight: '700', color: Colors.primary },

  cardActions: { gap: 8, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 2 },
  actionBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#EEF3FA', justifyContent: 'center', alignItems: 'center',
  },
  actionBtnWA: { backgroundColor: '#E8F8EF' },
  actionIcon: { fontSize: 18 },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  emptySub: { fontSize: 13, color: '#888', textAlign: 'center' },
});
