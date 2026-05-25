import { clsx } from "clsx";

export function Checkbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={clsx(
        "mt-1 h-4 w-4 shrink-0 rounded-full border-zinc-700 bg-zinc-950 accent-blue-500 outline-none focus:ring-2 focus:ring-blue-500/30",
        className
      )}
      {...props}
    />
  );
}
