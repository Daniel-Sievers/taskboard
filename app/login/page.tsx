import { Suspense } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { ShieldCheck } from "lucide-react";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/25">
          <p className="text-sm text-zinc-400">Login wird geladen ...</p>
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/25">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-300">Login</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Supabase Auth vorbereiten</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Diese Seite ist schon als UI vorbereitet. Im nächsten Backend-Schritt schließen wir Magic Link oder Google Login an Supabase an.
          </p>

          <LoginForm />
        </section>

        <section className="rounded-[2rem] border border-emerald-400/15 bg-emerald-400/5 p-6 shadow-2xl shadow-black/25">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 text-emerald-300" />
            <div>
              <h2 className="text-xl font-semibold text-emerald-50">Sicherheitsplan</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-100/70">
                <li>• App ist öffentlich erreichbar, aber Boarddaten nur nach Login.</li>
                <li>• Supabase Row Level Security schützt Tasks pro User.</li>
                <li>• Sensible Tasks bekommen später clientseitige Verschlüsselung.</li>
                <li>• Keine geheimen Keys ins GitHub-Repo committen.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}