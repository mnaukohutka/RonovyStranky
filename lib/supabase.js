import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Vytvoření Supabase klienta
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    // Volitelné: výchozí nastavení
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
