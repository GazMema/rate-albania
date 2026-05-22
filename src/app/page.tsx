import Link from "next/link";
import { ArrowRight, LocateFixed, ShieldCheck, TrendingDown } from "lucide-react";
import { EntityCard } from "@/components/entity-card";
import { SearchBox } from "@/components/search-box";
import { getRankingGroups } from "@/lib/data";

export default async function Home() {
  const rankings = await getRankingGroups();

  return (
    <main>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-[#9f1730]">
              <ShieldCheck size={17} />
              Vlerësime të verifikuara me vendndodhje
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              Vlerëso vendet ku shkon.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
              Ndihmo të tjerët të dinë çfarë të presin nga biznese,
              institucione, spitale, shkolla, banka dhe shërbime në Shqipëri.
            </p>
            <div className="mt-8">
              <SearchBox />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {["Bashkia Tiranë", "spital pranë meje", "BKT Durrës", "restorant në Shkodër"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-md border border-stone-200 px-3 py-2 text-stone-700 hover:bg-stone-50"
                  >
                    {term}
                  </Link>
                ),
              )}
            </div>
          </div>
          <div className="rounded-lg border border-stone-200 bg-[#fbfbf9] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Pulsi kombëtar</h2>
              <Link
                href="/rankings"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#9f1730]"
              >
                Renditjet
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              <Pulse
                icon={<LocateFixed size={18} />}
                label="Më të mirët"
                value={rankings.best[0]?.name ?? "Së shpejti"}
              />
              <Pulse
                icon={<TrendingDown size={18} />}
                label="Për t'u shmangur"
                value={rankings.avoid[0]?.name ?? "Së shpejti"}
              />
              <Pulse
                icon={<ShieldCheck size={18} />}
                label="Qytetarët rekomandojnë"
                value={rankings.recommended[0]?.name ?? "Së shpejti"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#9f1730]">Pranë meje</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Vende që po dallohen
            </h2>
          </div>
          <Link
            href="/create"
            className="rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Krijo vend të ri
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rankings.best.slice(0, 6).map((entity) => (
            <EntityCard key={entity.id} entity={entity} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Pulse({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-stone-200 bg-white p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-100 text-stone-700">
        {icon}
      </span>
      <div>
        <div className="text-xs font-medium uppercase text-stone-500">
          {label}
        </div>
        <div className="font-semibold text-stone-950">{value}</div>
      </div>
    </div>
  );
}
