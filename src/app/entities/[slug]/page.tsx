import Link from "next/link";
import { BadgeCheck, Flag, PencilLine } from "lucide-react";
import { FirebaseEntityFallback } from "@/components/firebase-entity-fallback";
import { LocationRatingGate } from "@/components/location-rating-gate";
import { MapPlaceholder } from "@/components/map-placeholder";
import { ScoreBadge } from "@/components/score-badge";
import { getEntityBySlug, getRatingsForEntity } from "@/lib/data";
import { entityTypeLabels, universalRatingCategories } from "@/lib/types";
import { percentage } from "@/lib/utils";

export default async function EntityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = await getEntityBySlug(slug);
  if (!entity) return <FirebaseEntityFallback slug={slug} />;

  const ratings = await getRatingsForEntity(entity.id);

  return (
    <main>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-stone-100 px-2 py-1 text-sm font-medium">
                {entityTypeLabels[entity.type]}
              </span>
              {entity.claim_status === "approved" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700">
                  <BadgeCheck size={15} />
                  Faqe e pretenduar
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              {entity.name}
            </h1>
            <p className="mt-2 text-stone-600">
              {entity.address ? `${entity.address}, ` : ""}
              {entity.city}, {entity.country}
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
              {entity.ai_description ?? entity.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/rate/${entity.id}`}
                className="rounded-md bg-[#c91f37] px-4 py-3 text-sm font-semibold text-white"
              >
                Vlerëso këtë vend
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md border border-stone-200 px-4 py-3 text-sm font-semibold">
                <PencilLine size={16} />
                Sugjero ndryshim
              </button>
              <button className="rounded-md border border-stone-200 px-4 py-3 text-sm font-semibold">
                Pretendo këtë faqe
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            <ScoreBadge score={entity.weighted_score} />
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Vlerësime" value={entity.total_ratings.toString()} />
              <Metric label="Rekomandojnë" value={percentage(entity.recommend_percent)} />
              <Metric label="Do ktheheshin" value={percentage(entity.return_percent)} />
              <Metric label="Indeksi besimit" value={percentage(entity.trust_index)} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-8">
          <MapPlaceholder name={entity.name} lat={entity.lat} lng={entity.lng} />
          <section>
            <h2 className="text-xl font-semibold">Përmbledhje AI</h2>
            <p className="mt-3 rounded-lg border border-stone-200 bg-white p-4 leading-7 text-stone-700">
              {entity.ai_description ??
                "Përmbledhja AI do të krijohet pasi vendi të ketë mjaft vlerësime të verifikuara."}
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Ndarja e vlerësimit</h2>
            <div className="mt-4 grid gap-2">
              {universalRatingCategories.map((category, index) => (
                <div
                  key={category.key}
                  className="grid grid-cols-[150px_1fr_40px] items-center gap-3 rounded-md border border-stone-200 bg-white p-3 text-sm"
                >
                  <span>{category.labelSq}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <span
                      className="block h-full rounded-full bg-[#c91f37]"
                      style={{
                        width: `${Math.max(
                          14,
                          (entity.weighted_score / 5) * 100 - index * 3,
                        )}%`,
                      }}
                    />
                  </span>
                  <span className="font-semibold">
                    {Math.max(1, entity.weighted_score - index * 0.08).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Vlerësimet e fundit</h2>
            <div className="mt-4 grid gap-3">
              {ratings.length ? (
                ratings.map((rating) => (
                  <article
                    key={rating.id}
                    className="rounded-lg border border-stone-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <ScoreBadge score={rating.overall} label="/5" compact />
                      <button className="inline-flex items-center gap-1 text-sm text-stone-500">
                        <Flag size={14} />
                        Raporto
                      </button>
                    </div>
                    <p className="mt-3 leading-7 text-stone-700">
                      {rating.comment}
                    </p>
                    <p className="mt-2 text-xs font-medium text-emerald-700">
                      Ky vlerësim u verifikua me vendndodhje.
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-stone-200 bg-white p-4 text-stone-600">
                  Ende nuk ka vlerësime publike.
                </p>
              )}
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-xl font-semibold">Vlerëso</h2>
          <div className="mt-4">
            <LocationRatingGate entity={entity} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="text-xs font-medium uppercase text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
