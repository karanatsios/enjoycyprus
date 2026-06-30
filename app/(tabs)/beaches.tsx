import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Image, Linking, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

type Beach = {
  id: string;
  name: string;
  location: string;
  region: 'Famagusta' | 'Paphos' | 'Limassol' | 'Larnaca';
  lat: number;
  lng: number;
  image: string;
};

/* Verified Unsplash photo IDs – Mediterranean/Cyprus beach photography */
const IMG = {
  nissi:      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  figtree:    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  coral:      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  konnos:     'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
  paphos:     'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
  pissouri:   'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
  governors:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  kourion:    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  larnaca:    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80',
  polis:      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
};

const BEACHES: Beach[] = [
  /* ── FAMAGUSTA / AYIA NAPA ── */
  { id: 'f1',  name: 'Nissi Beach',              location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9889, lng: 34.0019, image: IMG.nissi },
  { id: 'f2',  name: 'Fig Tree Bay',             location: 'Protaras',   region: 'Famagusta', lat: 35.0125, lng: 34.0572, image: IMG.figtree },
  { id: 'f3',  name: 'Sandy Bay',                location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9944, lng: 34.0197, image: IMG.konnos },
  { id: 'f4',  name: 'Makronissos Beach',        location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9803, lng: 33.9878, image: IMG.coral },
  { id: 'f5',  name: 'Pantachou Beach',          location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9844, lng: 34.0022, image: IMG.nissi },
  { id: 'f6',  name: 'Louma Beach',              location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9900, lng: 34.0100, image: IMG.figtree },
  { id: 'f7',  name: 'Protaras Beach',           location: 'Protaras',   region: 'Famagusta', lat: 35.0094, lng: 34.0547, image: IMG.konnos },
  { id: 'f8',  name: 'Sunrise Beach',            location: 'Protaras',   region: 'Famagusta', lat: 35.0178, lng: 34.0594, image: IMG.figtree },
  { id: 'f9',  name: 'Konnos Bay',               location: 'Cape Greco', region: 'Famagusta', lat: 34.9736, lng: 34.0722, image: IMG.konnos },

  /* ── PAPHOS ── */
  { id: 'p1',  name: 'Coral Bay',                location: 'Peyia',      region: 'Paphos', lat: 34.8356, lng: 32.3700, image: IMG.coral },
  { id: 'p2',  name: 'Kaphizis Beach',           location: 'Peyia',      region: 'Paphos', lat: 34.8411, lng: 32.3644, image: IMG.paphos },
  { id: 'p3',  name: 'Laourou Beach',            location: 'Peyia',      region: 'Paphos', lat: 34.8389, lng: 32.3622, image: IMG.polis },
  { id: 'p4',  name: 'Kotsias Beach',            location: 'Lemba',      region: 'Paphos', lat: 34.8133, lng: 32.3931, image: IMG.coral },
  { id: 'p5',  name: 'Venus Beach',              location: 'Paphos',     region: 'Paphos', lat: 34.7681, lng: 32.4069, image: IMG.paphos },
  { id: 'p6',  name: 'Faros Beach',              location: 'Paphos',     region: 'Paphos', lat: 34.7469, lng: 32.4222, image: IMG.polis },
  { id: 'p7',  name: 'Municipal Baths Beach',    location: 'Paphos',     region: 'Paphos', lat: 34.7592, lng: 32.4083, image: IMG.coral },
  { id: 'p8',  name: 'Alykes Beach',             location: 'Paphos',     region: 'Paphos', lat: 34.7756, lng: 32.4044, image: IMG.paphos },
  { id: 'p9',  name: 'Vrysoudia A Beach',        location: 'Paphos',     region: 'Paphos', lat: 34.7839, lng: 32.4011, image: IMG.polis },
  { id: 'p10', name: 'Vrysoudia B Beach',        location: 'Geroskipou', region: 'Paphos', lat: 34.7906, lng: 32.4094, image: IMG.coral },
  { id: 'p11', name: 'Pachyammos Beach',         location: 'Paphos',     region: 'Paphos', lat: 34.8028, lng: 32.3961, image: IMG.paphos },
  { id: 'p12', name: 'Pachyammos 2 Beach',       location: 'Geroskipou', region: 'Paphos', lat: 34.7944, lng: 32.4047, image: IMG.polis },
  { id: 'p13', name: 'Geroskipou Municipal Beach', location: 'Geroskipou', region: 'Paphos', lat: 34.7978, lng: 32.4069, image: IMG.coral },
  { id: 'p14', name: 'Polis Chrysochous Municipal Beach', location: 'Polis', region: 'Paphos', lat: 35.0358, lng: 32.4250, image: IMG.polis },

  /* ── LIMASSOL ── */
  { id: 'l1',  name: 'Pissouri Beach',           location: 'Pissouri',   region: 'Limassol', lat: 34.6681, lng: 32.7064, image: IMG.pissouri },
  { id: 'l2',  name: "Governor's Beach",         location: 'Pentakomo',  region: 'Limassol', lat: 34.7186, lng: 33.2683, image: IMG.governors },
  { id: 'l3',  name: 'Kourion Beach',            location: 'Episkopi',   region: 'Limassol', lat: 34.6519, lng: 32.8744, image: IMG.kourion },
  { id: 'l4',  name: "Lady's Mile Beach",        location: 'Limassol',   region: 'Limassol', lat: 34.6456, lng: 33.0017, image: IMG.pissouri },
  { id: 'l5',  name: 'Limassol Old Port Beach',  location: 'Limassol',   region: 'Limassol', lat: 34.6736, lng: 33.0444, image: IMG.governors },
  { id: 'l6',  name: 'Amathus Beach',            location: 'Limassol',   region: 'Limassol', lat: 34.6997, lng: 33.1239, image: IMG.kourion },
  { id: 'l7',  name: 'Dasoudi Beach',            location: 'Limassol',   region: 'Limassol', lat: 34.7058, lng: 33.1433, image: IMG.pissouri },

  /* ── LARNACA ── */
  { id: 'lr1', name: 'Mackenzie Beach',          location: 'Larnaca',    region: 'Larnaca', lat: 34.8689, lng: 33.6336, image: IMG.larnaca },
  { id: 'lr2', name: 'Finikoudes Beach',         location: 'Larnaca',    region: 'Larnaca', lat: 34.9153, lng: 33.6425, image: IMG.nissi },
  { id: 'lr3', name: 'Dhekelia Beach',           location: 'Dhekelia',   region: 'Larnaca', lat: 34.9806, lng: 33.7450, image: IMG.larnaca },
  { id: 'lr4', name: 'Pyla Beach',               location: 'Pyla',       region: 'Larnaca', lat: 34.9811, lng: 33.7222, image: IMG.figtree },
  { id: 'lr5', name: 'Pervolia Beach',           location: 'Pervolia',   region: 'Larnaca', lat: 34.8347, lng: 33.5789, image: IMG.larnaca },
  { id: 'lr6', name: 'Soft Beach',               location: 'Larnaca',    region: 'Larnaca', lat: 34.9183, lng: 33.6469, image: IMG.nissi },
];

const REGIONS = ['Alle', 'Famagusta', 'Paphos', 'Limassol', 'Larnaca'] as const;

export default function BeachesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeRegion, setActiveRegion] = useState<string>('Alle');

  const filtered = activeRegion === 'Alle'
    ? BEACHES
    : BEACHES.filter(b => b.region === activeRegion);

  const openMaps = (beach: Beach) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${beach.lat},${beach.lng}`;
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
          <Text style={styles.headerSub}>{BEACHES.length} zertifizierte Strände auf Zypern 2026</Text>
        </View>
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

      {/* Beach list */}
      <FlatList
        data={filtered}
        keyExtractor={b => b.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Image
              source={{ uri: item.image }}
              style={styles.cardImg}
              resizeMode="cover"
            />
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
                <Text style={styles.blueFlag}>🏖️ Blaue Flagge 2026</Text>
              </View>
              <TouchableOpacity style={styles.mapsBtn} onPress={() => openMaps(item)}>
                <Text style={styles.mapsBtnIcon}>🗺️</Text>
                <Text style={styles.mapsBtnText}>Auf Maps öffnen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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

  filterWrap: { paddingTop: 14 },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#E8EEF5',
  },
  chipActive: { backgroundColor: '#0077B6' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },

  list: { padding: 16, gap: 16 },

  card: {
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardImg: { width: '100%', height: 200, backgroundColor: '#E0EAF4' },
  cardBody: { padding: 14, gap: 6 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontSize: 17, fontWeight: '700', flex: 1, marginRight: 8 },
  regionBadge: {
    backgroundColor: '#EBF5FB',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10,
  },
  regionBadgeText: { fontSize: 11, fontWeight: '700', color: '#0077B6' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12 },
  metaDot: { color: '#ccc' },
  blueFlag: { fontSize: 12, color: '#0077B6', fontWeight: '600' },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EBF5FB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
    alignSelf: 'flex-start', marginTop: 4,
  },
  mapsBtnIcon: { fontSize: 14 },
  mapsBtnText: { fontSize: 13, fontWeight: '700', color: '#0077B6' },
});
