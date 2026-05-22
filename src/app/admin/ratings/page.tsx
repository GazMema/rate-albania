export default function AdminRatingsPage() {
  return <AdminStub title="Moderate ratings" />;
}

function AdminStub({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 rounded-lg border border-stone-200 bg-white p-4 text-stone-600">
        Firebase collection: ratings. Admins can approve, reject, flag and
        trigger score recalculation from Cloud Functions.
      </p>
    </main>
  );
}
