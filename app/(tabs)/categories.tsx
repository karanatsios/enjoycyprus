import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';
import LanguageSelector from '../../components/LanguageSelector';

export default function CategoriesScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('categories')}</Text>
        <LanguageSelector />
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: item.bgColor }]} activeOpacity={0.8}>
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={[styles.label, { color: item.color }]}>{t(`cat_${item.id}`)}</Text>
            <Text style={styles.count}>12 Einträge</Text>
          </TouchableOpacity>
        )}
      />
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
  grid: { padding: 16, paddingTop: 20 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1, borderRadius: 20, padding: 18, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  icon: { fontSize: 28 },
  label: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  count: { fontSize: 11, color: Colors.textMuted },
});
