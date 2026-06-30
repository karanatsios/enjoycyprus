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

const BEACHES: Beach[] = [
  /* ── FAMAGUSTA / AYIA NAPA ── */
  { id: 'f1',  name: 'Nissi Beach',              location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9889, lng: 34.0019, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Nissi_Beach.jpg/800px-Nissi_Beach.jpg' },
  { id: 'f2',  name: 'Fig Tree Bay',             location: 'Protaras',   region: 'Famagusta', lat: 35.0125, lng: 34.0572, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Fig_Tree_Bay_Protaras.jpg/800px-Fig_Tree_Bay_Protaras.jpg' },
  { id: 'f3',  name: 'Sandy Bay',                location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9944, lng: 34.0197, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Ayia_Napa_beach_2009.jpg/800px-Ayia_Napa_beach_2009.jpg' },
  { id: 'f4',  name: 'Makronissos Beach',        location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9803, lng: 33.9878, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Makronissos_Beach_Cyprus.jpg/800px-Makronissos_Beach_Cyprus.jpg' },
  { id: 'f5',  name: 'Pantachou Beach',          location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9844, lng: 34.0022, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Nissi_Beach.jpg/800px-Nissi_Beach.jpg' },
  { id: 'f6',  name: 'Louma Beach',              location: 'Ayia Napa',  region: 'Famagusta', lat: 34.9900, lng: 34.0100, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Ayia_Napa_beach_2009.jpg/800px-Ayia_Napa_beach_2009.jpg' },
  { id: 'f7',  name: 'Protaras Beach',           location: 'Protaras',   region: 'Famagusta', lat: 35.0094, lng: 34.0547, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Fig_Tree_Bay_Protaras.jpg/800px-Fig_Tree_Bay_Protaras.jpg' },
  { id: 'f8',  name: 'Sunrise Beach',            location: 'Protaras',   region: 'Famagusta', lat: 35.0178, lng: 34.0594, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Makronissos_Beach_Cyprus.jpg/800px-Makronissos_Beach_Cyprus.jpg' },
  { id: 'f9',  name: 'Konnos Bay',               location: 'Cape Greco', region: 'Famagusta', lat: 34.9736, lng: 34.0722, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Konnos_Bay_Cyprus.jpg/800px-Konnos_Bay_Cyprus.jpg' },

  /* ── PAPHOS ── */
  { id: 'p1',  name: 'Coral Bay',                location: 'Peyia',      region: 'Paphos', lat: 34.8356, lng: 32.3700, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Coral_Bay_-_panoramio.jpg/800px-Coral_Bay_-_panoramio.jpg' },
  { id: 'p2',  name: 'Kaphizis Beach',           location: 'Peyia',      region: 'Paphos', lat: 34.8411, lng: 32.3644, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Paphos_Cyprus_Beach-02.jpg/800px-Paphos_Cyprus_Beach-02.jpg' },
  { id: 'p3',  name: 'Laourou Beach',            location: 'Peyia',      region: 'Paphos', lat: 34.8389, lng: 32.3622, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Paphos_Cyprus_Beach-02.jpg/800px-Paphos_Cyprus_Beach-02.jpg' },
  { id: 'p4',  name: 'Kotsias Beach',            location: 'Lemba',      region: 'Paphos', lat: 34.8133, lng: 32.3931, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cyprus_Beach_Paphos.jpg/800px-Cyprus_Beach_Paphos.jpg' },
  { id: 'p5',  name: 'Venus Beach',              location: 'Paphos',     region: 'Paphos', lat: 34.7681, lng: 32.4069, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cyprus_Beach_Paphos.jpg/800px-Cyprus_Beach_Paphos.jpg' },
  { id: 'p6',  name: 'Faros Beach',              location: 'Paphos',     region: 'Paphos', lat: 34.7469, lng: 32.4222, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Paphos_Cyprus_Beach-02.jpg/800px-Paphos_Cyprus_Beach-02.jpg' },
  { id: 'p7',  name: 'Municipal Baths Beach',    location: 'Paphos',     region: 'Paphos', lat: 34.7592, lng: 32.4083, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cyprus_Beach_Paphos.jpg/800px-Cyprus_Beach_Paphos.jpg' },
  { id: 'p8',  name: 'Alykes Beach',             location: 'Paphos',     region: 'Paphos', lat: 34.7756, lng: 32.4044, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Paphos_Cyprus_Beach-02.jpg/800px-Paphos_Cyprus_Beach-02.jpg' },
  { id: 'p9',  name: 'Vrysoudia A Beach',        location: 'Paphos',     region: 'Paphos', lat: 34.7839, lng: 32.4011, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cyprus_Beach_Paphos.jpg/800px-Cyprus_Beach_Paphos.jpg' },
  { id: 'p10', name: 'Vrysoudia B Beach',        location: 'Geroskipou', region: 'Paphos', lat: 34.7906, lng: 32.4094, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Coral_Bay_-_panoramio.jpg/800px-Coral_Bay_-_panoramio.jpg' },
  { id: 'p11', name: 'Pachyammos Beach',         location: 'Paphos',     region: 'Paphos', lat: 34.8028, lng: 32.3961, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Paphos_Cyprus_Beach-02.jpg/800px-Paphos_Cyprus_Beach-02.jpg' },
  { id: 'p12', name: 'Pachyammos 2 Beach',       location: 'Geroskipou', region: 'Paphos', lat: 34.7944, lng: 32.4047, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cyprus_Beach_Paphos.jpg/800px-Cyprus_Beach_Paphos.jpg' },
  { id: 'p13', name: 'Geroskipou Municipal Beach', location: 'Geroskipou', region: 'Paphos', lat: 34.7978, lng: 32.4069, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Coral_Bay_-_panoramio.jpg/800px-Coral_Bay_-_panoramio.jpg' },
  { id: 'p14', name: 'Polis Chrysochous Municipal Beach', location: 'Polis', region: 'Paphos', lat: 35.0358, lng: 32.4250, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Paphos_Cyprus_Beach-02.jpg/800px-Paphos_Cyprus_Beach-02.jpg' },

  /* ── LIMASSOL ── */
  { id: 'l1',  name: 'Pissouri Beach',           location: 'Pissouri',   region: 'Limassol', lat: 34.6681, lng: 32.7064, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pissouri_Bay_Cyprus.jpg/800px-Pissouri_Bay_Cyprus.jpg' },
  { id: 'l2',  name: "Governor's Beach",         location: 'Pentakomo',  region: 'Limassol', lat: 34.7186, lng: 33.2683, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Governors_Beach_Cyprus.jpg/800px-Governors_Beach_Cyprus.jpg' },
  { id: 'l3',  name: 'Kourion Beach',            location: 'Episkopi',   region: 'Limassol', lat: 34.6519, lng: 32.8744, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kourion_beach.jpg/800px-Kourion_beach.jpg' },
  { id: 'l4',  name: "Lady's Mile Beach",        location: 'Limassol',   region: 'Limassol', lat: 34.6456, lng: 33.0017, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pissouri_Bay_Cyprus.jpg/800px-Pissouri_Bay_Cyprus.jpg' },
  { id: 'l5',  name: 'Limassol Old Port Beach',  location: 'Limassol',   region: 'Limassol', lat: 34.6736, lng: 33.0444, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Governors_Beach_Cyprus.jpg/800px-Governors_Beach_Cyprus.jpg' },
  { id: 'l6',  name: 'Amathus Beach',            location: 'Limassol',   region: 'Limassol', lat: 34.6997, lng: 33.1239, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kourion_beach.jpg/800px-Kourion_beach.jpg' },
  { id: 'l7',  name: 'Dasoudi Beach',            location: 'Limassol',   region: 'Limassol', lat: 34.7058, lng: 33.1433, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pissouri_Bay_Cyprus.jpg/800px-Pissouri_Bay_Cyprus.jpg' },

  /* ── LARNACA ── */
  { id: 'lr1', name: 'Mackenzie Beach',          location: 'Larnaca',    region: 'Larnaca', lat: 34.8689, lng: 33.6336, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mackenzie_Beach_Larnaca.jpg/800px-Mackenzie_Beach_Larnaca.jpg' },
  { id: 'lr2', name: 'Finikoudes Beach',         location: 'Larnaca',    region: 'Larnaca', lat: 34.9153, lng: 33.6425, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mackenzie_Beach_Larnaca.jpg/800px-Mackenzie_Beach_Larnaca.jpg' },
  { id: 'lr3', name: 'Dhekelia Beach',           location: 'Dhekelia',   region: 'Larnaca', lat: 34.9806, lng: 33.7450, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Nissi_Beach.jpg/800px-Nissi_Beach.jpg' },
  { id: 'lr4', name: 'Pyla Beach',               location: 'Pyla',       region: 'Larnaca', lat: 34.9811, lng: 33.7222, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mackenzie_Beach_Larnaca.jpg/800px-Mackenzie_Beach_Larnaca.jpg' },
  { id: 'lr5', name: 'Pervolia Beach',           location: 'Pervolia',   region: 'Larnaca', lat: 34.8347, lng: 33.5789, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mackenzie_Beach_Larnaca.jpg/800px-Mackenzie_Beach_Larnaca.jpg' },
  { id: 'lr6', name: 'Soft Beach',               location: 'Larnaca',    region: 'Larnaca', lat: 34.9183, lng: 33.6469, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mackenzie_Beach_Larnaca.jpg/800px-Mackenzie_Beach_Larnaca.jpg' },
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
              defaultSource={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Nissi_Beach.jpg/800px-Nissi_Beach.jpg' }}
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
