import { CreateEntityForm } from "@/components/create-entity-form";

export default function CreatePage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Krijo vend të ri
        </h1>
        <p className="mt-3 leading-7 text-stone-600">
          Shto biznese, institucione, degë bankare, shkolla, spitale ose
          shërbime që mungojnë. Për MVP përdorim koordinata manuale; më pas do
          shtohet zgjedhje me hartë.
        </p>
        <div className="mt-5 rounded-lg border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600">
          Për të mbrojtur cilësinë, çdo vend ruan geohash për kërkim pranë
          përdoruesit dhe status fillestar aktiv.
        </div>
      </div>
      <CreateEntityForm />
    </main>
  );
}
