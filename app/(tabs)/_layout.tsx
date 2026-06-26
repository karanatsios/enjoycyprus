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
      <Tabs.Screen
        name="map"
        options={{ title: t('map'), tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Wetter',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapWeather]}>
              <Text style={[styles.icon, { opacity: 1 }]}>🌤️</Text>
            </View>
          ),
          tabBarActiveTintColor: '#1565C0',
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
  plusCircle: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
  },
  plusCircleActive: { borderColor: Colors.primary },
  plusSign: { fontSize: 20, color: '#ccc', fontWeight: '300', lineHeight: 24 },
  plusSignActive: { color: Colors.primary },
  iconWrapBus: { backgroundColor: '#F5A62318' },
  iconWrapWeather: { backgroundColor: '#1565C018' },
  iconWrapEmergency: { backgroundColor: '#C0392B18' },
  icon: { fontSize: 20, opacity: 0.5 },
  iconActive: { opacity: 1 },
});
