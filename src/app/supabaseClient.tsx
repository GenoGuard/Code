import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://smpqdiekatekduqcrodh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcHFkaWVrYXRla2R1cWNyb2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzQwNjYsImV4cCI6MjA4NDYxMDA2Nn0.f9ULQpjaf6D9lW7KPMAzb2GrbudDGKPS-gAfujY6OCQ';
// ☝️ Click "Copy" on that first key and paste it here (the full version, not the truncated one shown)

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);