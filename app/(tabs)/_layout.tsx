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
      <Tabs.Screen
        name="index"
        options={{ title: t('home'), tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: t('categories'), tabBarIcon: ({ focused }) => <TabIcon icon="🗂️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: t('events'), tabBarIcon: ({ focused }) => <TabIcon icon="🎉" focused={focused} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: t('map'), tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" focused={focused} /> }}
      />
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
      <Tabs.Screen
        name="profile"
        options={{ title: t('profile'), tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} /> }}
      />
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
  iconWrapEmergency: { backgroundColor: '#C0392B18' },
  icon: { fontSize: 20, opacity: 0.5 },
  iconActive: { opacity: 1 },
});
