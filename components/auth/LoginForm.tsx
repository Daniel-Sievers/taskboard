"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Code2, Loader2, LogOut, Mail, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signInWithGoogle, signInWithMagicLink, signOut } from "@/lib/supabase/auth";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const { user, isLoading, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Magic Link wurde gesendet. Öffne die Mail und bestätige den Login.");
  }

  async function handleGoogleLogin() {
    setStatus("loading");
    setMessage(null);

    const { error } = await signInWithGoogle();

    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  async function handleSignOut() {
    setStatus("loading");
    await signOut();
    setStatus("idle");
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100/80">
        <div className="mb-3 flex items-center gap-2 font-medium text-amber-100">
          <TriangleAlert className="h-4 w-4" /> Supabase ist noch nicht verbunden
        </div>
        Trage zuerst deine Werte in <code className="rounded bg-black/30 px-1.5 py-0.5">.env.local</code> ein:
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/30 p-3 text-xs text-amber-50/90">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
        </pre>
        Danach den Dev-Server mit <code className="rounded bg-black/30 px-1.5 py-0.5">Strg + C</code> stoppen und mit <code className="rounded bg-black/30 px-1.5 py-0.5">npm run dev</code> neu starten.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Loginstatus wird geprüft …
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
          <div>
            <p className="font-medium text-emerald-50">Du bist eingeloggt.</p>
            <p className="mt-1 text-sm text-emerald-100/70">{user.email}</p>
          </div>
        </div>
        <Button type="button" variant="secondary" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Ausloggen
        </Button>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleMagicLink}>
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="deine@email.de"
        required
      />
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Magic Link senden
      </Button>
      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleLogin} disabled={status === "loading"}>
        <Code2 className="h-4 w-4" /> Mit Google einloggen
      </Button>
      {message ? (
        <p className={status === "error" ? "rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100" : "rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
