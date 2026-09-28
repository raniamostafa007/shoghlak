import { createClient } from '@supabase/supabase-js';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kzoomqtivzxovrtfdfwx.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'missing-key';

const inBrowser = typeof window !== 'undefined';

export const supabase = createClient(url, key, {
  auth: { persistSession: inBrowser, autoRefreshToken: inBrowser },
});
