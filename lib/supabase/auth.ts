import { supabase } from "./client";

function getRedirectUrl(path = "/board") {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${path}`;
}

export async function signInWithMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getRedirectUrl("/board")
    }
  });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getRedirectUrl("/board")
    }
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
