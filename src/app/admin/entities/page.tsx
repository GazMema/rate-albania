import { EntityCard } from "@/components/entity-card";
import { getEntities } from "@/lib/data";

export default async function AdminEntitiesPage() {
  const entities = await getEntities({ limit: 50 });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Manage entities</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </main>
  );
}
