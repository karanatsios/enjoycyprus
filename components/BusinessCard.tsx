import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/colors';

export interface Business {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  rating: number;
  reviewCount: number;
  address: string;
  isOpen: boolean;
  image: string;
  featured?: boolean;
}

interface Props {
  business: Business;
  onPress?: () => void;
  horizontal?: boolean;
}

export default function BusinessCard({ business, onPress, horizontal }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, horizontal && styles.cardH]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={[styles.imageWrap, horizontal && styles.imageWrapH]}>
        <View style={[styles.imagePlaceholder, { backgroundColor: Colors.primaryLight + '33' }]}>
          <Text style={styles.imagePlaceholderIcon}>{business.categoryIcon}</Text>
        </View>
        {business.featured && (
          <View style={styles.badge}><Text style={styles.badgeText}>★ TOP</Text></View>
        )}
        <View style={[styles.openBadge, { backgroundColor: business.isOpen ? Colors.success : '#FF6B6B' }]}>
          <Text style={styles.openText}>{business.isOpen ? '●' : '●'}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.address} numberOfLines={1}>{business.address}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{business.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({business.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg, borderRadius: 18, overflow: 'hidden',
    width: 180, marginRight: 14,
    shadowColor: '#0077B6', shadowOpacity: 0.1, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  cardH: { flexDirection: 'row', width: '100%', marginRight: 0, marginBottom: 12 },
  imageWrap: { height: 110, position: 'relative' },
  imageWrapH: { height: 'auto', width: 80 },
  imagePlaceholder: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    minHeight: 80,
  },
  imagePlaceholderIcon: { fontSize: 36 },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: Colors.gold, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  openBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center',
  },
  openText: { color: '#fff', fontSize: 8 },
  info: { padding: 10, flex: 1 },
  name: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  address: { fontSize: 11, color: Colors.textMuted, marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { color: Colors.gold, fontSize: 12 },
  rating: { fontSize: 12, fontWeight: '700', color: Colors.text },
  reviews: { fontSize: 11, color: Colors.textMuted },
});
