import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import LanguageSelector from '../../components/LanguageSelector';

const MAP_PINS = [
  { id: '1', name: 'Limassol', icon: '🍽️', top: '62%', left: '45%' },
  { id: '2', name: 'Nicosia', icon: '⚖️', top: '35%', left: '52%' },
  { id: '3', name: 'Larnaca', icon: '⚕️', top: '55%', left: '62%' },
  { id: '4', name: 'Paphos', icon: '🏖️', top: '60%', left: '22%' },
  { id: '5', name: 'Ayia Napa', icon: '🎶', top: '58%', left: '78%' },
];

export default function MapScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('map')}</Text>
        <LanguageSelector />
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapBg}>
          <Text style={styles.mapTitle}>🇨🇾 Zypern</Text>
          <Text style={styles.mapSub}>Interaktive Karte — kommt bald</Text>

          {MAP_PINS.map(pin => (
            <TouchableOpacity
              key={pin.id}
              style={[styles.pin, { top: pin.top, left: pin.left }]}
              activeOpacity={0.8}
            >
              <Text style={styles.pinIcon}>{pin.icon}</Text>
              <View style={styles.pinLabel}><Text style={styles.pinName}>{pin.name}</Text></View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        {[
          { icon: '🍽️', label: 'Gastronomie' },
          { icon: '🏠', label: 'Immobilien' },
          { icon: '⚕️', label: 'Medizin' },
          { icon: '🏖️', label: 'Tourismus' },
        ].map(item => (
          <View key={item.label} style={styles.legendItem}>
            <Text style={styles.legendIcon}>{item.icon}</Text>
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
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
  mapContainer: { flex: 1, margin: 20 },
  mapBg: {
    flex: 1, backgroundColor: '#C9E8F5', borderRadius: 24, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    borderWidth: 2, borderColor: Colors.primaryLight,
  },
  mapTitle: { fontSize: 28, fontWeight: '800', color: Colors.primaryDark, marginBottom: 4 },
  mapSub: { fontSize: 13, color: Colors.textLight },
  pin: {
    position: 'absolute', alignItems: 'center',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  pinIcon: {
    fontSize: 26, backgroundColor: '#fff', borderRadius: 16,
    padding: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  pinLabel: {
    backgroundColor: Colors.primary, borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 3,
  },
  pinName: { color: '#fff', fontSize: 9, fontWeight: '700' },
  legend: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.cardBg, marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  legendItem: { alignItems: 'center', gap: 4 },
  legendIcon: { fontSize: 20 },
  legendLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
});
