import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { useRouter } from 'expo-router';

type Weather = { temp: number; wind: number; humidity: number; icon: string };

async function fetchWeather(): Promise<Weather> {
  // Limassol, Cyprus as default coordinates
  const lat = 34.6786;
  const lon = 33.0413;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&wind_speed_unit=kmh`;
  const res = await fetch(url);
  const data = await res.json();
  const c = data.current;
  const code = c.weather_code;
  let icon = '☀️';
  if (code >= 80) icon = '🌧️';
  else if (code >= 61) icon = '🌦️';
  else if (code >= 51) icon = '🌦️';
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

const MENU_ITEMS = [
  { icon: '🏠', label: 'Start', route: '/(tabs)/' },
  { icon: '🚌', label: 'Bus', route: '/(tabs)/bus' },
  { icon: '🚨', label: 'Notfall', route: '/(tabs)/emergency' },
  { icon: '🌤️', label: 'Wetter', route: '/(tabs)/weather' },
  { icon: '⚙️', label: 'Einstellungen', route: null },
  { icon: '🤝', label: 'Partner', route: null },
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

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <>
      <View style={styles.header}>
        {/* Top row: logo + weather + lang + menu */}
        <View style={styles.topRow}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoSub}>🇨🇾 Cyprus</Text>
            <Text style={styles.logoTitle}>Inside Cyprus</Text>
          </View>

          {/* Weather strip */}
          {weather && (
            <TouchableOpacity style={styles.weatherStrip} onPress={() => router.push('/(tabs)/weather' as any)}>
              <Text style={styles.weatherItem}>{weather.icon} {weather.temp}°C</Text>
              <Text style={styles.weatherDivider}>·</Text>
              <Text style={styles.weatherItem}>💨 {weather.wind} km/h</Text>
              <Text style={styles.weatherDivider}>·</Text>
              <Text style={styles.weatherItem}>💧 {weather.humidity}%</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actions}>
            {/* Language dropdown */}
            <TouchableOpacity style={styles.langBtn} onPress={() => setLangOpen(true)}>
              <Text style={styles.langFlag}>{currentLang.flag}</Text>
              <Text style={styles.langCode}>{currentLang.code.toUpperCase()} ▾</Text>
            </TouchableOpacity>
            {/* Hamburger */}
            <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(true)}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
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

      {/* Hamburger menu modal */}
      <Modal visible={menuOpen} transparent animationType="slide" onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>🇨🇾 Inside Cyprus</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Text style={styles.menuClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {MENU_ITEMS.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  if (item.route) router.push(item.route as any);
                }}
              >
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Text style={styles.menuItemArrow}>›</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>Inside Cyprus v1.0</Text>
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
    paddingTop: 10, paddingBottom: 14, paddingHorizontal: 16,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoWrap: { flex: 0 },
  logoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '500' },
  logoTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },

  weatherStrip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 5, gap: 4,
  },
  weatherItem: { color: '#fff', fontSize: 11, fontWeight: '600' },
  weatherDivider: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },

  actions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 5,
  },
  langFlag: { fontSize: 14 },
  langCode: { color: '#fff', fontSize: 10, fontWeight: '700' },
  menuBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  menuIcon: { color: '#fff', fontSize: 16, fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end' },

  langDropdown: {
    backgroundColor: '#fff', borderRadius: 16, marginTop: 70, marginRight: 60,
    overflow: 'hidden', minWidth: 180,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  langItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F5' },
  langItemActive: { backgroundColor: Colors.primary + '10' },
  langItemFlag: { fontSize: 18 },
  langItemLabel: { flex: 1, fontSize: 14, color: '#1A1A2E', fontWeight: '500' },
  langItemLabelActive: { color: Colors.primary, fontWeight: '700' },
  checkmark: { color: Colors.primary, fontSize: 16, fontWeight: '700' },

  menuDrawer: {
    backgroundColor: '#fff', width: 280, height: '100%',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 15,
  },
  menuHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.primary, padding: 20, paddingTop: 50,
  },
  menuTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  menuClose: { color: '#fff', fontSize: 20, fontWeight: '700' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F8',
  },
  menuItemIcon: { fontSize: 22, width: 30 },
  menuItemLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  menuItemArrow: { fontSize: 20, color: '#ccc' },
  menuFooter: { padding: 20, marginTop: 'auto' },
  menuFooterText: { color: '#ccc', fontSize: 12 },
});
