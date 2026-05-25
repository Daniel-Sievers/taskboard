export function AppIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-zinc-950 shadow-lg shadow-blue-500/20 ring-1 ring-white/10 ${className}`}>
      <img
        src="/icons/icon-192.png"
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}
