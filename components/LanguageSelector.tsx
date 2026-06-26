import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';
import { Colors } from '../constants/colors';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.flag}>{current.flag}</Text>
        <Text style={styles.code}>{current.code.toUpperCase()}</Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.title}>{t('selectLanguage')}</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.row, item.code === i18n.language && styles.rowActive]}
                  onPress={() => { i18n.changeLanguage(item.code); setVisible(false); }}
                >
                  <Text style={styles.rowFlag}>{item.flag}</Text>
                  <Text style={[styles.rowLabel, item.code === i18n.language && styles.rowLabelActive]}>
                    {item.label}
                  </Text>
                  {item.code === i18n.language && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  flag: { fontSize: 16 },
  code: { color: '#fff', fontWeight: '700', fontSize: 12 },
  arrow: { color: '#fff', fontSize: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  sheet: {
    backgroundColor: '#fff', borderRadius: 20, paddingVertical: 20,
    width: 280, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  title: { textAlign: 'center', fontWeight: '700', fontSize: 16, color: Colors.text, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  rowActive: { backgroundColor: Colors.background },
  rowFlag: { fontSize: 22 },
  rowLabel: { flex: 1, fontSize: 15, color: Colors.text },
  rowLabelActive: { color: Colors.primary, fontWeight: '700' },
  check: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
});
