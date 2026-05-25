import { Suspense } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { BoardView } from "@/components/board/BoardView";

function BoardFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
          <p className="text-sm text-zinc-400">Taskboard wird geladen ...</p>
        </div>
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={<BoardFallback />}>
      <AppShell>
        <BoardView />
      </AppShell>
    </Suspense>
  );
}