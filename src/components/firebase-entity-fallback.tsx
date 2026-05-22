"use client";

import { useEffect, useState } from "react";
import { EntityCard } from "@/components/entity-card";
import { fetchFirestoreEntityBySlug } from "@/lib/firebase/firestore";
import { hasFirebaseEnv } from "@/lib/firebase/client";
import type { Entity } from "@/lib/types";

export function FirebaseEntityFallback({ slug }: { slug: string }) {
  const firebaseAvailable = hasFirebaseEnv();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loaded, setLoaded] = useState(!firebaseAvailable);

  useEffect(() => {
    if (!firebaseAvailable) return;

    fetchFirestoreEntityBySlug(slug)
      .then(setEntity)
      .finally(() => setLoaded(true));
  }, [firebaseAvailable, slug]);

  if (!loaded) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="rounded-lg border border-stone-200 bg-white p-4">
          Po ngarkohet nga Firebase...
        </p>
      </main>
    );
  }

  if (!entity) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Nuk u gjet</h1>
        <p className="mt-2 text-stone-600">
          Ky vend nuk ekziston ende ose nuk është aktiv.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <EntityCard entity={entity} />
      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Ky vend u lexua nga Firebase. Pamja e plotë server-side mund të lidhet
        më vonë me Firebase Admin SDK ose Cloud Functions.
      </p>
    </main>
  );
}
