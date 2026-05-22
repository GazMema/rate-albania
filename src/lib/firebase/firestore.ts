"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAt,
  endAt,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { geohashForLocation, geohashQueryBounds } from "geofire-common";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  calculateFraudScore,
} from "@/lib/scoring";
import type { Entity, EntityType, RatingInput, SortMode } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { distanceMeters } from "@/lib/location";

export type CreateEntityInput = {
  name: string;
  type: EntityType;
  address: string;
  city: string;
  description?: string;
  lat: number;
  lng: number;
  userId: string;
};

export async function createFirestoreEntity(input: CreateEntityInput) {
  const db = getFirebaseDb();
  const slug = slugify(`${input.name}-${input.city}`);
  const id = slug;
  const aiDescription = `${input.name} është një vend publik në ${input.city}. Përdoruesit mund të vlerësojnë shërbimin, besimin, shpejtësinë dhe përvojën e përgjithshme.`;

  await setDoc(doc(db, "entities", id), {
    id,
    name: input.name,
    slug,
    type: input.type,
    description: input.description || null,
    ai_description: aiDescription,
    address: input.address || null,
    city: input.city,
    country: "Albania",
    lat: input.lat,
    lng: input.lng,
    geohash: geohashForLocation([input.lat, input.lng]),
    created_by: input.userId,
    claimed_by: null,
    claim_status: "unclaimed",
    status: "active",
    average_score: 0,
    weighted_score: 0,
    total_ratings: 0,
    recommend_percent: 0,
    return_percent: 0,
    trust_index: 50,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return slug;
}

export async function fetchFirestoreEntityBySlug(slug: string) {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, "entities", slug));
  return snap.exists() ? (snap.data() as Entity) : null;
}

export async function fetchFirestoreEntities({
  q,
  city,
  type,
  sort = "best",
  count = 24,
}: {
  q?: string;
  city?: string;
  type?: string;
  sort?: SortMode | string;
  count?: number;
}) {
  const db = getFirebaseDb();
  const filters: QueryConstraint[] = [where("status", "==", "active")];

  if (city) filters.push(where("city", "==", city));
  if (type) filters.push(where("type", "==", type));

  const ordering: QueryConstraint[] = [];

  if (sort === "worst") ordering.push(orderBy("weighted_score", "asc"));
  else if (sort === "most_reviewed")
    ordering.push(orderBy("total_ratings", "desc"));
  else if (sort === "recommended")
    ordering.push(orderBy("recommend_percent", "desc"));
  else ordering.push(orderBy("weighted_score", "desc"));

  const snap = await getDocs(
    query(collection(db, "entities"), ...filters, ...ordering, limit(count)),
  );
  const docs = snap.docs.map((item) => item.data() as Entity);
  const normalizedQuery = q?.trim().toLowerCase();

  return normalizedQuery
    ? docs.filter((entity) =>
        `${entity.name} ${entity.address ?? ""} ${entity.city}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : docs;
}

export async function fetchNearbyFirestoreEntities({
  lat,
  lng,
  radiusM = 5000,
}: {
  lat: number;
  lng: number;
  radiusM?: number;
}) {
  const db = getFirebaseDb();
  const bounds = geohashQueryBounds([lat, lng], radiusM);
  const snapshots = await Promise.all(
    bounds.map((bound) =>
      getDocs(
        query(
          collection(db, "entities"),
          orderBy("geohash"),
          startAt(bound[0]),
          endAt(bound[1]),
          limit(20),
        ),
      ),
    ),
  );

  const seen = new Set<string>();
  const matches: Entity[] = [];

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((item) => {
      if (seen.has(item.id)) return;
      const entity = item.data() as Entity;
      const distance = distanceMeters({ lat, lng }, entity);
      if (distance <= radiusM && entity.status === "active") {
        seen.add(item.id);
        matches.push(entity);
      }
    });
  });

  return matches.sort((a, b) => b.weighted_score - a.weighted_score);
}

export async function createFirestoreRating({
  entity,
  userId,
  deviceId,
  rating,
}: {
  entity: Entity;
  userId: string;
  deviceId: string;
  rating: RatingInput & { gps_lat: number; gps_lng: number };
}) {
  const db = getFirebaseDb();
  const ratingId = `${entity.id}_${userId}`;
  const deviceRatingId = `${entity.id}_${deviceId}`;
  const fraudScore = calculateFraudScore({ rating });

  await runTransaction(db, async (transaction) => {
    const ratingRef = doc(db, "ratings", ratingId);
    const deviceRef = doc(db, "deviceEntityRatings", deviceRatingId);
    const entityRef = doc(db, "entities", entity.id);
    const existingRating = await transaction.get(ratingRef);
    const existingDevice = await transaction.get(deviceRef);

    if (existingDevice.exists() && existingDevice.data().user_id !== userId) {
      throw new Error("Kjo pajisje ka vlerësuar tashmë këtë vend.");
    }

    if (existingRating.exists()) {
      const updatedAt = existingRating.data().updated_at?.toDate?.() as
        | Date
        | undefined;
      if (
        updatedAt &&
        Date.now() - updatedAt.getTime() < 30 * 24 * 60 * 60 * 1000
      ) {
        throw new Error("Vlerësimin mund ta përditësosh pas 30 ditësh.");
      }
    }

    transaction.set(
      ratingRef,
      {
        id: ratingId,
        entity_id: entity.id,
        user_id: userId,
        device_id: deviceId,
        ...rating,
        gps_verified: true,
        weight: 0,
        fraud_score: fraudScore,
        status: "pending",
        created_at: existingRating.exists()
          ? existingRating.data().created_at
          : serverTimestamp(),
        updated_at: serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(deviceRef, {
      entity_id: entity.id,
      user_id: userId,
      device_id: deviceId,
      updated_at: serverTimestamp(),
    });

    transaction.update(entityRef, {
      updated_at: serverTimestamp(),
    });
  });
}
