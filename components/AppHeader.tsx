import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { useRouter } from 'expo-router';

type Weather = { temp: number; wind: number; humidity: number; icon: string };

async function fetchWeather(): Promise<Weather> {
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
  return {
    temp: Math.round(c.temperature_2m),
    wind: Math.round(c.wind_speed_10m),
    humidity: Math.round(c.relative_humidity_2m),
    icon,
  };
}

// TRNC flag via Wikimedia (reliable CDN, no API key needed)
const TRNC_FLAG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg/60px-Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg.png';

const MENU_SECTIONS = [
  {
    title: 'NAVIGATION',
    items: [
      { icon: '🏠', label: 'Start', sub: 'Kategorien und Suche', route: '/(tabs)/' },
      { icon: '🗂️', label: 'Alle Einträge', sub: 'Alle Unternehmen durchsuchen', route: '/(tabs)/categories' },
      { icon: '🗺️', label: 'Karte', sub: 'Orte auf der Karte finden', route: '/(tabs)/map' },
      { icon: '⭐', label: 'Partner werden', sub: 'Provisionen verdienen', route: null },
    ],
  },
  {
    title: 'FÜR UNTERNEHMEN',
    items: [
      { icon: '➕', label: 'Eintrag erstellen', sub: 'Unternehmen eintragen', route: '/(tabs)/submit' },
      { icon: '👤', label: 'Mein Eintrag', sub: 'Eintrag bearbeiten / verlängern', route: null },
    ],
  },
  {
    title: 'MEHR',
    items: [
      { icon: '👥', label: 'Community', sub: 'Inside Cyprus Community', route: '/(tabs)/community' },
      { icon: '🎉', label: 'Events', sub: 'Veranstaltungen auf Zypern', route: '/(tabs)/events' },
      { icon: '🚌', label: 'Bus', sub: 'Busverbindungen auf Zypern', route: '/(tabs)/bus' },
      { icon: '🚨', label: 'Notfall', sub: 'Wichtige Notrufnummern', route: '/(tabs)/emergency' },
      { icon: '🌤️', label: 'Wetter', sub: '7-Tage-Vorschau', route: '/(tabs)/weather' },
      { icon: '👤', label: 'Profil', sub: 'Mein Profil', route: '/(tabs)/profile' },
      { icon: '⚙️', label: 'Einstellungen', sub: 'App konfigurieren', route: null },
    ],
  },
];

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'el', flag: '🇬🇷', label: 'Ελληνικά' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'ro', flag: '🇷🇴', label: 'Română' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
];

export default function AppHeader() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => null);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <>
      <View style={styles.header}>
        {/* Row 1: Logo + Lang + Menu */}
        <View style={styles.row1}>
          <View style={styles.logo}>
            <View style={styles.logoFlags}>
              <Text style={styles.logoFlag}>🇨🇾</Text>
              <Text style={styles.logoTitle}>Inside Cyprus</Text>
              <Image
                source={{ uri: TRNC_FLAG }}
                style={styles.trncFlag}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.logoSub}>Das Portal für Zypern</Text>
          </View>

          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.langBtn} onPress={() => setLangOpen(true)}>
              <Text style={styles.langFlag}>{currentLang.flag}</Text>
              <Text style={styles.langCode}>{currentLang.code.toUpperCase()} ▾</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(true)}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Weather strip */}
        {weather && (
          <TouchableOpacity style={styles.weatherRow} onPress={() => router.push('/(tabs)/weather' as any)}>
            <Text style={styles.weatherText}>{weather.icon} {weather.temp}°C</Text>
            <Text style={styles.weatherDot}>·</Text>
            <Text style={styles.weatherText}>💨 {weather.wind} km/h</Text>
            <Text style={styles.weatherDot}>·</Text>
            <Text style={styles.weatherText}>💧 {weather.humidity}%</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Language modal */}
      <Modal visible={langOpen} transparent animationType="fade" onRequestClose={() => setLangOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setLangOpen(false)}>
          <View style={styles.langDropdown}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langItem, i18n.language === lang.code && styles.langItemActive]}
                onPress={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
              >
                <Text style={styles.langItemFlag}>{lang.flag}</Text>
                <Text style={[styles.langItemLabel, i18n.language === lang.code && styles.langItemLabelActive]}>
                  {lang.label}
                </Text>
                {i18n.language === lang.code && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Hamburger drawer */}
      <Modal visible={menuOpen} transparent animationType="slide" onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuOpen(false)}>
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>🇨🇾 Inside Cyprus</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Text style={styles.drawerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {MENU_SECTIONS.map(section => (
              <View key={section.title}>
                <Text style={styles.drawerSection}>{section.title}</Text>
                {section.items.map(item => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.drawerItem}
                    onPress={() => { setMenuOpen(false); if (item.route) router.push(item.route as any); }}
                  >
                    <View style={styles.drawerItemIconWrap}>
                      <Text style={styles.drawerItemIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.drawerItemText}>
                      <Text style={styles.drawerItemLabel}>{item.label}</Text>
                      <Text style={styles.drawerItemSub}>{item.sub}</Text>
                    </View>
                    <Text style={styles.drawerItemArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>Inside Cyprus v1.0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 12, paddingBottom: 12, paddingHorizontal: 16,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },

  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { flexDirection: 'column' },
  logoFlags: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoFlag: { fontSize: 24 },
  trncFlag: { width: 36, height: 24, borderRadius: 2 },
  logoTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  logoSub: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '500', marginTop: 1 },

  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 5,
  },
  langFlag: { fontSize: 14 },
  langCode: { color: '#fff', fontSize: 10, fontWeight: '700' },
  menuBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  menuIcon: { color: '#fff', fontSize: 16 },

  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  weatherText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  weatherDot: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end' },

  langDropdown: {
    backgroundColor: '#fff', borderRadius: 16, marginTop: 80, marginRight: 55,
    overflow: 'hidden', minWidth: 180,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  langItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F5' },
  langItemActive: { backgroundColor: Colors.primary + '15' },
  langItemFlag: { fontSize: 18 },
  langItemLabel: { flex: 1, fontSize: 14, color: '#1A1A2E', fontWeight: '500' },
  langItemLabelActive: { color: Colors.primary, fontWeight: '700' },
  checkmark: { color: Colors.primary, fontSize: 16, fontWeight: '700' },

  drawer: {
    backgroundColor: '#fff', width: 280, height: '100%',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 15,
  },
  drawerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.primary, padding: 20, paddingTop: 50,
  },
  drawerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  drawerClose: { color: '#fff', fontSize: 20, fontWeight: '700' },
  drawerSection: {
    fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 1,
    paddingHorizontal: 18, paddingTop: 18, paddingBottom: 6,
  },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F8',
  },
  drawerItemIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center',
  },
  drawerItemIcon: { fontSize: 20 },
  drawerItemText: { flex: 1 },
  drawerItemLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  drawerItemSub: { fontSize: 11, color: '#999', marginTop: 1 },
  drawerItemArrow: { fontSize: 20, color: '#ccc' },
  drawerFooter: { padding: 20, marginTop: 'auto' },
  drawerFooterText: { color: '#ccc', fontSize: 12 },
});
