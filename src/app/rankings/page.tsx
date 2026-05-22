import { EntityCard } from "@/components/entity-card";
import { getRankingGroups } from "@/lib/data";

export default async function RankingsPage() {
  const rankings = await getRankingGroups();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Renditje</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Renditjet përdorin pikëzim të ponderuar dhe vetëm vlerësime të
        verifikuara.
      </p>
      <div className="mt-8 grid gap-10">
        <Section title="Më të mirët" entities={rankings.best} />
        <Section title="Më të dobëtit" entities={rankings.worst} />
        <Section title="Më të rekomanduarit" entities={rankings.recommended} />
        <Section title="Për t'u shmangur" entities={rankings.avoid} />
        <Section title="Në përmirësim" entities={rankings.improved} />
        <Section title="Në rënie" entities={rankings.trendingDown} />
        <Section title="Më të vlerësuarit" entities={rankings.mostReviewed} />
      </div>
    </main>
  );
}

function Section({
  title,
  entities,
}: {
  title: string;
  entities: Awaited<ReturnType<typeof getRankingGroups>>["best"];
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {entities.slice(0, 4).map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </section>
  );
}
