import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, FlatList, TextInput, ActivityIndicator, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

type Sight = {
  id: string;
  name: string;
  location: string;
  region: string;
  is_north: boolean;
  lat: number;
  lng: number;
  image_url: string;
  description: string;
  category: string;
};

const FILTERS = ['Alle', 'Süden', 'Norden'] as const;

const DUMMY_IMAGE = 'https://picsum.photos/seed/cyprus-sight/800/534';

const CATEGORY_COLORS: Record<string, string> = {
  'Antike':      '#8E44AD',
  'Natur':       '#27AE60',
  'Kirche':      '#E67E22',
  'Burg':        '#7F8C8D',
  'Stadt':       '#2980B9',
  'Geschichte':  '#C0392B',
  'Dorf':        '#16A085',
};

function SightImage({ uri, name }: { uri: string; name: string }) {
  const src = uri || DUMMY_IMAGE;
  const fallback = DUMMY_IMAGE;
  const [imgSrc, setImgSrc] = useState(src);

  if (typeof document !== 'undefined') {
    return (
      // @ts-ignore
      <img
        src={imgSrc}
        onError={() => setImgSrc(fallback)}
        style={{ width: '100%', height: 210, objectFit: 'cover', backgroundColor: '#E8EEF5', display: 'block' }}
      />
    );
  }
  return <View style={styles.cardImg} />;
}

export default function SightsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<string>('Alle');
  const [sights, setSights] = useState<Sight[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('sights')
      .select('id, name, location, region, is_north, lat, lng, image_url, description, category')
      .order('is_north')
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) setSights(data);
        setLoading(false);
      });
  }, []);

  const filtered = sights.filter(s => {
    const matchFilter =
      activeFilter === 'Alle' ||
      (activeFilter === 'Norden' && s.is_north) ||
      (activeFilter === 'Süden' && !s.is_north);
    const matchSearch =
      search.trim() === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const openOnMap = (s: Sight) => {
    router.push({
      pathname: '/(tabs)/map',
      params: { focusLat: s.lat, focusLng: s.lng, focusName: s.name },
    });
  };

  const openRoute = (s: Sight) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  const getCategoryColor = (cat: string) => CATEGORY_COLORS[cat] ?? '#555';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Zurück</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>📍 Sehenswürdigkeiten</Text>
          <Text style={styles.headerSub}>Die schönsten Orte Zyperns</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Sehenswürdigkeit suchen…"
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

      {/* Filter chips */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color="#0077B6" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={s => s.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {search ? `Keine Treffer für „${search}"` : 'Keine Einträge vorhanden'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <SightImage uri={item.image_url} name={item.name} />
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={[styles.regionBadge, { backgroundColor: item.is_north ? '#FFF3E0' : '#EBF5FB' }]}>
                    <Text style={[styles.regionBadgeText, { color: item.is_north ? '#E65100' : '#0077B6' }]}>
                      {item.is_north ? 'Nordzypern' : 'Südzypern'}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={[styles.metaLocation, { color: colors.textMuted }]}>📍 {item.location}</Text>
                  {item.category ? (
                    <View style={[styles.catBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
                      <Text style={[styles.catBadgeText, { color: getCategoryColor(item.category) }]}>
                        {item.category}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {item.description ? (
                  <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={3}>
                    {item.description}
                  </Text>
                ) : null}

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.mapsBtn} onPress={() => openOnMap(item)}>
                    <Text style={styles.mapsBtnIcon}>🗺️</Text>
                    <Text style={styles.mapsBtnText}>Auf Karte anzeigen</Text>
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
  cardImg: { width: '100%', height: 210, backgroundColor: '#E8EEF5' },
  cardBody: { padding: 14, gap: 8 },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  cardName: { fontSize: 17, fontWeight: '700', flex: 1 },
  regionBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, flexShrink: 0 },
  regionBadgeText: { fontSize: 11, fontWeight: '700' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaLocation: { fontSize: 12 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  catBadgeText: { fontSize: 11, fontWeight: '700' },

  description: { fontSize: 13, lineHeight: 19 },

  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
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
