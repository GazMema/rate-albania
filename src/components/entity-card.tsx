import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import type { Entity } from "@/lib/types";
import { entityTypeLabels } from "@/lib/types";
import { percentage } from "@/lib/utils";
import { ScoreBadge } from "@/components/score-badge";

export function EntityCard({ entity }: { entity: Entity }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-700">
              {entityTypeLabels[entity.type]}
            </span>
            {entity.claim_status === "approved" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                <BadgeCheck size={13} />
                e pretenduar
              </span>
            ) : null}
          </div>
          <Link
            href={`/entities/${entity.slug}`}
            className="mt-3 block text-lg font-semibold tracking-tight text-stone-950 hover:text-[#c91f37]"
          >
            {entity.name}
          </Link>
          <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
            <MapPin size={14} />
            {entity.address ? `${entity.address}, ` : ""}
            {entity.city}
          </p>
        </div>
        <ScoreBadge score={entity.weighted_score} label="/5" compact />
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-600">
        {entity.ai_description ?? entity.description}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Metric label="Vlerësime" value={entity.total_ratings.toString()} />
        <Metric label="Rekomandojnë" value={percentage(entity.recommend_percent)} />
        <Metric label="Besim" value={percentage(entity.trust_index)} />
      </div>
      <Link
        href={`/entities/${entity.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#9f1730]"
      >
        Shiko profilin
        <ArrowUpRight size={15} />
      </Link>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-stone-50 p-2">
      <div className="text-xs text-stone-500">{label}</div>
      <div className="font-semibold text-stone-950">{value}</div>
    </div>
  );
}
