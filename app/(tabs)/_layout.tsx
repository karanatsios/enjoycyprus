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

const COMMUNITY_GREEN = '#27AE60';

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

      {/* Categories – hidden from tab bar, still navigable */}
      <Tabs.Screen
        name="categories"
        options={{ href: null }}
      />

      {/* 2 – Events */}
      <Tabs.Screen
        name="events"
        options={{ title: t('events'), tabBarIcon: ({ focused }) => <TabIcon icon="🎉" focused={focused} /> }}
      />

      {/* 3 – Eintragen (+) */}
      <Tabs.Screen
        name="submit"
        options={{
          title: 'Eintragen',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.plusCircle, focused && styles.plusCircleActive]}>
              <Text style={[styles.plusSign, focused && styles.plusSignActive]}>+</Text>
            </View>
          ),
          tabBarActiveTintColor: Colors.primary,
        }}
      />

      {/* 4 – Community (Mitte, grün) */}
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.communityBtn, focused && styles.communityBtnActive]}>
              <Text style={styles.communityIcon}>👥</Text>
            </View>
          ),
          tabBarActiveTintColor: COMMUNITY_GREEN,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '800', color: COMMUNITY_GREEN },
        }}
      />

      {/* 5 – Notfall */}
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

      {/* 6 – Bus (orange) */}
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

      {/* hidden tabs – accessible via navigation, not tab bar */}
      <Tabs.Screen name="map" options={{ href: null }} />
      <Tabs.Screen name="weather" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
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

  plusCircle: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
  },
  plusCircleActive: { borderColor: Colors.primary },
  plusSign: { fontSize: 20, color: '#ccc', fontWeight: '300', lineHeight: 24 },
  plusSignActive: { color: Colors.primary },

  communityBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: '#27AE6022',
    justifyContent: 'center', alignItems: 'center',
  },
  communityBtnActive: {
    backgroundColor: '#27AE60',
  },
  communityIcon: { fontSize: 20 },

  iconWrapBus: { backgroundColor: '#F5A62318' },
  iconWrapEmergency: { backgroundColor: '#C0392B18' },
  icon: { fontSize: 20, opacity: 0.5 },
  iconActive: { opacity: 1 },
});
