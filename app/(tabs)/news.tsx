import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

type NewsSource = {
  flag: string;
  title: string;
  sub: string;
  url: string;
  region: 'sueden' | 'norden';
};

const SOURCES: NewsSource[] = [
  {
    flag: '🇬🇧',
    title: 'Cyprus Mail',
    sub: 'Englischsprachige Tageszeitung, seit 1945',
    url: 'https://cyprus-mail.com',
    region: 'sueden',
  },
  {
    flag: '🇬🇧',
    title: 'Kathimerini Cyprus English',
    sub: 'Politik, Wirtschaft, Gesellschaft',
    url: 'https://www.ekathimerini.com/cyprus',
    region: 'sueden',
  },
  {
    flag: '🇬🇧',
    title: 'Financial Mirror',
    sub: 'Wirtschaft & Finanzen Zypern',
    url: 'https://www.financialmirror.com',
    region: 'sueden',
  },
  {
    flag: '🇩🇪',
    title: 'Inside Cyprus – Süden News',
    sub: 'Nachrichtenüberblick, passt sich deiner Sprache an',
    url: 'https://www.google.com/search?q=Zypern+Nachrichten+Süden&hl=de',
    region: 'sueden',
  },
  {
    flag: '🇬🇧',
    title: 'Cyprus Today Online',
    sub: 'Tagesaktuelle Nachrichten aus dem Norden',
    url: 'https://www.cyprustoday.net',
    region: 'norden',
  },
  {
    flag: '🇬🇧',
    title: 'Cyprus Scene',
    sub: 'Alltag & Nachrichten aus dem Norden',
    url: 'https://www.cyprusscene.com',
    region: 'norden',
  },
  {
    flag: '🇩🇪',
    title: 'Inside Cyprus – Norden News',
    sub: 'Nachrichtenüberblick, passt sich deiner Sprache an',
    url: 'https://www.google.com/search?q=Nordzypern+Nachrichten&hl=de',
    region: 'norden',
  },
];

type Filter = 'alle' | 'sueden' | 'norden';

export default function NewsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('alle');

  const suedenItems = SOURCES.filter(
    s => s.region === 'sueden' && (filter === 'alle' || filter === 'sueden')
  );
  const nordenItems = SOURCES.filter(
    s => s.region === 'norden' && (filter === 'alle' || filter === 'norden')
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Zurück</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>News</Text>
          <Text style={styles.subtitle}>Aktuelle Nachrichten aus ganz Zypern</Text>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['alle', 'sueden', 'norden'] as Filter[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f === 'alle' ? 'Alle' : f === 'sueden' ? 'Süden' : 'Norden'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SÜDEN */}
        {suedenItems.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏙️</Text>
              <Text style={styles.sectionTitle}>SÜDEN</Text>
            </View>
            {suedenItems.map((item, i) => (
              <NewsCard key={i} item={item} />
            ))}
          </>
        )}

        {/* NORDEN */}
        {nordenItems.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏙️</Text>
              <Text style={styles.sectionTitle}>NORDEN</Text>
            </View>
            {nordenItems.map((item, i) => (
              <NewsCard key={i} item={item} />
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NewsCard({ item }: { item: NewsSource }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() => Linking.openURL(item.url)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.sub}</Text>
      </View>
      <Text style={styles.extIcon}>↗</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { color: '#fff', fontSize: 18 },
  backText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  scroll: { paddingHorizontal: 0, paddingBottom: 0 },

  titleBlock: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },

  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  chipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  chipText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: Colors.primary },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  flag: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  cardSub: { fontSize: 12, color: Colors.textMuted },
  extIcon: { fontSize: 16, color: Colors.textMuted },
});
