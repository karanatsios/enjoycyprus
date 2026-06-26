import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import EventCard, { Event } from '../../components/EventCard';
import LanguageSelector from '../../components/LanguageSelector';

const ALL_EVENTS: Event[] = [
  { id: '1', title: 'Limassol Wine Festival', date: '28. Jun 2026', location: 'Limassol Municipal Gardens', category: 'tourismus', icon: '🍷', price: null, color: Colors.coral },
  { id: '2', title: 'Cyprus Tech Summit', date: '5. Jul 2026', location: 'Nicosia Conference Center', category: 'dienstleistung', icon: '💻', price: 25, color: Colors.primary },
  { id: '3', title: 'Paphos Beach Party', date: '12. Jul 2026', location: 'Paphos Beach Bar', category: 'tourismus', icon: '🎶', price: 10, color: Colors.gold },
  { id: '4', title: 'Expat Meetup Larnaca', date: '19. Jul 2026', location: 'Finikoudes Promenade', category: 'auswandern', icon: '🌍', price: null, color: Colors.primaryLight },
  { id: '5', title: 'Traditional Crafts Market', date: '26. Jul 2026', location: 'Nicosia Old City', category: 'handwerk', icon: '🏺', price: null, color: '#E76F51' },
  { id: '6', title: 'Wellness Retreat Troodos', date: '2. Aug 2026', location: 'Troodos Mountains', category: 'beauty', icon: '🧘', price: 45, color: '#C77DFF' },
];

const FILTERS = ['all', 'today', 'tomorrow', 'thisWeek', 'free'];

export default function EventsScreen() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'free'
    ? ALL_EVENTS.filter(e => e.price === null)
    : ALL_EVENTS;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('events')}</Text>
        <LanguageSelector />
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterLabel, activeFilter === f && styles.filterLabelActive]}>
                {t(f === 'all' ? 'explore' : f)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.eventRow}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <View style={styles.eventContent}>
              <Text style={styles.eventIcon}>{item.icon}</Text>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{item.date} · {item.location}</Text>
              </View>
              <Text style={[styles.eventPrice, { color: item.price ? Colors.coral : Colors.success }]}>
                {item.price ? `€${item.price}` : t('free')}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  filters: { paddingVertical: 14 },
  filterList: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterLabel: { fontSize: 13, color: Colors.textLight, fontWeight: '600' },
  filterLabelActive: { color: '#fff' },
  list: { paddingHorizontal: 20 },
  eventRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cardBg,
    borderRadius: 16, marginBottom: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  colorDot: { width: 6, alignSelf: 'stretch' },
  eventContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  eventIcon: { fontSize: 28 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  eventDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  eventPrice: { fontSize: 14, fontWeight: '800' },
});
