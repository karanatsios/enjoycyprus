import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, FlatList, ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BUS_STOPS, findRoute, Route } from '../../constants/busStops';

const BUS_YELLOW = '#F5A623';
const BUS_YELLOW_DARK = '#D4891A';

function StopInput({
  label, icon, value, onChange, onSelect, onLocationPress,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
  onLocationPress: () => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    onChange(text);
    const filtered = text.length === 0
      ? BUS_STOPS.slice(0, 50)
      : BUS_STOPS.filter(s => s.toLowerCase().includes(text.toLowerCase())).slice(0, 50);
    setSuggestions(filtered);
  };

  const handleSelect = (stop: string) => {
    onSelect(stop);
    setSuggestions([]);
    setFocused(false);
  };

  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.inputRow, focused && inputStyles.inputRowFocused]}>
        <Text style={inputStyles.icon}>{icon}</Text>
        <TextInput
          style={inputStyles.input}
          placeholder={`z.B. Larnaca, Nicosia`}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={handleChange}
          onFocus={() => {
            setFocused(true);
            const all = value.length === 0
              ? BUS_STOPS.slice(0, 50)
              : BUS_STOPS.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 50);
            setSuggestions(all);
          }}
          onBlur={() => setTimeout(() => { setFocused(false); setSuggestions([]); }, 200)}
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => { onChange(''); setSuggestions([]); }}>
            <Text style={inputStyles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {suggestions.length > 0 && focused && (
        <View style={inputStyles.dropdown}>
          {suggestions.map(stop => (
            <TouchableOpacity
              key={stop}
              style={inputStyles.suggestion}
              onPress={() => handleSelect(stop)}
            >
              <Text style={inputStyles.suggestionIcon}>🚏</Text>
              <Text style={inputStyles.suggestionText}>{stop}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={inputStyles.locationBtn} onPress={onLocationPress}>
        <Text style={inputStyles.locationIcon}>📍</Text>
        <Text style={inputStyles.locationText}>Mein Standort</Text>
      </TouchableOpacity>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F4F6FA', borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, borderWidth: 1.5, borderColor: 'transparent',
  },
  inputRowFocused: { borderColor: Colors.primary, backgroundColor: '#fff' },
  icon: { fontSize: 16 },
  input: { flex: 1, fontSize: 14, color: '#1A1A2E' },
  clearBtn: { fontSize: 14, color: '#aaa', paddingHorizontal: 4 },
  dropdown: {
    backgroundColor: '#fff', borderRadius: 12, marginTop: 4,
    borderWidth: 1, borderColor: '#E8E8EE',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
    zIndex: 100,
  },
  suggestion: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F5',
  },
  suggestionIcon: { fontSize: 14 },
  suggestionText: { fontSize: 13, color: '#1A1A2E', flex: 1 },
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EAF5F0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9, marginTop: 6,
    alignSelf: 'flex-start',
  },
  locationIcon: { fontSize: 14 },
  locationText: { fontSize: 13, fontWeight: '600', color: '#27AE60' },
});

function ResultCard({ route }: { route: Route }) {
  const now = new Date();
  const cyprusHour = (now.getUTCHours() + 3) % 24;
  const cyprusMinute = now.getMinutes();
  const currentTime = cyprusHour * 60 + cyprusMinute;

  const nextDep = route.departures.find(dep => {
    const [h, m] = dep.split(':').map(Number);
    return (h * 60 + (m || 0)) > currentTime;
  }) || route.departures[0];

  return (
    <View style={resultStyles.card}>
      <View style={resultStyles.header}>
        <View style={resultStyles.badge}>
          <Text style={resultStyles.badgeText}>🚌 Direkt</Text>
        </View>
        <Text style={resultStyles.duration}>⏱ {route.duration}</Text>
      </View>
      <View style={resultStyles.route}>
        <View style={resultStyles.stop}>
          <View style={resultStyles.dot} />
          <Text style={resultStyles.stopName}>{route.from}</Text>
        </View>
        <View style={resultStyles.line} />
        <View style={resultStyles.stop}>
          <View style={[resultStyles.dot, resultStyles.dotEnd]} />
          <Text style={resultStyles.stopName}>{route.to}</Text>
        </View>
      </View>
      <View style={resultStyles.meta}>
        <Text style={resultStyles.metaText}>🏢 {route.operator}</Text>
        <Text style={resultStyles.metaText}>💶 {route.price}</Text>
        <Text style={resultStyles.metaText}>🕐 Nächste: {nextDep}</Text>
      </View>
      <View style={resultStyles.departures}>
        <Text style={resultStyles.depLabel}>Abfahrten heute:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={resultStyles.depRow}>
            {route.departures.map(dep => {
              const [h, m] = dep.split(':').map(Number);
              const isPast = (h * 60 + (m || 0)) < currentTime;
              return (
                <View key={dep} style={[resultStyles.depChip, isPast && resultStyles.depChipPast]}>
                  <Text style={[resultStyles.depTime, isPast && resultStyles.depTimePast]}>{dep}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const resultStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
    borderWidth: 1, borderColor: '#F0F0F5',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  badge: { backgroundColor: Colors.primary + '18', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  duration: { fontSize: 13, color: '#555', fontWeight: '600' },
  route: { marginBottom: 14 },
  stop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.primary + '40' },
  dotEnd: { backgroundColor: BUS_YELLOW, borderColor: BUS_YELLOW + '40' },
  line: { width: 2, height: 20, backgroundColor: '#E0E0E0', marginLeft: 4, marginVertical: 2 },
  stopName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  meta: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 14 },
  metaText: { fontSize: 12, color: '#666' },
  departures: {},
  depLabel: { fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 8 },
  depRow: { flexDirection: 'row', gap: 6 },
  depChip: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  depChipPast: { backgroundColor: '#E8E8EE' },
  depTime: { color: '#fff', fontSize: 12, fontWeight: '700' },
  depTimePast: { color: '#aaa' },
});

export default function BusScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<Route | null | 'none'>(null);
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const cyprusTime = `${String((now.getUTCHours() + 3) % 24).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const handleSearch = () => {
    if (!from || !to) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const route = findRoute(from, to);
      setResult(route ?? 'none');
      setLoading(false);
    }, 800);
  };

  const handleLocation = (field: 'from' | 'to') => {
    // Simulate Larnaca as current location
    if (field === 'from') setFrom('Larnaca');
    else setTo('Larnaca');
  };

  const handleSwap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚌 Busverbindungen</Text>
        <Text style={styles.headerSub}>Von A nach B mit öffentlichen Bussen auf Zypern</Text>
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Status bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusIcon}>🚌</Text>
          <Text style={styles.statusText}>Busdaten aktiv · {BUS_STOPS.length} Haltestellen · Zypern-Zeit {cyprusTime}</Text>
        </View>

        {/* Search card */}
        <View style={styles.searchCard}>
          <StopInput
            label="Von"
            icon="📍"
            value={from}
            onChange={setFrom}
            onSelect={setFrom}
            onLocationPress={() => handleLocation('from')}
          />

          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>

          <StopInput
            label="Nach"
            icon="🏁"
            value={to}
            onChange={setTo}
            onSelect={setTo}
            onLocationPress={() => handleLocation('to')}
          />

          <TouchableOpacity
            style={[styles.searchBtn, (!from || !to) && styles.searchBtnDisabled]}
            onPress={handleSearch}
            activeOpacity={0.85}
            disabled={!from || !to}
          >
            <Text style={styles.searchBtnText}>⇄ Verbindung suchen</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Uhrzeiten werden direkt aus den offiziellen GTFS-Daten angezeigt:{'\n'}lokale Zypern-Zeit, ohne Server-/Browser-Umrechnung.
          </Text>
        </View>

        {/* Result */}
        <View style={styles.resultWrap}>
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={styles.loadingText}>Verbindungen werden gesucht…</Text>
            </View>
          )}

          {result === 'none' && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Keine direkte Verbindung gefunden</Text>
              <Text style={styles.emptySub}>Versuche andere Haltestellen oder größere Städte wie Nicosia, Larnaca, Limassol oder Paphos.</Text>
            </View>
          )}

          {result && result !== 'none' && (
            <View>
              <Text style={styles.resultTitle}>Verbindungen gefunden</Text>
              <ResultCard route={result} />
            </View>
          )}

          {!result && !loading && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🚌</Text>
              <Text style={styles.emptyTitle}>Start und Ziel eingeben</Text>
              <Text style={styles.emptySub}>Teste z.B. Larnaca → Nicosia, Limassol → Paphos{'\n'}oder nutze deinen Standort.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },

  header: {
    backgroundColor: BUS_YELLOW_DARK,
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },

  scroll: { flex: 1 },

  statusBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12, margin: 16, marginBottom: 0,
    padding: 12, borderWidth: 1, borderColor: '#E8E8EE',
  },
  statusIcon: { fontSize: 16 },
  statusText: { fontSize: 12, color: '#555', fontWeight: '500' },

  searchCard: {
    backgroundColor: '#fff', borderRadius: 20, margin: 16,
    padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },

  swapBtn: {
    alignSelf: 'center', backgroundColor: Colors.primary + '18',
    borderRadius: 20, width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
    marginVertical: 8,
  },
  swapIcon: { fontSize: 18, color: Colors.primary, fontWeight: '700' },

  searchBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 14,
  },
  searchBtnDisabled: { backgroundColor: '#ccc' },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  hint: { fontSize: 11, color: '#aaa', marginTop: 10, lineHeight: 16 },

  resultWrap: { paddingHorizontal: 16 },
  resultTitle: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 10 },

  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { color: '#888', fontSize: 14 },

  emptyBox: {
    backgroundColor: '#fff', borderRadius: 18, padding: 30,
    alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  emptyIcon: { fontSize: 40, marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20 },
});
