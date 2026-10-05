import { cn } from "@/lib/utils";

export function Logo({
  className,
  markClassName,
  light = false,
}: {
  className?: string;
  markClassName?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/images/emblem.jpg"
        alt=""
        className={cn("size-9 rounded-full object-cover ring-1 ring-border", markClassName)}
      />
      <span className={cn("wordmark text-[15px] leading-none", light ? "text-primary-fg" : "text-fg")}>
        Puffs
      </span>
    </span>
  );
}
