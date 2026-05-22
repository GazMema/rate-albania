"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { geohashForLocation } from "geofire-common";
import { getFirebaseAuth, hasFirebaseEnv } from "@/lib/firebase/client";
import { createFirestoreEntity } from "@/lib/firebase/firestore";
import { entityTypeLabels, entityTypes, type EntityType } from "@/lib/types";

export function CreateEntityForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setMessage("");
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") ?? "").trim();
        const city = String(form.get("city") ?? "").trim();
        const type = String(form.get("type") ?? "other") as EntityType;
        const lat = Number(form.get("lat"));
        const lng = Number(form.get("lng"));

        if (!name || !city || Number.isNaN(lat) || Number.isNaN(lng)) {
          setMessage("Plotëso emrin, qytetin, lat dhe lng.");
          return;
        }

        if (!hasFirebaseEnv()) {
          setMessage(
            `Demo: vendi do të krijohej me geohash ${geohashForLocation([
              lat,
              lng,
            ])}. Shto Firebase env për ruajtje reale.`,
          );
          return;
        }

        const user = getFirebaseAuth().currentUser;
        if (!user) {
          setMessage("Hyr me Google para se të krijosh vend.");
          return;
        }

        const savedSlug = await createFirestoreEntity({
          name,
          city,
          type,
          address: String(form.get("address") ?? ""),
          description: String(form.get("description") ?? ""),
          lat,
          lng,
          userId: user.uid,
        });

        router.push(`/entities/${savedSlug}`);
      }}
    >
      <Field name="name" label="Emri" placeholder="Bashkia Tiranë" />
      <label className="grid gap-1 text-sm font-medium">
        Kategoria
        <select
          name="type"
          className="rounded-md border border-stone-200 bg-white px-3 py-2"
          defaultValue="other"
        >
          {entityTypes.map((item) => (
            <option key={item} value={item}>
              {entityTypeLabels[item]}
            </option>
          ))}
        </select>
      </label>
      <Field name="address" label="Adresa" placeholder="Rruga, lagjja" />
      <Field name="city" label="Qyteti" placeholder="Tiranë" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="lat" label="Lat" placeholder="41.3275" />
        <Field name="lng" label="Lng" placeholder="19.8189" />
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Përshkrim opsional
        <textarea
          name="description"
          rows={4}
          className="rounded-md border border-stone-200 px-3 py-2"
          placeholder="Përshkrim neutral i vendit."
        />
      </label>
      <button className="rounded-md bg-[#c91f37] px-4 py-3 text-sm font-semibold text-white">
        Krijo vend të ri
      </button>
      {message ? <p className="rounded-md bg-stone-50 p-3 text-sm">{message}</p> : null}
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input
        name={name}
        placeholder={placeholder}
        className="rounded-md border border-stone-200 px-3 py-2"
      />
    </label>
  );
}
