import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-opacity duration-[var(--motion-quick,150ms)] disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-90",
        outline: "border border-border bg-bg-elevated text-fg hover:bg-surface",
        ghost: "text-fg hover:bg-surface",
        danger: "bg-danger text-primary-fg hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]",
        md: "h-11 px-5 text-sm rounded-[var(--radius-md)]",
        lg: "h-12 px-6 text-base rounded-[var(--radius-md)]",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
