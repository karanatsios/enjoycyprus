import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 Community</Text>
        <Text style={styles.headerSub}>Verbinde dich mit der Cyprus-Community</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.comingSoonIcon}>🌐</Text>
        <Text style={styles.comingSoonTitle}>Community – demnächst</Text>
        <Text style={styles.comingSoonText}>
          Hier wird bald die Inside Cyprus Community eingebettet.{'\n'}
          Tausche dich mit anderen aus, stelle Fragen und bleib auf dem Laufenden.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },

  content: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, gap: 16,
  },
  comingSoonIcon: { fontSize: 56 },
  comingSoonTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  comingSoonText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
});
