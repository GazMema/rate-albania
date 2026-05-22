import { EntityCard } from "@/components/entity-card";
import { SearchBox } from "@/components/search-box";
import { getEntities } from "@/lib/data";
import { entityTypeLabels, entityTypes } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = String(params.q ?? "");
  const city = String(params.city ?? "");
  const type = String(params.type ?? "");
  const sort = String(params.sort ?? "best");
  const entities = await getEntities({ query: q, city, type, sort });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Kërko</h1>
        <p className="mt-2 text-stone-600">
          Gjej biznese, institucione dhe shërbime publike në Shqipëri.
        </p>
      </div>
      <div className="mt-6">
        <SearchBox defaultQuery={q} defaultCity={city} />
      </div>
      <form className="mt-4 flex flex-wrap gap-2">
        <input type="hidden" name="q" value={q} />
        <input type="hidden" name="city" value={city} />
        <select
          name="type"
          defaultValue={type}
          className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">Të gjitha kategoritë</option>
          {entityTypes.map((item) => (
            <option key={item} value={item}>
              {entityTypeLabels[item]}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
        >
          <option value="best">Më të mirët</option>
          <option value="worst">Më të dobëtit</option>
          <option value="most_reviewed">Më të vlerësuarit</option>
          <option value="recommended">Më të rekomanduarit</option>
          <option value="avoid">Për t&apos;u shmangur</option>
          <option value="improved">Në përmirësim</option>
          <option value="trending">Trending</option>
        </select>
        <button className="rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
          Filtro
        </button>
      </form>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </main>
  );
}
