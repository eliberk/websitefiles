import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — safe to use in browser / client-side reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — service role, server-side only (never expose to browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
