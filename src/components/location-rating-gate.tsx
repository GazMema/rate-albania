"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, ShieldCheck } from "lucide-react";
import type { Entity } from "@/lib/types";
import { getOrCreateDeviceId } from "@/lib/device";
import { isLocationEligible } from "@/lib/location";
import { getFirebaseAuth, hasFirebaseEnv } from "@/lib/firebase/client";
import { createFirestoreRating } from "@/lib/firebase/firestore";

export function LocationRatingGate({ entity }: { entity: Entity }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "checking" }
    | {
        status: "allowed";
        lat: number;
        lng: number;
        accuracy: number;
        distance: number;
        deviceId: string;
      }
    | { status: "blocked"; message: string; distance?: number; radius?: number }
  >({ status: "idle" });

  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  function verify() {
    if (!navigator.geolocation) {
      setState({
        status: "blocked",
        message: "Shfletuesi nuk mbështet vendndodhjen.",
      });
      return;
    }

    setState({ status: "checking" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const result = isLocationEligible({
          user: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          entity: { lat: entity.lat, lng: entity.lng },
          entityType: entity.type,
          accuracyMeters: position.coords.accuracy,
        });

        if (result.needsBetterAccuracy) {
          setState({
            status: "blocked",
            message:
              "Saktësia e GPS është mbi 100m. Provo përsëri nga vendi ku je.",
            distance: result.distance,
            radius: result.radius,
          });
          return;
        }

        if (!result.allowed) {
          setState({
            status: "blocked",
            message: "Duhet të jesh pranë këtij vendi për ta vlerësuar.",
            distance: result.distance,
            radius: result.radius,
          });
          return;
        }

        setState({
          status: "allowed",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          distance: result.distance,
          deviceId,
        });
      },
      () =>
        setState({
          status: "blocked",
          message: "Nuk mundëm të marrim vendndodhjen. Lejo GPS dhe provo përsëri.",
        }),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 },
    );
  }

  if (state.status === "allowed") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <ShieldCheck size={18} />
          Ky vlerësim u verifikua me vendndodhje.
        </div>
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");

            if (!hasFirebaseEnv()) {
              setError("Shto konfigurimin Firebase për të ruajtur vlerësime.");
              return;
            }

            const user = getFirebaseAuth().currentUser;
            if (!user) {
              setError("Hyr me Google para se të ruash vlerësimin.");
              return;
            }

            const form = new FormData(event.currentTarget);

            try {
              await createFirestoreRating({
                entity,
                userId: user.uid,
                deviceId: state.deviceId,
                rating: {
                  overall: Number(form.get("overall")),
                  service: Number(form.get("service")),
                  trust: Number(form.get("trust")),
                  cleanliness: Number(form.get("cleanliness")),
                  speed: Number(form.get("speed")),
                  fairness: Number(form.get("fairness")),
                  would_recommend: form.get("would_recommend") === "on",
                  would_return: form.get("would_return") === "on",
                  comment: String(form.get("comment") ?? ""),
                  gps_verified: true,
                  gps_lat: state.lat,
                  gps_lng: state.lng,
                  gps_accuracy_meters: state.accuracy,
                  distance_meters: state.distance,
                },
              });
              router.refresh();
              setError("Vlerësimi u dërgua për verifikim dhe moderim.");
            } catch (caught) {
              setError(
                caught instanceof Error
                  ? caught.message
                  : "Nuk mundëm ta ruajmë vlerësimin.",
              );
            }
          }}
        >
          <RatingSelect name="overall" label="Vlerësimi total" />
          <RatingSelect name="service" label="Shërbimi" />
          <RatingSelect name="trust" label="Besimi" />
          <RatingSelect name="cleanliness" label="Pastërtia" />
          <RatingSelect name="speed" label="Shpejtësia" />
          <RatingSelect name="fairness" label="Drejtësia" />
          <label className="grid gap-1 text-sm font-medium">
            Koment
            <textarea
              name="comment"
              rows={4}
              className="rounded-md border border-stone-200 px-3 py-2"
              placeholder="Shpjego përvojën pa përmendur të dhëna personale."
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="would_recommend" />
            Do ta rekomandoje?
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="would_return" />
            Do të ktheheshe përsëri?
          </label>
          <button
            type="submit"
            className="rounded-md bg-stone-950 px-4 py-3 text-sm font-semibold text-white"
          >
            Ruaj vlerësimin
          </button>
          {error ? <p className="text-sm text-stone-700">{error}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <button
        className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#c91f37] px-4 py-3 text-sm font-semibold text-white hover:bg-[#a7182d]"
        onClick={verify}
        disabled={state.status === "checking"}
      >
        <LocateFixed size={18} />
        {state.status === "checking" ? "Po verifikohet..." : "Verifiko GPS"}
      </button>
      {state.status === "blocked" ? (
        <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-800">
          {state.message}
          {state.distance && state.radius
            ? ` Distanca: ${state.distance}m. Kufiri: ${state.radius}m.`
            : ""}
        </p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Për të ruajtur besimin, vetëm përdoruesit pranë vendit mund të
          vlerësojnë në MVP.
        </p>
      )}
    </div>
  );
}

function RatingSelect({ name, label }: { name: string; label: string }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <select
        name={name}
        className="rounded-md border border-stone-200 bg-white px-3 py-2"
        defaultValue="5"
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
}
