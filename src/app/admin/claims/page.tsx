export default function AdminClaimsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Review claims</h1>
      <p className="mt-3 rounded-lg border border-stone-200 bg-white p-4 text-stone-600">
        Firebase collection: entityClaims. Admins approve official email,
        website, social proof or manual verification.
      </p>
    </main>
  );
}
