import { supabase } from './supabase';

export async function getHiddenMenuItems(): Promise<Set<string>> {
  try {
    const { data } = await supabase
      .from('menu_config')
      .select('id')
      .eq('visible', false);
    return new Set((data ?? []).map((r: { id: string }) => r.id));
  } catch {
    return new Set();
  }
}

export async function setMenuItemVisible(id: string, visible: boolean): Promise<void> {
  await supabase
    .from('menu_config')
    .upsert({ id, visible, updated_at: new Date().toISOString() }, { onConflict: 'id' });
}

export async function getAllMenuVisibility(): Promise<Record<string, boolean>> {
  try {
    const { data } = await supabase
      .from('menu_config')
      .select('id, visible');
    const result: Record<string, boolean> = {};
    (data ?? []).forEach((r: { id: string; visible: boolean }) => {
      result[r.id] = r.visible;
    });
    return result;
  } catch {
    return {};
  }
}
