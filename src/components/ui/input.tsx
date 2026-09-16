import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-full border border-cream/12 bg-ink/50 px-4 text-sm text-cream placeholder:text-cream/40 outline-none ring-gold/0 transition focus:border-gold/40 focus:ring-2 focus:ring-gold/30",
        className,
      )}
      {...props}
    />
  );
}
