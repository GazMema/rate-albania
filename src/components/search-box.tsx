import { Search } from "lucide-react";

export function SearchBox({
  defaultQuery = "",
  defaultCity = "",
}: {
  defaultQuery?: string;
  defaultCity?: string;
}) {
  return (
    <form
      action="/search"
      className="grid gap-2 rounded-lg border border-stone-200 bg-white p-2 shadow-sm md:grid-cols-[1fr_180px_auto]"
    >
      <label className="flex items-center gap-2 rounded-md bg-stone-50 px-3 py-2">
        <Search size={18} className="text-stone-500" />
        <input
          name="q"
          defaultValue={defaultQuery}
          placeholder="Kërko biznese, spitale, banka, institucione..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </label>
      <input
        name="city"
        defaultValue={defaultCity}
        placeholder="Qyteti"
        className="rounded-md bg-stone-50 px-3 py-2 text-sm outline-none"
      />
      <button className="focus-ring rounded-md bg-[#c91f37] px-5 py-2 text-sm font-semibold text-white hover:bg-[#a7182d]">
        Kërko
      </button>
    </form>
  );
}
