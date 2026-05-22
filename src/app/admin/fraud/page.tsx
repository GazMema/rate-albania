export default function AdminFraudPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Suspicious activity
      </h1>
      <p className="mt-3 rounded-lg border border-stone-200 bg-white p-4 text-stone-600">
        Tracks deviceEntityRatings, fraud_score, App Check signals and rating
        velocity. Use this area for bans, manual review and audit logs.
      </p>
    </main>
  );
}
