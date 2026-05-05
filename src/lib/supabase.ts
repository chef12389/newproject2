import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function assertSupabaseConfigured() {
  if (!supabase) {
    throw new Error('Supabase 尚未配置。请先在环境变量中填写 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。')
  }

  return supabase
}
