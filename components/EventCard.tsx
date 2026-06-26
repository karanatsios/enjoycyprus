import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useTranslation } from 'react-i18next';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  icon: string;
  price: number | null;
  color: string;
}

interface Props { event: Event; onPress?: () => void; }

export default function EventCard({ event, onPress }: Props) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.colorStrip, { backgroundColor: event.color }]}>
        <Text style={styles.icon}>{event.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <Text style={styles.date}>{event.date}</Text>
        <Text style={styles.location} numberOfLines={1}>📍 {event.location}</Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: event.price ? Colors.coral : Colors.success }]}>
            {event.price ? `€${event.price}` : t('free')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg, borderRadius: 18, overflow: 'hidden',
    width: 220, marginRight: 14, flexDirection: 'row',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  colorStrip: { width: 6 },
  body: { flex: 1, padding: 12 },
  icon: { fontSize: 0 },
  title: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  date: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 3 },
  location: { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: '700', fontSize: 13 },
});
