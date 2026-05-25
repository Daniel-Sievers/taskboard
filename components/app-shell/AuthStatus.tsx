"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AuthStatus() {
  const { user, isLoading, isSupabaseConfigured } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <Link href="/login" className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-200 hover:bg-amber-400/15">
        Demo-Modus
      </Link>
    );
  }

  if (isLoading) {
    return (
      <span className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-400">
        <Loader2 className="inline h-4 w-4 animate-spin" />
      </span>
    );
  }

  if (user) {
    return (
      <Link href="/login" className="hidden max-w-44 items-center gap-2 truncate rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-400/15 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="truncate">{user.email}</span>
      </Link>
    );
  }

  return (
    <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.07]">
      <LogIn className="h-4 w-4" /> Login
    </Link>
  );
}
