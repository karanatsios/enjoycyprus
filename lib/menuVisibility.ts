import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'menu_visibility_v1';

export async function getHiddenMenuItems(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return new Set();
    const obj = JSON.parse(raw) as Record<string, boolean>;
    return new Set(Object.entries(obj).filter(([, v]) => v === false).map(([k]) => k));
  } catch {
    return new Set();
  }
}

export async function setMenuItemVisible(id: string, visible: boolean): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const obj = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    obj[id] = visible;
    await AsyncStorage.setItem(KEY, JSON.stringify(obj));
  } catch {}
}

export async function getAllMenuVisibility(): Promise<Record<string, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}
