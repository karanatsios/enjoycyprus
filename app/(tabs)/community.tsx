import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

type CommunityLink = {
  icon: string;
  platform: string;
  name: string;
  desc: string;
  url: string;
  color: string;
};

const GROUPS: CommunityLink[] = [
  {
    icon: '👥', platform: 'Facebook', name: 'Deutsche in Zypern',
    desc: 'Größte deutschsprachige Facebook-Gruppe für Auswanderer auf Zypern',
    url: 'https://www.facebook.com/groups/deutscheauswandererzypern',
    color: '#1877F2',
  },
  {
    icon: '💬', platform: 'WhatsApp', name: 'Expats Zypern Community',
    desc: 'WhatsApp-Gruppe für deutschsprachige Expats – Fragen, Tipps & Treffen',
    url: 'https://chat.whatsapp.com',
    color: '#25D366',
  },
  {
    icon: '📣', platform: 'Telegram', name: 'Inside Cyprus Kanal',
    desc: 'News, Events und Insider-Tipps direkt auf dein Handy',
    url: 'https://t.me/insidecyprus',
    color: '#2CA5E0',
  },
  {
    icon: '📸', platform: 'Instagram', name: '@enjoycyprus',
    desc: 'Fotos, Reels und Stories rund um das Leben auf Zypern',
    url: 'https://www.instagram.com',
    color: '#E1306C',
  },
];

const TIPS: { icon: string; title: string; text: string }[] = [
  { icon: '🏠', title: 'Wohnen & Mieten', text: 'Tipps zur Wohnungssuche in Limassol, Nikosia, Paphos und Larnaka – von Expats für Expats.' },
  { icon: '🚗', title: 'Auto & Führerschein', text: 'Umschreibung des deutschen Führerscheins, Autoversicherung und KFZ-Zulassung in Zypern.' },
  { icon: '🏥', title: 'Krankenversicherung', text: 'GESY (staatlich) vs. private Zusatzversicherung – was für Auswanderer sinnvoll ist.' },
  { icon: '📋', title: 'Anmeldung & Steuern', text: 'TIN-Nummer, ARC-Card (EU-Bürger), Steuererklärung in Zypern – Schritt für Schritt.' },
  { icon: '🌐', title: 'Sprache & Integration', text: 'Griechisch lernen in Zypern: Kurse, Apps und Sprachpartner finden.' },
  { icon: '🧒', title: 'Kinder & Schulen', text: 'Deutsche Schulen, internationale Schools und zyprische Schulsystem erklärt.' },
];

export default function CommunityScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>Community</Text>
          <View style={{ minWidth: 70 }} />
        </View>
        <Text style={s.subHeaderSub}>Verbinde dich mit der Cyprus-Community</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* Gruppen & Kanäle */}
        <Text style={s.sectionLabel}>GRUPPEN & KANÄLE</Text>
        {GROUPS.map(g => (
          <TouchableOpacity key={g.name} style={s.groupCard} onPress={() => Linking.openURL(g.url)} activeOpacity={0.8}>
            <View style={[s.groupIconWrap, { backgroundColor: g.color + '18' }]}>
              <Text style={s.groupIcon}>{g.icon}</Text>
            </View>
            <View style={s.groupInfo}>
              <View style={s.groupTop}>
                <Text style={[s.groupPlatform, { color: g.color }]}>{g.platform}</Text>
              </View>
              <Text style={s.groupName}>{g.name}</Text>
              <Text style={s.groupDesc}>{g.desc}</Text>
            </View>
            <Text style={s.groupArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Auswanderer-Tipps */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>TIPPS FÜR AUSWANDERER</Text>
        <View style={s.tipsGrid}>
          {TIPS.map(t => (
            <View key={t.title} style={s.tipCard}>
              <Text style={s.tipIcon}>{t.icon}</Text>
              <Text style={s.tipTitle}>{t.title}</Text>
              <Text style={s.tipText}>{t.text}</Text>
            </View>
          ))}
        </View>

        {/* Eintrag erstellen CTA */}
        <View style={s.ctaCard}>
          <Text style={s.ctaTitle}>🏢 Unternehmen eintragen</Text>
          <Text style={s.ctaText}>Bist du selbstständig oder kennst du ein deutschsprachiges Unternehmen auf Zypern? Trag es kostenlos ein!</Text>
          <TouchableOpacity style={s.ctaBtn} onPress={() => router.push('/submit' as any)}>
            <Text style={s.ctaBtnText}>Jetzt eintragen →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 16, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subHeaderSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', marginTop: 4 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 1.2,
    marginBottom: 10,
  },

  groupCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  groupIconWrap: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  groupIcon: { fontSize: 22 },
  groupInfo: { flex: 1 },
  groupTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  groupPlatform: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  groupName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  groupDesc: { fontSize: 11, color: '#888', marginTop: 2, lineHeight: 16 },
  groupArrow: { fontSize: 20, color: '#ccc' },

  tipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tipCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    width: '47.5%',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  tipIcon: { fontSize: 24, marginBottom: 6 },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  tipText: { fontSize: 11, color: '#888', lineHeight: 16 },

  ctaCard: {
    backgroundColor: Colors.primary, borderRadius: 18, padding: 20,
    marginTop: 20, gap: 8,
  },
  ctaTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  ctaText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
  ctaBtn: {
    backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', marginTop: 4,
  },
  ctaBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '800' },
});
