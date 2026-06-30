import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, FlatList, TextInput, ActivityIndicator, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

type Beach = {
  id: string;
  name: string;
  location: string;
  region: string;
  lat: number;
  lng: number;
  image_url: string;
};

const REGIONS = ['Alle', 'Famagusta', 'Paphos', 'Limassol', 'Larnaca'] as const;

function BeachImage({ uri, name }: { uri: string; name: string }) {
  const [src, setSrc] = useState(uri || `https://picsum.photos/seed/${encodeURIComponent(name)}/800/534`);
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(name)}/800/534`;

  // On web: use a real <img> tag so onError fires reliably
  // @ts-ignore
  if (typeof document !== 'undefined') {
    return (
      // @ts-ignore
      <img
        src={src}
        onError={() => setSrc(fallback)}
        style={{ width: '100%', height: 200, objectFit: 'cover', backgroundColor: '#E0EAF4', display: 'block' }}
      />
    );
  }

  return (
    // @ts-ignore
    <View style={styles.cardImg}>
      {/* native fallback – expo-image not installed */}
    </View>
  );
}

export default function BeachesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeRegion, setActiveRegion] = useState<string>('Alle');
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('beaches')
      .select('id, name, location, region, lat, lng, image_url')
      .order('region')
      .order('name')
      .then(({ data, error }) => {
        if (data && data.length > 0) setBeaches(data);
        setLoading(false);
      });
  }, []);

  const filtered = beaches.filter(b => {
    const matchRegion = activeRegion === 'Alle' || b.region === activeRegion;
    const matchSearch = search.trim() === '' ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  const openOnMap = (beach: Beach) => {
    router.push({
      pathname: '/map',
      params: { focusLat: beach.lat, focusLng: beach.lng, focusName: beach.name },
    });
  };

  const openRoute = (beach: Beach) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${beach.lat},${beach.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Zurück</Text>
        </TouchableOpacity>
        <View style={styles.headerBody}>
          <Text style={styles.headerTitle}>🏖️ Blaue Flagge Strände</Text>
          <Text style={styles.headerSub}>{beaches.length} zertifizierte Strände auf Zypern 2026</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Strand suchen…"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.searchClear}>
            <Text style={styles.searchClearTxt}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Region filter */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {REGIONS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, activeRegion === r && styles.chipActive]}
              onPress={() => setActiveRegion(r)}
            >
              <Text style={[styles.chipText, activeRegion === r && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color="#0077B6" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={b => b.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {search ? `Kein Strand gefunden für „${search}"` : 'Keine Strände vorhanden'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <BeachImage uri={item.image_url} name={item.name} />
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.regionBadge}>
                    <Text style={styles.regionBadgeText}>{item.region}</Text>
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>📍 {item.location}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.blueFlag}>🚩 Blaue Flagge 2026</Text>
                </View>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.mapsBtn} onPress={() => openOnMap(item)}>
                    <Text style={styles.mapsBtnIcon}>🗺️</Text>
                    <Text style={styles.mapsBtnText}>Auf Karte</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.routeBtn} onPress={() => openRoute(item)}>
                    <Text style={styles.mapsBtnIcon}>🧭</Text>
                    <Text style={styles.routeBtnText}>Route planen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    backgroundColor: '#0077B6',
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backArrow: { color: 'rgba(255,255,255,0.85)', fontSize: 18 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '600' },
  headerBody: {},
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: '#D0D8E8',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: '#1A1A2E' },
  searchClear: { padding: 4 },
  searchClearTxt: { fontSize: 14, color: '#999', fontWeight: '700' },

  filterWrap: { paddingTop: 10 },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#E8EEF5',
  },
  chipActive: { backgroundColor: '#0077B6' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },

  list: { padding: 16, gap: 16 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 14, marginTop: 40 },

  card: {
    borderRadius: 18, overflow: 'hidden', borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardImg: { width: '100%', height: 200, backgroundColor: '#E0EAF4' },
  cardBody: { padding: 14, gap: 6 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontSize: 17, fontWeight: '700', flex: 1, marginRight: 8 },
  regionBadge: { backgroundColor: '#EBF5FB', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  regionBadgeText: { fontSize: 11, fontWeight: '700', color: '#0077B6' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12 },
  metaDot: { color: '#ccc' },
  blueFlag: { fontSize: 12, color: '#0077B6', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EBF5FB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF3E0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  mapsBtnIcon: { fontSize: 14 },
  mapsBtnText: { fontSize: 13, fontWeight: '700', color: '#0077B6' },
  routeBtnText: { fontSize: 13, fontWeight: '700', color: '#E65100' },
});
