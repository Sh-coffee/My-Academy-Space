import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
let client = null;
let userId = null;
let saveTimer = null;
let lastState = null;
let onStatus = () => {};
let status = { configured: false, connected: false, message: 'Supabase belum dikonfigurasi.' };

function setStatus(next) {
  status = { ...status, ...next };
  onStatus(status);
}
export function cloudStatus() { return { ...status }; }

export async function initializeCloud(statusCallback = () => {}) {
  onStatus = statusCallback;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    setStatus({ configured: false, connected: false, message: 'Mode lokal — isi konfigurasi Supabase untuk sinkronisasi.' });
    return { configured: false, data: null };
  }
  try {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    let { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      const result = await client.auth.signInAnonymously();
      if (result.error) throw result.error;
      sessionData = result.data;
    }
    userId = sessionData.session?.user?.id || sessionData.user?.id;
    if (!userId) throw new Error('Identitas pengguna Supabase tidak tersedia.');

    const { data, error } = await client
      .from('academic_progress')
      .select('state, updated_at')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    setStatus({ configured: true, connected: true, message: 'Cloud tersambung — progress tersinkronisasi.' });
    return { configured: true, data: data?.state || null, userId };
  } catch (error) {
    console.error('Supabase initialization failed:', error);
    setStatus({ configured: true, connected: false, message: `Cloud belum tersambung: ${error.message || 'periksa konfigurasi Supabase'}` });
    return { configured: true, data: null, error };
  }
}

export function scheduleCloudSave(state) {
  if (!client || !userId) return;
  lastState = JSON.parse(JSON.stringify(state));
  clearTimeout(saveTimer);
  setStatus({ message: 'Menyimpan progress ke cloud…' });
  saveTimer = setTimeout(async () => {
    try {
      const { error } = await client.from('academic_progress').upsert({
        user_id: userId,
        state: lastState,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
      setStatus({ configured: true, connected: true, message: 'Cloud tersambung — progress tersimpan.' });
    } catch (error) {
      console.error('Supabase save failed:', error);
      setStatus({ configured: true, connected: false, message: 'Gagal menyimpan ke cloud. Data lokal tetap aman.' });
    }
  }, 700);
}
