import { scoreTone } from "@/lib/scoring";
import { cn } from "@/lib/utils";

export function ScoreBadge({
  score,
  label = "Vlerësimi",
  compact = false,
}: {
  score: number;
  label?: string;
  compact?: boolean;
}) {
  const tone = scoreTone(score);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2",
        tone === "good" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "warn" && "border-amber-200 bg-amber-50 text-amber-800",
        tone === "bad" && "border-red-200 bg-red-50 text-red-800",
        tone === "empty" && "border-stone-200 bg-stone-50 text-stone-600",
      )}
    >
      <span className={cn("font-semibold", compact ? "text-lg" : "text-2xl")}>
        {score > 0 ? score.toFixed(1) : "-"}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
