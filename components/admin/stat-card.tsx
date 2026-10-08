import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone: "primary" | "secondary"
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border p-5 transition-all duration-300",
        tone === "primary"
          ? "border-primary/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]"
          : "border-secondary/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <Icon
          className={cn("w-5 h-5", tone === "primary" ? "text-primary" : "text-secondary")}
          aria-hidden="true"
        />
      </div>
      <dd
        className={cn(
          "mt-3 text-3xl font-bold tabular-nums",
          tone === "primary"
            ? "text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]"
            : "text-secondary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]",
        )}
      >
        {value}
      </dd>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
