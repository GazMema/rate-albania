import { EntityCard } from "@/components/entity-card";
import { getEntities } from "@/lib/data";
import { entityTypeLabels, type EntityType } from "@/lib/types";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ type: EntityType }>;
}) {
  const { type } = await params;
  const entities = await getEntities({ type });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        {entityTypeLabels[type] ?? "Kategori"}
      </h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </main>
  );
}
