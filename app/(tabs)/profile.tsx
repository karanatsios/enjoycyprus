import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { LANGUAGES } from '../../i18n';
import LanguageSelector from '../../components/LanguageSelector';

const MENU_ITEMS = [
  { icon: '🏢', key: 'addBusiness' },
  { icon: '⚙️', key: 'settings' },
  { icon: '🌐', key: 'language' },
];

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
        <LanguageSelector />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Login Banner */}
        <TouchableOpacity style={styles.loginBanner} activeOpacity={0.85}>
          <Text style={styles.loginAvatar}>👤</Text>
          <View style={styles.loginText}>
            <Text style={styles.loginTitle}>{t('loginRegister')}</Text>
            <Text style={styles.loginSub}>Profil erstellen & Unternehmen verwalten</Text>
          </View>
          <Text style={styles.loginArrow}>→</Text>
        </TouchableOpacity>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('selectLanguage')}</Text>
          <View style={styles.langGrid}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langChip, i18n.language === lang.code && styles.langChipActive]}
                onPress={() => i18n.changeLanguage(lang.code)}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langLabel, i18n.language === lang.code && styles.langLabelActive]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          {MENU_ITEMS.map(item => (
            <TouchableOpacity key={item.key} style={styles.menuRow} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{t(item.key)}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>🇨🇾 EnjoyСyprus</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
  scroll: { flex: 1 },

  loginBanner: {
    margin: 20, backgroundColor: Colors.primaryDark, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14,
  },
  loginAvatar: { fontSize: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 22, padding: 6 },
  loginText: { flex: 1 },
  loginTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  loginSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 },
  loginArrow: { color: '#fff', fontSize: 22 },

  section: {
    backgroundColor: Colors.cardBg, marginHorizontal: 20, marginBottom: 16,
    borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },

  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14,
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border,
  },
  langChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  langFlag: { fontSize: 18 },
  langLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
  langLabelActive: { color: '#fff' },

  menuRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 14,
  },
  menuIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '500' },
  menuArrow: { fontSize: 20, color: Colors.textMuted },

  appInfo: { alignItems: 'center', paddingVertical: 24 },
  appName: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  appVersion: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
});
