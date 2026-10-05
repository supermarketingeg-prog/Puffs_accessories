export function Logo({
  className,
  markClassName,
  light: _light = false,
}: {
  className?: string;
  markClassName?: string;
  light?: boolean;
}) {
  return (
    <span className={className}>
      <img
        src="/brand/puffs-logo.jpg"
        alt="Puffs Women Accessories"
        className={markClassName ?? "h-11 w-auto max-w-[132px] object-contain"}
      />
    </span>
  );
}
