const appConfig = window.__APP_CONFIG__ || {};

export const SUPABASE_URL = appConfig.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = appConfig.SUPABASE_ANON_KEY || "";

export function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
