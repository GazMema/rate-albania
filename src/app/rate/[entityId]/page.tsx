import Link from "next/link";
import { notFound } from "next/navigation";
import { LocationRatingGate } from "@/components/location-rating-gate";
import { getEntityById } from "@/lib/data";

export default async function RatePage({
  params,
}: {
  params: Promise<{ entityId: string }>;
}) {
  const { entityId } = await params;
  const entity = await getEntityById(entityId);
  if (!entity) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/entities/${entity.slug}`}
        className="text-sm font-semibold text-[#9f1730]"
      >
        Kthehu te profili
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Vlerëso {entity.name}
      </h1>
      <p className="mt-2 text-stone-600">
        Duhet të jesh pranë këtij vendi për ta vlerësuar.
      </p>
      <div className="mt-6">
        <LocationRatingGate entity={entity} />
      </div>
    </main>
  );
}
