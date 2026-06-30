import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, StyleSheet,
  TouchableOpacity, FlatList, SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import CategoryCard from '../../components/CategoryCard';
import BusinessCard, { Business } from '../../components/BusinessCard';
import EventCard, { Event } from '../../components/EventCard';
import AppHeader from '../../components/AppHeader';
import { useTheme } from '../../context/ThemeContext';

const MOCK_BUSINESSES: Business[] = [
  { id: '1', name: 'Taverna Aphrodite', category: 'gastronomie', categoryIcon: '🍽️', rating: 4.8, reviewCount: 312, address: 'Limassol Seafront', isOpen: true, image: '', featured: true },
  { id: '2', name: 'Cyprus Realty Pro', category: 'immobilien', categoryIcon: '🏠', rating: 4.6, reviewCount: 89, address: 'Nicosia Center', isOpen: true, image: '' },
  { id: '3', name: 'Dr. Maria Petrides', category: 'medizin', categoryIcon: '⚕️', rating: 4.9, reviewCount: 204, address: 'Larnaca Medical Hub', isOpen: false, image: '', featured: true },
  { id: '4', name: 'Beach Rentals Cyprus', category: 'mobilitaet', categoryIcon: '🚗', rating: 4.5, reviewCount: 156, address: 'Paphos Harbor', isOpen: true, image: '' },
];

const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Limassol Wine Festival', date: '28. Jun 2026', location: 'Limassol Municipal Gardens', category: 'tourismus', icon: '🍷', price: null, color: Colors.coral },
  { id: '2', title: 'Cyprus Tech Summit', date: '5. Jul 2026', location: 'Nicosia Conference Center', category: 'dienstleistung', icon: '💻', price: 25, color: Colors.primary },
  { id: '3', title: 'Paphos Beach Party', date: '12. Jul 2026', location: 'Paphos Beach Bar', category: 'tourismus', icon: '🎶', price: 10, color: Colors.gold },
  { id: '4', title: 'Expat Meetup Larnaca', date: '19. Jul 2026', location: 'Finikoudes Promenade', category: 'auswandern', icon: '🌍', price: null, color: Colors.primaryLight },
];

type MiniWeather = { temp: number; wind: number; humidity: number; icon: string };

async function fetchMiniWeather(): Promise<MiniWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=34.6786&longitude=33.0413&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&wind_speed_unit=kmh`;
  const res = await fetch(url);
  const data = await res.json();
  const c = data.current;
  const code = c.weather_code;
  let icon = '☀️';
  if (code >= 80) icon = '🌧️';
  else if (code >= 61) icon = '🌦️';
  else if (code >= 45) icon = '🌫️';
  else if (code >= 3) icon = '☁️';
  else if (code >= 1) icon = '⛅';
  return { temp: Math.round(c.temperature_2m), wind: Math.round(c.wind_speed_10m), humidity: Math.round(c.relative_humidity_2m), icon };
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [weather, setWeather] = useState<MiniWeather | null>(null);

  useEffect(() => {
    fetchMiniWeather().then(setWeather).catch(() => null);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader />
      {/* SEARCH */}
      <View style={[styles.searchBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('search')}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>{t('welcome')}</Text>
          <Text style={styles.heroTagline}>{t('tagline')}</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}><Text style={styles.heroStatNum}>500+</Text><Text style={styles.heroStatLabel}>Business</Text></View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}><Text style={styles.heroStatNum}>120+</Text><Text style={styles.heroStatLabel}>Events</Text></View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}><Text style={styles.heroStatNum}>7</Text><Text style={styles.heroStatLabel}>Sprachen</Text></View>
          </View>
        </View>

        {/* CATEGORIES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('categories')}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>{t('seeAll')}</Text></TouchableOpacity>
          </View>
          <FlatList
            horizontal showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <CategoryCard id={item.id} icon={item.icon} color={item.color} bgColor={item.bgColor} />
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        {/* FEATURED BUSINESSES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('featuredBusiness')}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>{t('seeAll')}</Text></TouchableOpacity>
          </View>
          <FlatList
            horizontal showsHorizontalScrollIndicator={false}
            data={MOCK_BUSINESSES}
            keyExtractor={i => i.id}
            renderItem={({ item }) => <BusinessCard business={item} />}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        {/* EVENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('featuredEvents')}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>{t('seeAll')}</Text></TouchableOpacity>
          </View>
          <FlatList
            horizontal showsHorizontalScrollIndicator={false}
            data={MOCK_EVENTS}
            keyExtractor={i => i.id}
            renderItem={({ item }) => <EventCard event={item} />}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        {/* WETTER-KACHEL – dezent */}
        {weather && (
          <TouchableOpacity style={[styles.weatherTile, { backgroundColor: colors.cardBg, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/(tabs)/weather' as any)}>
            <Text style={styles.weatherTileIcon}>{weather.icon}</Text>
            <View style={styles.weatherTileBody}>
              <Text style={styles.weatherTileTitle}>Wetter auf Zypern</Text>
              <Text style={styles.weatherTileSub}>💨 {weather.wind} km/h · 💧 {weather.humidity}%</Text>
            </View>
            <Text style={styles.weatherTileTemp}>{weather.temp}°C</Text>
            <Text style={styles.weatherTileArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* ADD BUSINESS CTA */}
        <TouchableOpacity style={styles.ctaBanner} activeOpacity={0.88} onPress={() => router.push('/(tabs)/submit')}>
          <Text style={styles.ctaIcon}>🏢</Text>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>{t('addBusiness')}</Text>
            <Text style={styles.ctaSub}>Kostenlos & in wenigen Minuten</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 8,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },

  scroll: { flex: 1 },

  heroBanner: {
    margin: 20, marginBottom: 10, borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    padding: 22, overflow: 'hidden',
  },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  heroTagline: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 18 },
  heroStats: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { alignItems: 'center', flex: 1 },
  heroStatNum: { color: Colors.goldLight, fontSize: 20, fontWeight: '800' },
  heroStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  heroStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  weatherTile: {
    marginHorizontal: 20, marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#E8EEF5',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  weatherTileIcon: { fontSize: 28 },
  weatherTileBody: { flex: 1 },
  weatherTileTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  weatherTileSub: { fontSize: 11, color: '#888', marginTop: 2 },
  weatherTileTemp: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  weatherTileArrow: { fontSize: 20, color: '#ccc' },

  ctaBanner: {
    margin: 20, marginTop: 24, backgroundColor: Colors.coral,
    borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: Colors.coral, shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  ctaIcon: { fontSize: 32 },
  ctaText: { flex: 1 },
  ctaTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  ctaSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  ctaArrow: { color: '#fff', fontSize: 22, fontWeight: '700' },
});
