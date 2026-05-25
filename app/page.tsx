import Link from "next/link";
import { ArrowRight, Database, Code2, Lock, Moon, Wifi } from "lucide-react";

const features = [
  { title: "Tageslisten", text: "Hauptansicht wie TasksBoard: heute, morgen, kommende Tage.", icon: Moon },
  { title: "Supabase-ready", text: "Datenbank, Auth und Sync sind als nächster Schritt vorbereitet.", icon: Database },
  { title: "Privat gedacht", text: "Login, RLS und später optionale Verschlüsselung einzelner Tasks.", icon: Lock },
  { title: "Offline geplant", text: "Später mit IndexedDB, Sync-Queue und Last-write-wins.", icon: Wifi }
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-zinc-100">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-300">
            Private Taskboard
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Dein eigenes synchronisiertes Taskboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Tageslisten, Dark Mode, Login, Supabase-Sync und später Offline-Modus. Gebaut als persönliche Alternative zu TasksBoard und als sauberes GitHub-Projekt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/board"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400"
            >
              Board öffnen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-medium text-zinc-200 hover:bg-white/[0.07]"
            >
              Login ansehen
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 ring-1 ring-white/[0.03]">
          <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/80 p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-300">Preview</p>
                <h2 className="mt-1 text-xl font-semibold">Hauptboard</h2>
              </div>
              <Code2 className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="space-y-3">
              {["Brave aufräumen", "Wasserhahn wechseln", "Supabase-Projekt erstellen"].map((task) => (
                <div key={task} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="h-4 w-4 rounded-full border border-zinc-600" />
                  <span className="text-sm text-zinc-200">{task}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <Icon className="h-5 w-5 text-blue-300" />
                  <h3 className="mt-3 font-medium">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
