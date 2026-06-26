import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

interface Props {
  id: string;
  icon: string;
  color: string;
  bgColor: string;
  onPress?: () => void;
}

export default function CategoryCard({ id, icon, color, bgColor, onPress }: Props) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bgColor }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.label, { color }]} numberOfLines={2}>
        {t(`cat_${id}`)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 90, borderRadius: 16, padding: 12, alignItems: 'center',
    marginRight: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  iconWrap: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 24 },
  label: { fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 15 },
});
