import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Linking, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

/* ─── Datentypen ─────────────────────────────────────────── */
type Category  = 'krankenhaus' | 'gesundheitszentrum' | 'botschaft';
type Region    = 'sue' | 'nor';
type Ownership = 'staatlich' | 'privat' | 'offiziell';

type Entry = {
  id: string;
  category: Category;
  region: Region;
  ownership: Ownership;
  name: string;
  nameSub?: string;
  address?: string;
  phone?: string;
  note?: string;
  lat?: number;
  lng?: number;
};

/* ─── Daten ──────────────────────────────────────────────── */
const ENTRIES: Entry[] = [
  /* ═══════════════  KRANKENHÄUSER STAATLICH SÜDEN  ═══════════════ */
  {
    id: 'k1', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Nicosia General Hospital',
    nameSub: 'Γενικό Νοσοκομείο Λευκωσίας',
    address: '215 Old Road Nicosia–Limassol, 2029 Strovolos',
    phone: '+357 22 603 000', lat: 35.1500, lng: 33.3667,
  },
  {
    id: 'k2', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Archbishop Makarios III Hospital (Kinderklinik)',
    nameSub: 'Νοσοκομείο Αρχιεπίσκοπος Μακάριος ΙΙΙ',
    address: 'Koritsas 6, 2012 Strovolos',
    phone: '+357 22 405 000', lat: 35.1489, lng: 33.3628,
  },
  {
    id: 'k3', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Limassol General Hospital',
    nameSub: 'Γενικό Νοσοκομείο Λεμεσού',
    address: 'Nikaias, Kato Polemidia, Limassol',
    phone: '+357 25 801 100', lat: 34.7058, lng: 33.0361,
  },
  {
    id: 'k4', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Larnaca General Hospital',
    nameSub: 'Γενικό Νοσοκομείο Λάρνακας',
    address: 'Leoforos Inglanteras (USA Avenue), 6301 Larnaca',
    phone: '+357 24 800 500', lat: 34.9050, lng: 33.6439,
  },
  {
    id: 'k5', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Paphos General Hospital',
    nameSub: 'Γενικό Νοσοκομείο Πάφου',
    address: 'Achepans Street, 8026 Paphos',
    phone: '+357 26 803 100', lat: 34.7744, lng: 32.4197,
  },
  {
    id: 'k6', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Famagusta General Hospital (Paralimni)',
    nameSub: 'Γενικό Νοσοκομείο Αμμοχώστου',
    address: 'Ippokratous, Paralimni',
    phone: '+357 23 200 000', lat: 35.0319, lng: 33.9806,
  },
  {
    id: 'k7', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Polis Chrysochous Hospital',
    nameSub: 'Νοσοκομείο Πόλεως Χρυσοχούς',
    address: 'Thessalonikis, Polis Chrysochous',
    phone: '+357 26 821 800', lat: 35.0333, lng: 32.4256,
  },
  {
    id: 'k8', category: 'krankenhaus', region: 'sue', ownership: 'staatlich',
    name: 'Kyperounda / Troodos Hospital',
    nameSub: 'Νοσοκομείο Τροόδους',
    address: '115 Louka Papachristodoulou Ave., 4876 Kyperounda',
    phone: '+357 25 806 700', lat: 34.9333, lng: 32.9833,
  },

  /* ═══════════════  KRANKENHÄUSER STAATLICH NORDEN  ══════════════ */
  {
    id: 'k9', category: 'krankenhaus', region: 'nor', ownership: 'staatlich',
    name: 'Dr. Burhan Nalbantoğlu State Hospital',
    address: 'zwischen Ortaköy und Gönyeli, Lefkoşa',
    phone: '+90 392 228 5441', lat: 35.2028, lng: 33.3420,
    note: 'Größtes Staatskrankenhaus in Nordzypern, volles Notfall-/Trauma-Zentrum.',
  },
  {
    id: 'k10', category: 'krankenhaus', region: 'nor', ownership: 'staatlich',
    name: 'Dr. Akçiçek State Hospital (Girne/Kyrenia)',
    address: 'nahe dem Hafen, Girne',
    phone: '+90 392 815 2266', lat: 35.3411, lng: 33.3178,
  },
  {
    id: 'k11', category: 'krankenhaus', region: 'nor', ownership: 'staatlich',
    name: 'Gazimağusa State Hospital (Famagusta)',
    address: 'Ausfahrt Richtung İskele, Gazimağusa',
    phone: '+90 392 366 5328', lat: 35.1247, lng: 33.9564,
  },
  {
    id: 'k12', category: 'krankenhaus', region: 'nor', ownership: 'staatlich',
    name: 'Cengiz Topel Hospital (Güzelyurt State Hospital)',
    address: 'Yeşilyurt, Güzelyurt',
    phone: '+90 392 714 2125', lat: 35.2028, lng: 32.9944,
  },

  /* ═══════════════  KRANKENHÄUSER PRIVAT SÜDEN  ══════════════════ */
  {
    id: 'k13', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Mediterranean Hospital of Cyprus',
    address: '9 Stygos Street, 3117 Limassol',
    phone: '+357 25 200 000', lat: 34.6858, lng: 33.0508,
  },
  {
    id: 'k14', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Ygia Polyclinic',
    address: '21 Nafpliou Street, 3025 Limassol',
    phone: '+357 25 828 888', lat: 34.6817, lng: 33.0469,
  },
  {
    id: 'k15', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Apollonion Private Hospital',
    address: '20 Lefkotheou Avenue, 2054 Nicosia',
    phone: '+357 22 469 000', lat: 35.1611, lng: 33.3881,
  },
  {
    id: 'k16', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Aretaeio Hospital',
    address: '55–57 Andrea Avraamidi Street, 2024 Nicosia',
    phone: '+357 22 200 300', lat: 35.1592, lng: 33.3758,
  },
  {
    id: 'k17', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'American Medical Center',
    nameSub: 'vormals American Heart Institute',
    address: '215 Spyrou Kyprianou Avenue, 2047 Strovolos, Nicosia',
    phone: '+357 22 476 777', lat: 35.1536, lng: 33.3672,
  },
  {
    id: 'k18', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'St. Raphael Private Hospital',
    address: '25 Gordiou Desmou, 6045 Larnaca',
    phone: '+357 24 840 840', lat: 34.9119, lng: 33.6314,
    note: 'Einziges Privatkrankenhaus in Larnaca, eigene Notaufnahme.',
  },
  {
    id: 'k19', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Evangelismos Private Hospital',
    address: '87, Vasileos Constantinou, 8021 Paphos',
    phone: '+357 26 848 000', lat: 34.7736, lng: 32.4228,
  },
  {
    id: 'k20', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'IASIS Hospital',
    address: 'Paphos',
    phone: '+357 26 848 484', lat: 34.7731, lng: 32.4200,
    note: 'Adresse nicht zweifelsfrei bestätigt, nur Telefonnummer aus zwei übereinstimmenden Quellen.',
  },
  {
    id: 'k21', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'St George Private Hospital',
    address: 'Paphos',
    phone: '+357 26 947 000', lat: 34.7756, lng: 32.4236,
  },
  {
    id: 'k22', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Napa Olympic Private Hospital',
    address: 'Havares Street 24, 5330 Ayia Napa',
    phone: '+357 23 723 222', lat: 34.9889, lng: 34.0019,
    note: 'Einziges Krankenhaus in Ayia Napa, seit 1993, 24/7 Notaufnahme, 3 eigene Ambulanzen.',
  },
  {
    id: 'k23', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Valessia Polyclinic',
    address: '366 Protara-Kavo Gkreko Avenue, 5296 Protaras',
    phone: '+357 23 833 755', lat: 35.0125, lng: 34.0572,
    note: 'Sehr bekannte Klinik direkt im Touristenzentrum von Protaras.',
  },
  {
    id: 'k24', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'MediLife Medical Center',
    address: 'Leoforos Protara-Kavo Gkreko 356, 5297 Protaras',
    phone: '+357 24 030 584', lat: 35.0150, lng: 34.0600,
  },
  {
    id: 'k25', category: 'krankenhaus', region: 'sue', ownership: 'privat',
    name: 'Santa Marina Polyclinic',
    address: 'Taki Sofocleous 5, 5284 Paralimni',
    phone: '+357 23 811 999', lat: 35.0369, lng: 33.9844,
  },

  /* ═══════════════  GESUNDHEITSZENTREN SÜDEN  ════════════════════ */
  {
    id: 'g1', category: 'gesundheitszentrum', region: 'sue', ownership: 'staatlich',
    name: 'Gesundheitszentrum Nicosia (GESY)',
    address: 'Nikis Avenue 11, Nicosia',
    phone: '+357 22 605 000', lat: 35.1725, lng: 33.3617,
    note: 'Staatlich – Teil des zyprischen Gesundheitssystems GESY.',
  },
  {
    id: 'g2', category: 'gesundheitszentrum', region: 'sue', ownership: 'staatlich',
    name: 'Gesundheitszentrum Limassol (GESY)',
    address: 'Gladstonos Street, Limassol',
    phone: '+357 25 803 100', lat: 34.6769, lng: 33.0444,
  },
  {
    id: 'g3', category: 'gesundheitszentrum', region: 'sue', ownership: 'staatlich',
    name: 'Gesundheitszentrum Larnaca (GESY)',
    address: 'Ermou Street 22, Larnaca',
    phone: '+357 24 801 500', lat: 34.9189, lng: 33.6331,
  },
  {
    id: 'g4', category: 'gesundheitszentrum', region: 'sue', ownership: 'staatlich',
    name: 'Gesundheitszentrum Paphos (GESY)',
    address: 'Evagora Pallikaridis, Paphos',
    phone: '+357 26 806 100', lat: 34.7756, lng: 32.4236,
  },
  {
    id: 'g5', category: 'gesundheitszentrum', region: 'sue', ownership: 'staatlich',
    name: 'Gesundheitszentrum Ayia Napa',
    address: 'Dimarchou Demetriou 1, Ayia Napa',
    phone: '+357 23 721 400', lat: 34.9844, lng: 34.0022,
  },
  {
    id: 'g6', category: 'gesundheitszentrum', region: 'nor', ownership: 'staatlich',
    name: 'Gesundheitszentrum Girne (Kyrenia)',
    address: 'Ziya Rızkı Caddesi, Girne',
    phone: '+90 392 815 2000', lat: 35.3411, lng: 33.3178,
  },

  /* ═══════════════  BOTSCHAFTEN  ══════════════════════════════════ */
  {
    id: 'b1', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Deutsche Botschaft Nicosia',
    address: 'Nikitaras 10, 1080 Nicosia',
    phone: '+357 22 451 145', lat: 35.1647, lng: 33.3611,
    note: 'Konsularische Sprechzeiten: Mo–Fr 08:00–12:00. Termine online buchen.',
  },
  {
    id: 'b2', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Österreichische Botschaft Nicosia',
    address: 'Glafkos Klerides, Nicosia',
    phone: '+357 22 471 711', lat: 35.1694, lng: 33.3547,
    note: 'Konsularische Angelegenheiten für österreichische Staatsbürger.',
  },
  {
    id: 'b3', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Schweizer Botschaft Nicosia',
    address: 'Metochiou & Falirou, 2408 Engomi, Nicosia',
    phone: '+357 22 464 664', lat: 35.1681, lng: 33.3528,
  },
  {
    id: 'b4', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'British High Commission Nicosia',
    address: 'Alexander Pallis Street, 1587 Nicosia',
    phone: '+357 22 861 100', lat: 35.1736, lng: 33.3703,
    note: 'Auch zuständig für britische Staatsangehörige auf der gesamten Insel.',
  },
  {
    id: 'b5', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'US-Botschaft Nicosia (Embassy of the United States)',
    address: 'Metochiou & Ploutarchou, 2407 Engomi, Nicosia',
    phone: '+357 22 393 939', lat: 35.1667, lng: 33.3500,
    note: 'Für US-Bürger: American Citizen Services, Visa, Reisepässe.',
  },
  {
    id: 'b6', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Russische Botschaft Nicosia',
    address: 'Agiou Prokopiou 2 & Arch. Makariou III, Engomi, Nicosia',
    phone: '+357 22 774 622', lat: 35.1722, lng: 33.3611,
  },
  {
    id: 'b7', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Griechische Botschaft Nicosia',
    address: 'Vyronos 8–10, 1096 Nicosia',
    phone: '+357 22 445 111', lat: 35.1653, lng: 33.3636,
  },
  {
    id: 'b8', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Israelische Botschaft Nicosia',
    address: '4 Grypari Street, 1507 Nicosia',
    phone: '+357 22 445 195', lat: 35.1692, lng: 33.3625,
  },
  {
    id: 'b9', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Botschaft der Vereinigten Arabischen Emirate',
    address: 'Glafkos Klerides Avenue, Nicosia',
    phone: '+357 22 316 888', lat: 35.1706, lng: 33.3547,
  },
  {
    id: 'b10', category: 'botschaft', region: 'sue', ownership: 'offiziell',
    name: 'Französische Botschaft Nicosia',
    address: 'Ploutarchou 12, 2406 Engomi, Nicosia',
    phone: '+357 22 587 700', lat: 35.1681, lng: 33.3511,
  },
];

/* ─── Hilfsfunktionen ──────────────────────────────────────── */
const CATEGORY_LABEL: Record<Category, string>  = {
  krankenhaus: 'Krankenhäuser',
  gesundheitszentrum: 'Gesundheitszentren',
  botschaft: 'Botschaften',
};
const OWNERSHIP_LABEL: Record<Ownership, string> = {
  staatlich: 'Staatlich', privat: 'Privat', offiziell: 'Offiziell',
};
const OWNERSHIP_COLOR: Record<Ownership, string> = {
  staatlich: '#1565C0', privat: '#6D4C41', offiziell: '#2E7D32',
};
const REGION_COLOR = { sue: '#27AE60', nor: '#E67E22' };

function openMaps(entry: Entry) {
  const q = entry.lat && entry.lng
    ? `${entry.lat},${entry.lng}`
    : encodeURIComponent(`${entry.name} ${entry.address ?? ''} Cyprus`);
  const url = Platform.OS === 'ios'
    ? `maps:0,0?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
  Linking.openURL(url);
}

function call(phone: string) {
  Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
}

/* ─── Komponente ───────────────────────────────────────────── */
export default function HospitalsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [region,   setRegion]   = useState<'all' | 'sue' | 'nor'>('all');
  const [nearMe,   setNearMe]   = useState(false);
  const [userLat,  setUserLat]  = useState<number | null>(null);
  const [userLng,  setUserLng]  = useState<number | null>(null);

  const CATEGORIES: { key: Category | 'all'; label: string; icon: string }[] = [
    { key: 'all',               label: 'Alle Typen',          icon: '🏥' },
    { key: 'krankenhaus',       label: 'Krankenhäuser',       icon: '🏥' },
    { key: 'gesundheitszentrum',label: 'Gesundheitszentren',  icon: '⚕️' },
    { key: 'botschaft',         label: 'Botschaften',         icon: '🏛️' },
  ];

  const requestNearMe = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setUserLat(pos.coords.latitude);
      setUserLng(pos.coords.longitude);
      setNearMe(true);
    }, () => setNearMe(false));
  };

  function dist(e: Entry) {
    if (!userLat || !userLng || !e.lat || !e.lng) return 999999;
    const R = 6371;
    const dLat = (e.lat - userLat) * Math.PI / 180;
    const dLng = (e.lng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(userLat * Math.PI / 180) * Math.cos(e.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  let filtered = ENTRIES.filter(e =>
    (category === 'all' || e.category === category) &&
    (region === 'all' || e.region === region)
  );

  if (nearMe && userLat) {
    filtered = [...filtered].sort((a, b) => dist(a) - dist(b));
  }

  const total = filtered.length;

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      {/* Sub-Header */}
      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backTxt}>← Zurück</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Krankenhäuser, Gesundheitszentren & Botschaften</Text>
          </View>
        </View>

        {/* Typ-Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}
          contentContainerStyle={s.filterRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c.key}
              style={[s.chip, category === c.key && s.chipActive]}
              onPress={() => setCategory(c.key)}>
              <Text style={[s.chipTxt, category === c.key && s.chipTxtActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Region-Filter */}
        <View style={s.filterRow2}>
          {(['all', 'sue', 'nor'] as const).map(r => {
            const label = r === 'all' ? 'Alle' : r === 'sue' ? 'Süden' : 'Norden';
            return (
              <TouchableOpacity key={r} style={[s.chip2, region === r && s.chip2Active]}
                onPress={() => setRegion(r)}>
                <Text style={[s.chipTxt, region === r && s.chipTxtActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}

          {/* In meiner Nähe */}
          <TouchableOpacity style={[s.nearBtn, nearMe && s.nearBtnActive]} onPress={() => {
            if (nearMe) { setNearMe(false); } else { requestNearMe(); }
          }}>
            <Text style={s.nearTxt}>{nearMe ? '📍 Nah zuerst' : '📍 In meiner Nähe'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hinweis */}
      <View style={s.hint}>
        <Text style={s.hintIcon}>📞</Text>
        <Text style={s.hintTxt}>Vor Besuch lieber kurz anrufen</Text>
      </View>

      {/* Anzahl */}
      <View style={s.countRow}>
        <Text style={s.countTxt}>{total} Einträge</Text>
      </View>

      {/* Liste */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map(entry => (
          <View key={entry.id} style={s.card}>
            {/* Name */}
            <Text style={s.cardName}>{entry.name}</Text>
            {entry.nameSub ? <Text style={s.cardNameSub}>{entry.nameSub}</Text> : null}

            {/* Badges */}
            <View style={s.badges}>
              <View style={[s.badge, { backgroundColor: OWNERSHIP_COLOR[entry.ownership] + '18', borderColor: OWNERSHIP_COLOR[entry.ownership] }]}>
                <Text style={[s.badgeTxt, { color: OWNERSHIP_COLOR[entry.ownership] }]}>{OWNERSHIP_LABEL[entry.ownership]}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: REGION_COLOR[entry.region] + '18', borderColor: REGION_COLOR[entry.region] }]}>
                <Text style={[s.badgeTxt, { color: REGION_COLOR[entry.region] }]}>{entry.region === 'sue' ? 'Süden' : 'Norden'}</Text>
              </View>
            </View>

            {/* Adresse */}
            {entry.address ? (
              <View style={s.metaRow}>
                <Text style={s.metaIcon}>📍</Text>
                <Text style={s.metaTxt}>{entry.address}</Text>
              </View>
            ) : null}

            {/* Telefon */}
            {entry.phone ? (
              <View style={s.metaRow}>
                <Text style={s.metaIcon}>📞</Text>
                <Text style={s.metaTxt}>{entry.phone}</Text>
              </View>
            ) : null}

            {/* Entfernung */}
            {nearMe && entry.lat ? (
              <View style={s.metaRow}>
                <Text style={s.metaIcon}>🗺️</Text>
                <Text style={[s.metaTxt, { color: Colors.primary }]}>{dist(entry).toFixed(1)} km entfernt</Text>
              </View>
            ) : null}

            {/* Hinweis */}
            {entry.note ? <Text style={s.note}>{entry.note}</Text> : null}

            {/* Buttons */}
            <View style={s.btnRow}>
              {entry.phone ? (
                <TouchableOpacity style={[s.btn, s.btnGreen]} onPress={() => call(entry.phone!)}>
                  <Text style={s.btnGreenTxt}>📞 Anrufen</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={[s.btn, s.btnBlue]} onPress={() => openMaps(entry)}>
                <Text style={s.btnBlueTxt}>🗺️ Auf Maps öffnen</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ────────────────────────────────────────────────── */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 14, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingTop: 4, paddingBottom: 12 },
  backBtn: { paddingTop: 3 },
  backTxt: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  title: { color: '#fff', fontSize: 17, fontWeight: '900', lineHeight: 22, flexShrink: 1 },

  filterScroll: { flexGrow: 0, marginBottom: 8 },
  filterRow:  { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  filterRow2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },

  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  chipActive: { backgroundColor: '#fff' },
  chipTxt: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700' },
  chipTxtActive: { color: Colors.primary },

  chip2: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  chip2Active: { backgroundColor: '#fff' },

  nearBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  nearBtnActive: { backgroundColor: '#fff' },
  nearTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  hint: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#FFF9E6', borderBottomWidth: 1, borderBottomColor: '#FDEEBA',
  },
  hintIcon: { fontSize: 16 },
  hintTxt: { fontSize: 13, color: '#7D5A00', fontWeight: '600' },

  countRow: { paddingHorizontal: 16, paddingVertical: 6 },
  countTxt: { fontSize: 12, color: '#888', fontWeight: '600' },

  list: { paddingHorizontal: 12, paddingTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 2, lineHeight: 21 },
  cardNameSub: { fontSize: 12, color: '#888', marginBottom: 6 },

  badges: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  badge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { fontSize: 11, fontWeight: '700' },

  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 },
  metaIcon: { fontSize: 13, marginTop: 1 },
  metaTxt: { fontSize: 13, color: '#444', flex: 1, lineHeight: 18 },

  note: {
    fontSize: 12, color: '#777', fontStyle: 'italic', lineHeight: 17,
    backgroundColor: '#F8F9FA', borderRadius: 8, padding: 8, marginTop: 6, marginBottom: 4,
  },

  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  btnGreen: { backgroundColor: '#EAFAF1', borderWidth: 1.5, borderColor: '#27AE60' },
  btnBlue:  { backgroundColor: '#1A1A2E', borderWidth: 1.5, borderColor: '#1A1A2E' },
  btnGreenTxt: { color: '#27AE60', fontWeight: '700', fontSize: 13 },
  btnBlueTxt:  { color: '#fff', fontWeight: '700', fontSize: 13 },
});
