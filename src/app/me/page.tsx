import Link from "next/link";

export default function MePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Profili im</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <LinkCard href="/me/ratings" label="Vlerësimet e mia" />
        <LinkCard href="/me/entities" label="Vendet që krijova" />
        <LinkCard href="/me/claims" label="Kërkesat e pretendimit" />
      </div>
    </main>
  );
}

function LinkCard({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-stone-200 bg-white p-4 font-semibold shadow-sm"
    >
      {label}
    </Link>
  );
}
