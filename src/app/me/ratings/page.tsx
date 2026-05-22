export default function MyRatingsPage() {
  return <UserStub title="Vlerësimet e mia" />;
}

function UserStub({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 rounded-lg border border-stone-200 bg-white p-4 text-stone-600">
        Kjo faqe do të lexojë dokumentet nga ratings ku user_id është përdoruesi
        aktual.
      </p>
    </main>
  );
}
