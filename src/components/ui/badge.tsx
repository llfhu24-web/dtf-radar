type BadgeVariant = "neutral" | "high" | "medium" | "low";

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const styles: Record<BadgeVariant, string> = {
  neutral: "bg-zinc-100 text-zinc-700",
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-zinc-100 text-zinc-700",
};

export function Badge({ children, variant = "neutral" }: Props) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
