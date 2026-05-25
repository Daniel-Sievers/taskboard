import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClientKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isPlaceholder(value: string | undefined) {
  if (!value) return true;
  return (
    value.includes("your-project") ||
    value.includes("your-supabase") ||
    value.includes("your-publishable") ||
    value.includes("your-anon")
  );
}

export const isSupabaseConfigured = Boolean(
  !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseClientKey)
);

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are missing. The app runs in demo mode.");
}

export const supabase = createClient(
  supabaseUrl ?? "https://your-supabase-project-url.supabase.co",
  supabaseClientKey ?? "your-supabase-anon-key"
);
