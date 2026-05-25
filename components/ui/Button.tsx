import { clsx } from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
        variant === "primary" &&
          "bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400",
        variant === "secondary" &&
          "border border-zinc-800 bg-zinc-950/80 text-zinc-200 hover:bg-zinc-900",
        variant === "ghost" && "text-zinc-400 hover:bg-zinc-900 hover:text-white",
        variant === "danger" && "bg-red-500/15 text-red-300 hover:bg-red-500/25",
        className
      )}
      {...props}
    />
  );
}
