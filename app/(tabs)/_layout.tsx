import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icon}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabBarInactive,
      }}
    >
      {/* 1 – Start */}
      <Tabs.Screen
        name="index"
        options={{ title: t('home'), tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }}
      />

      {/* 2 – Events */}
      <Tabs.Screen
        name="events"
        options={{ title: t('events'), tabBarIcon: ({ focused }) => <TabIcon icon="🎉" focused={focused} /> }}
      />

      {/* 3 – Community (grünes Oval, nur Text, kein Icon) */}
      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View style={styles.communityOval}>
              <Text style={styles.communityText}>Community</Text>
            </View>
          ),
        }}
      />

      {/* 4 – Notfall */}
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Notfall',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapEmergency]}>
              <Text style={[styles.icon, { opacity: 1 }]}>🚨</Text>
            </View>
          ),
          tabBarActiveTintColor: '#C0392B',
        }}
      />

      {/* 5 – Bus (orange) */}
      <Tabs.Screen
        name="bus"
        options={{
          title: 'Bus',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapBus]}>
              <Text style={[styles.icon, { opacity: 1 }]}>🚌</Text>
            </View>
          ),
          tabBarActiveTintColor: '#D4891A',
        }}
      />

      {/* hidden – erreichbar über Hamburger-Menü */}
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="submit" options={{ href: null }} />
      <Tabs.Screen name="map" options={{ href: null }} />
      <Tabs.Screen name="weather" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="mein-eintrag" options={{ href: null }} />
      <Tabs.Screen name="partner" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="planner" options={{ href: null }} />
      <Tabs.Screen name="beachbox" options={{ href: null }} />
      <Tabs.Screen name="news" options={{ href: null }} />
      <Tabs.Screen name="faq" options={{ href: null }} />
      <Tabs.Screen name="marketing" options={{ href: null }} />
      <Tabs.Screen name="jobs" options={{ href: null }} />
      <Tabs.Screen name="hospitals" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar, borderTopWidth: 0,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 }, elevation: 12,
    height: 70, paddingBottom: 10,
  },
  label: { fontSize: 10, fontWeight: '600' },
  iconWrap: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  iconWrapActive: { backgroundColor: Colors.primary + '18' },

  communityOval: {
    backgroundColor: '#27AE60',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  communityText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  iconWrapBus: { backgroundColor: '#F5A62318' },
  iconWrapEmergency: { backgroundColor: '#C0392B18' },
  icon: { fontSize: 20, opacity: 0.5 },
  iconActive: { opacity: 1 },
});
