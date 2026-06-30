import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'dark_mode';

export async function getDarkMode(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEY);
  return val === 'true';
}

export async function setDarkMode(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, String(enabled));
}

export const LightColors = {
  primary: '#0077B6',
  primaryLight: '#00B4D8',
  primaryDark: '#023E8A',
  coral: '#FF6B6B',
  gold: '#F4A261',
  goldLight: '#E9C46A',
  sand: '#FFF8F0',
  white: '#FFFFFF',
  background: '#F0F7FF',
  cardBg: '#FFFFFF',
  text: '#1D3557',
  textLight: '#457B9D',
  textMuted: '#6B7280',
  border: '#E2EEF9',
  success: '#2ECC71',
  tabBar: '#FFFFFF',
  tabBarActive: '#0077B6',
  tabBarInactive: '#A8C5DA',
  headerGradientStart: '#0077B6',
  headerGradientEnd: '#00B4D8',
  inputBg: '#FFFFFF',
  sheetBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
};

export const DarkColors = {
  primary: '#00B4D8',
  primaryLight: '#90E0EF',
  primaryDark: '#0077B6',
  coral: '#FF6B6B',
  gold: '#F4A261',
  goldLight: '#E9C46A',
  sand: '#1A2535',
  white: '#FFFFFF',
  background: '#0D1B2A',
  cardBg: '#1A2535',
  text: '#E8F4FD',
  textLight: '#90CAE4',
  textMuted: '#9AA5B1',
  border: '#2A3A4A',
  success: '#2ECC71',
  tabBar: '#111E2D',
  tabBarActive: '#00B4D8',
  tabBarInactive: '#4A6477',
  headerGradientStart: '#023E8A',
  headerGradientEnd: '#0077B6',
  inputBg: '#1A2535',
  sheetBg: '#1A2535',
  overlay: 'rgba(0,0,0,0.6)',
};

export type ThemeColors = typeof LightColors;
