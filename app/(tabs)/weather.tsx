import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';

type Current = {
  temp: number; wind: number; humidity: number;
  icon: string; desc: string; feelsLike: number;
};

type DayForecast = {
  date: string; day: string; icon: string;
  maxTemp: number; minTemp: number; rain: number;
};

function weatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function weatherDesc(code: number): string {
  if (code === 0) return 'Klarer Himmel';
  if (code <= 2) return 'Teilweise bewölkt';
  if (code <= 3) return 'Bewölkt';
  if (code <= 48) return 'Nebel';
  if (code <= 57) return 'Nieselregen';
  if (code <= 67) return 'Regen';
  if (code <= 77) return 'Schnee';
  if (code <= 82) return 'Regenschauer';
  return 'Gewitter';
}

const DAYS_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

async function fetchWeatherData(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&wind_speed_unit=kmh&timezone=Asia%2FNicosia&forecast_days=7`;
  const res = await fetch(url);
  return res.json();
}

export default function WeatherScreen() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Limassol, Zypern');
  const [error, setError] = useState('');

  const load = async (lat = 34.6786, lon = 33.0413, loc = 'Limassol, Zypern') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWeatherData(lat, lon);
      const c = data.current;
      setCurrent({
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        wind: Math.round(c.wind_speed_10m),
        humidity: Math.round(c.relative_humidity_2m),
        icon: weatherIcon(c.weather_code),
        desc: weatherDesc(c.weather_code),
      });
      const d = data.daily;
      setForecast(d.time.map((date: string, i: number) => ({
        date,
        day: i === 0 ? 'Heute' : i === 1 ? 'Morgen' : DAYS_DE[new Date(date).getDay()],
        icon: weatherIcon(d.weather_code[i]),
        maxTemp: Math.round(d.temperature_2m_max[i]),
        minTemp: Math.round(d.temperature_2m_min[i]),
        rain: Math.round(d.precipitation_sum[i] * 10) / 10,
      })));
      setLocation(loc);
    } catch (e) {
      setError('Wetterdaten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const LOCATIONS = [
    { label: 'Limassol', lat: 34.6786, lon: 33.0413 },
    { label: 'Nikosia', lat: 35.1856, lon: 33.3823 },
    { label: 'Larnaka', lat: 34.9009, lon: 33.6249 },
    { label: 'Paphos', lat: 34.7757, lon: 32.4241 },
    { label: 'Ayia Napa', lat: 34.9844, lon: 34.0000 },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌤️ Wetter</Text>
        <Text style={styles.headerSub}>{location}</Text>
      </View>

      {/* City picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {LOCATIONS.map(loc => (
          <TouchableOpacity
            key={loc.label}
            style={[styles.cityChip, location.includes(loc.label) && styles.cityChipActive]}
            onPress={() => load(loc.lat, loc.lon, `${loc.label}, Zypern`)}
          >
            <Text style={[styles.cityChipText, location.includes(loc.label) && styles.cityChipTextActive]}>
              {loc.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && (
        <View style={styles.loadBox}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadText}>Wetterdaten werden geladen…</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      {!loading && current && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current weather */}
          <View style={styles.currentCard}>
            <Text style={styles.currentIcon}>{current.icon}</Text>
            <Text style={styles.currentTemp}>{current.temp}°C</Text>
            <Text style={styles.currentDesc}>{current.desc}</Text>
            <View style={styles.currentStats}>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>🌡️</Text>
                <Text style={styles.statLabel}>Gefühlt</Text>
                <Text style={styles.statValue}>{current.feelsLike}°C</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statIcon}>💨</Text>
                <Text style={styles.statLabel}>Wind</Text>
                <Text style={styles.statValue}>{current.wind} km/h</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statIcon}>💧</Text>
                <Text style={styles.statLabel}>Luftfeuchte</Text>
                <Text style={styles.statValue}>{current.humidity}%</Text>
              </View>
            </View>
          </View>

          {/* 7-day forecast */}
          <Text style={styles.forecastTitle}>7-Tage-Vorschau</Text>
          <View style={styles.forecastCard}>
            {forecast.map((day, i) => (
              <View key={day.date}>
                <View style={styles.forecastRow}>
                  <Text style={styles.forecastDay}>{day.day}</Text>
                  <Text style={styles.forecastDate}>{day.date.slice(5).replace('-', '.')}</Text>
                  <Text style={styles.forecastIcon}>{day.icon}</Text>
                  {day.rain > 0 && <Text style={styles.forecastRain}>💧{day.rain}mm</Text>}
                  {day.rain === 0 && <Text style={styles.forecastRain} />}
                  <View style={styles.forecastTemps}>
                    <Text style={styles.forecastMax}>{day.maxTemp}°</Text>
                    <Text style={styles.forecastMin}>{day.minTemp}°</Text>
                  </View>
                </View>
                {i < forecast.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <Text style={styles.source}>Daten: Open-Meteo.com · Zypern-Lokalzeit</Text>
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  header: {
    backgroundColor: '#1565C0',
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },

  cityRow: { marginTop: 14, marginBottom: 4 },
  cityChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E0E0E0',
  },
  cityChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  cityChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  cityChipTextActive: { color: '#fff' },

  loadBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadText: { color: '#888', fontSize: 14 },
  errorBox: { margin: 20, backgroundColor: '#FFF3CD', borderRadius: 12, padding: 16 },
  errorText: { color: '#856404', fontSize: 14 },

  currentCard: {
    margin: 16, backgroundColor: '#1565C0', borderRadius: 24, padding: 28,
    alignItems: 'center',
    shadowColor: '#1565C0', shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  currentIcon: { fontSize: 72, marginBottom: 8 },
  currentTemp: { color: '#fff', fontSize: 64, fontWeight: '200', lineHeight: 72 },
  currentDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 4, marginBottom: 24 },
  currentStats: { flexDirection: 'row', width: '100%' },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 20 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  statValue: { color: '#fff', fontSize: 15, fontWeight: '700' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  forecastTitle: {
    fontSize: 13, fontWeight: '800', color: '#888',
    letterSpacing: 1, marginHorizontal: 20, marginBottom: 10,
  },
  forecastCard: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    overflow: 'hidden',
  },
  forecastRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8,
  },
  forecastDay: { width: 50, fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  forecastDate: { width: 38, fontSize: 11, color: '#999' },
  forecastIcon: { fontSize: 22, width: 30, textAlign: 'center' },
  forecastRain: { flex: 1, fontSize: 11, color: '#5B9BD5' },
  forecastTemps: { flexDirection: 'row', gap: 8 },
  forecastMax: { fontSize: 14, fontWeight: '800', color: '#E74C3C', width: 32, textAlign: 'right' },
  forecastMin: { fontSize: 14, fontWeight: '600', color: '#7F8C8D', width: 32, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#F5F5F8', marginHorizontal: 16 },

  source: { textAlign: 'center', color: '#bbb', fontSize: 10, marginTop: 12 },
});
