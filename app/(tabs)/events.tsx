import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

type Event = {
  id: string;
  icon: string;
  title: string;
  date: string;
  dateRaw: Date;
  location: string;
  region: 'Süden' | 'Norden';
  category: string;
  price: number | null;
  desc: string;
};

const TODAY = new Date('2026-06-28');

const ALL_EVENTS: Event[] = [
  {
    id: '1', icon: '🍷', title: 'Limassol Wine Festival',
    date: '28. Jun 2026', dateRaw: new Date('2026-06-28'),
    location: 'Limassol Municipal Gardens', region: 'Süden', category: 'tourismus',
    price: null, desc: 'Das größte Weinfestival Zyperns mit lokalen Winzern und Live-Musik.',
  },
  {
    id: '2', icon: '💻', title: 'Cyprus Tech Summit',
    date: '5. Jul 2026', dateRaw: new Date('2026-07-05'),
    location: 'Nicosia Conference Center', region: 'Süden', category: 'business',
    price: 25, desc: 'Internationaler Tech-Gipfel mit Keynotes und Networking.',
  },
  {
    id: '3', icon: '🎶', title: 'Paphos Beach Party',
    date: '12. Jul 2026', dateRaw: new Date('2026-07-12'),
    location: 'Paphos Beach Bar', region: 'Süden', category: 'tourismus',
    price: 10, desc: 'Sommer-Strandparty mit DJs und Sonnenuntergang am Meer.',
  },
  {
    id: '4', icon: '🌍', title: 'Expat Meetup Larnaca',
    date: '19. Jul 2026', dateRaw: new Date('2026-07-19'),
    location: 'Finikoudes Promenade', region: 'Süden', category: 'community',
    price: null, desc: 'Treffen für deutschsprachige Auswanderer – Erfahrungen teilen, Kontakte knüpfen.',
  },
  {
    id: '5', icon: '🏺', title: 'Traditional Crafts Market',
    date: '26. Jul 2026', dateRaw: new Date('2026-07-26'),
    location: 'Nicosia Old City', region: 'Süden', category: 'shopping',
    price: null, desc: 'Handwerksmarkt in der Altstadt mit zyprischen Kunsthandwerkern.',
  },
  {
    id: '6', icon: '🧘', title: 'Wellness Retreat Troodos',
    date: '2. Aug 2026', dateRaw: new Date('2026-08-02'),
    location: 'Troodos Mountains', region: 'Süden', category: 'beauty',
    price: 45, desc: 'Wochenend-Retreat mit Yoga, Meditation und Natur im Troodos-Gebirge.',
  },
  {
    id: '7', icon: '🏰', title: 'Kyrenia Castle Night Tour',
    date: '10. Jul 2026', dateRaw: new Date('2026-07-10'),
    location: 'Kyrenia Castle, Norden', region: 'Norden', category: 'tourismus',
    price: 8, desc: 'Abendführung durch das historische Kyrenia-Schloss mit Blick aufs Meer.',
  },
  {
    id: '8', icon: '🎨', title: 'Famagusta Art Festival',
    date: '20. Jul 2026', dateRaw: new Date('2026-07-20'),
    location: 'Famagusta Old City, Norden', region: 'Norden', category: 'tourismus',
    price: null, desc: 'Straßenkunst und Kulturveranstaltungen in der Altstadt von Famagusta.',
  },
  {
    id: '9', icon: '🌅', title: 'Expat Sunset Dinner',
    date: '15. Aug 2026', dateRaw: new Date('2026-08-15'),
    location: 'Limassol Marina', region: 'Süden', category: 'community',
    price: 35, desc: 'Exklusives Abendessen für deutschsprachige Expats mit Blick auf die Marina.',
  },
  {
    id: '10', icon: '🍋', title: 'Lemon Festival Lefkara',
    date: '3. Aug 2026', dateRaw: new Date('2026-08-03'),
    location: 'Lefkara Village', region: 'Süden', category: 'tourismus',
    price: null, desc: 'Traditionelles Dorffest mit lokalen Spezialitäten und Volksmusik.',
  },
];

const REGION_FILTERS = ['Alle', 'Süden', 'Norden'] as const;
const CAT_FILTERS = [
  { id: 'alle', label: 'Alle Events' },
  { id: 'frei', label: '🎟️ Kostenlos' },
  { id: 'heute', label: '📅 Heute' },
  { id: 'woche', label: '🗓️ Diese Woche' },
  { id: 'community', label: '👥 Community' },
  { id: 'tourismus', label: '🏖️ Tourismus' },
  { id: 'business', label: '💼 Business' },
];

export default function EventsScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<typeof REGION_FILTERS[number]>('Alle');
  const [catFilter, setCatFilter] = useState('alle');

  const filtered = ALL_EVENTS.filter(e => {
    if (region !== 'Alle' && e.region !== region) return false;
    if (catFilter === 'frei') return e.price === null;
    if (catFilter === 'heute') return e.dateRaw.toDateString() === TODAY.toDateString();
    if (catFilter === 'woche') {
      const diff = (e.dateRaw.getTime() - TODAY.getTime()) / 86400000;
      return diff >= 0 && diff <= 7;
    }
    if (catFilter !== 'alle') return e.category === catFilter;
    return true;
  });

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>🎉 Events</Text>
          <View style={{ minWidth: 70 }} />
        </View>
        {/* Region chips inline im Header */}
        <View style={s.regionRow}>
          {REGION_FILTERS.map(r => (
            <TouchableOpacity key={r} style={[s.regionChip, region === r && s.regionChipActive]} onPress={() => setRegion(r)}>
              <Text style={[s.regionChipText, region === r && s.regionChipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Kategorie-Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catRow}>
        {CAT_FILTERS.map(f => (
          <TouchableOpacity key={f.id} style={[s.catChip, catFilter === f.id && s.catChipActive]} onPress={() => setCatFilter(f.id)}>
            <Text style={[s.catChipText, catFilter === f.id && s.catChipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyIcon}>📅</Text>
            <Text style={s.emptyTitle}>Keine Events gefunden</Text>
            <Text style={s.emptySub}>Versuche einen anderen Filter.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <Text style={s.cardIcon}>{item.icon}</Text>
            </View>
            <View style={s.cardBody}>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardDate}>📅 {item.date}</Text>
              <Text style={s.cardLocation}>📍 {item.location}</Text>
              <Text style={s.cardDesc} numberOfLines={2}>{item.desc}</Text>
            </View>
            <View style={s.cardRight}>
              <Text style={[s.cardPrice, { color: item.price ? Colors.primary : '#27AE60' }]}>
                {item.price ? `${item.price} €` : 'Frei'}
              </Text>
              <View style={s.regionBadge}>
                <Text style={s.regionBadgeText}>{item.region}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 14, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },

  regionRow: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'center' },
  regionChip: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  regionChipActive: { backgroundColor: '#fff' },
  regionChipText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' },
  regionChipTextActive: { color: Colors.primary },

  catScroll: { flexGrow: 0, marginTop: 10 },
  catRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 2 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff' },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipText: { fontSize: 12, fontWeight: '700', color: '#555' },
  catChipTextActive: { color: '#fff' },

  list: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardLeft: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center', alignItems: 'center',
  },
  cardIcon: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginBottom: 3 },
  cardDate: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginBottom: 2 },
  cardLocation: { fontSize: 11, color: '#888', marginBottom: 4 },
  cardDesc: { fontSize: 11, color: '#aaa', lineHeight: 16 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardPrice: { fontSize: 14, fontWeight: '800' },
  regionBadge: { backgroundColor: '#EEF3FA', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  regionBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  emptySub: { fontSize: 13, color: '#888' },
});
