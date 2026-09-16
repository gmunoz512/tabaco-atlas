import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-cream text-ink hover:bg-white",
        ghost: "bg-white/5 text-cream hover:bg-white/10",
        outline: "border border-cream/15 bg-panel/70 text-cream hover:bg-white/10",
        gold: "bg-gold text-ink hover:bg-gold-bright",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
