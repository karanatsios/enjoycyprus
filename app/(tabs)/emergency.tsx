import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Linking,
} from 'react-native';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

type EmergencyEntry = {
  icon: string;
  name: string;
  sub: string;
  number: string;
  urgent?: boolean;
};

type Section = {
  title: string;
  entries: EmergencyEntry[];
};

const SOUTH: Section[] = [
  {
    title: 'NOTRUF',
    entries: [
      { icon: '🚑', name: 'Notruf (Alle)', sub: 'Polizei · Feuerwehr · Rettung', number: '112', urgent: true },
      { icon: '🚑', name: 'Notruf (lokal)', sub: 'Alternative zu 112', number: '199', urgent: true },
      { icon: '🌲', name: 'Waldbrand', sub: 'Forstfeuerwehr', number: '1407' },
      { icon: '⚓', name: 'Such & Rettung', sub: 'See- und Luftnotfälle', number: '1441' },
    ],
  },
  {
    title: 'KRANKENHÄUSER',
    entries: [
      { icon: '🏥', name: 'Famagusta General', sub: 'Paralimni (Ammochostos)', number: '23 200 000' },
      { icon: '🏥', name: 'Nicosia General', sub: 'Nikosia', number: '22 604 011' },
      { icon: '🏥', name: 'Makarios Hospital', sub: 'Nikosia (Kinder)', number: '22 405 000' },
      { icon: '🏥', name: 'Limassol General', sub: 'Limassol', number: '25 801 100' },
      { icon: '🏥', name: 'Larnaca General', sub: 'Larnaka', number: '24 800 369' },
      { icon: '🏥', name: 'Paphos General', sub: 'Paphos', number: '26 803 100' },
    ],
  },
  {
    title: 'NOTAPOTHEKE',
    entries: [
      { icon: '💊', name: 'Notapotheken-Info', sub: 'Welche Apotheke hat Dienst?', number: '11892' },
      { icon: '💊', name: 'Famagusta / Paralimni', sub: 'Notapotheke Ansage', number: '90 901 413' },
      { icon: '💊', name: 'Nikosia', sub: 'Notapotheke Ansage', number: '90 901 412' },
      { icon: '💊', name: 'Limassol', sub: 'Notapotheke Ansage', number: '90 901 415' },
      { icon: '💊', name: 'Larnaka', sub: 'Notapotheke Ansage', number: '90 901 414' },
      { icon: '💊', name: 'Paphos', sub: 'Notapotheke Ansage', number: '90 901 416' },
    ],
  },
  {
    title: 'NÜTZLICHE NUMMERN',
    entries: [
      { icon: '🛡️', name: 'Polizei Hotline', sub: 'Nicht-Notfall Anfragen', number: '1460' },
      { icon: '📞', name: 'Telefonauskunft', sub: 'Nur von zyprischer Nummer', number: '11892' },
      { icon: '☠️', name: 'Vergiftungsnotruf', sub: 'Gift- und Drogen-Notfall', number: '1410' },
      { icon: '❤️', name: 'Häusliche Gewalt', sub: '24h Krisenhotline', number: '1440' },
      { icon: '⚓', name: 'Küstenwache / Marine', sub: 'Hafen- & Marinepolizei', number: '25 805 350' },
    ],
  },
];

const NORTH: Section[] = [
  {
    title: 'NOTRUF',
    entries: [
      { icon: '🚑', name: 'Notruf (Alle)', sub: 'Polizei · Feuerwehr · Rettung', number: '112', urgent: true },
      { icon: '🛡️', name: 'Polizei', sub: 'Norden – TMT / Polizei', number: '155', urgent: true },
      { icon: '🔥', name: 'Feuerwehr', sub: 'Norden', number: '199' },
      { icon: '🌲', name: 'Waldbrand', sub: 'Norden', number: '177' },
      { icon: '🚑', name: 'Rettungsdienst', sub: 'Norden', number: '112' },
    ],
  },
  {
    title: 'KRANKENHÄUSER',
    entries: [
      { icon: '🏥', name: 'Lefkoşa / Nikosia', sub: 'Dr. Burhan Nalbantoğlu Krankenhaus', number: '+90 392 228 5441' },
      { icon: '🏥', name: 'Gazimağusa / Famagusta', sub: 'Staatliches Krankenhaus', number: '+90 392 366 5328' },
      { icon: '🏥', name: 'Girne / Kyrenia', sub: 'Akçiçek Staatliches Krankenhaus', number: '+90 392 815 2266' },
      { icon: '🏥', name: 'Güzelyurt / Morphou', sub: 'Staatliches Krankenhaus', number: '+90 392 714 2125' },
      { icon: '🏥', name: 'Near East Univ. Hospital', sub: 'Lefkoşa – Privatkrankenhaus', number: '+90 392 675 1000' },
    ],
  },
  {
    title: 'NÜTZLICHE NUMMERN',
    entries: [
      { icon: '☠️', name: 'Vergiftungsnotruf', sub: 'Gift- und Drogen-Notfall', number: '+90 392 228 5441' },
      { icon: '📞', name: 'Touristenpolizei', sub: 'Hilfe für Touristen (Kyrenia)', number: '+90 392 815 7444' },
      { icon: '🛂', name: 'Zoll & Grenzschutz', sub: 'Ercan Flughafen', number: '+90 392 231 5503' },
      { icon: '❤️', name: 'Krisenhotline', sub: 'Häusliche Gewalt / Notfall', number: '+90 392 228 3640' },
    ],
  },
];

function callNumber(number: string) {
  const cleaned = number.replace(/\s/g, '');
  Linking.openURL(`tel:${cleaned}`);
}

function EntryRow({ entry }: { entry: EmergencyEntry }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{entry.icon}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{entry.name}</Text>
        <Text style={styles.rowSub}>{entry.sub}</Text>
      </View>
      <TouchableOpacity
        style={[styles.callBtn, entry.urgent && styles.callBtnUrgent]}
        onPress={() => callNumber(entry.number)}
        activeOpacity={0.75}
      >
        <Text style={styles.callBtnText}>📞 {entry.number}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function EmergencyScreen() {
  const [tab, setTab] = useState<'south' | 'north'>('south');
  const sections = tab === 'south' ? SOUTH : NORTH;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚨 Notfallnummern</Text>
        <Text style={styles.headerSub}>Wichtige Telefonnummern für Zypern</Text>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'south' && styles.tabBtnActive]}
          onPress={() => setTab('south')}
        >
          <Text style={[styles.tabBtnLabel, tab === 'south' && styles.tabBtnLabelActive]}>Süden</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'north' && styles.tabBtnActive]}
          onPress={() => setTab('north')}
        >
          <Text style={[styles.tabBtnLabel, tab === 'north' && styles.tabBtnLabelActive]}>Norden</Text>
        </TouchableOpacity>
      </View>

      {/* Info banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          {tab === 'south'
            ? '112 funktioniert von jedem Telefon — auch ohne SIM-Karte. Kostenlos.'
            : 'Im Norden: 112 für alle Notfälle. Vorwahl aus dem Ausland: +90 392'}
        </Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.entries.map((entry, i) => (
                <View key={entry.number + i}>
                  <EntryRow entry={entry} />
                  {i < section.entries.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },

  header: {
    backgroundColor: '#C0392B',
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },

  tabRow: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: 16,
    backgroundColor: Colors.primary, borderRadius: 14, padding: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center', backgroundColor: '#fff' },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabBtnLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  tabBtnLabelActive: { color: '#fff' },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#EBF5FB', borderRadius: 12,
    marginHorizontal: 20, marginTop: 12,
    padding: 12, borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  infoIcon: { fontSize: 15 },
  infoText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },

  scroll: { flex: 1, marginTop: 8 },

  section: { marginBottom: 0, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: '#888',
    letterSpacing: 1.2, marginBottom: 8, marginTop: 18,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    overflow: 'hidden',
    borderWidth: 1, borderColor: '#F0F0F5',
  },

  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center',
  },
  rowIconText: { fontSize: 20 },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  rowSub: { fontSize: 11, color: '#999', marginTop: 2 },

  callBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  callBtnUrgent: { backgroundColor: '#C0392B' },
  callBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F0F0F5', marginHorizontal: 14 },
});
