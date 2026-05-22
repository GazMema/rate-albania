import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFile } from "node:fs/promises";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "rate-albania";
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const credential = serviceAccountPath
  ? cert(JSON.parse(await readFile(serviceAccountPath, "utf8")))
  : undefined;

if (!getApps().length) {
  initializeApp({ credential, projectId });
}

const db = getFirestore();
const now = Timestamp.now();

const entities = [
  {
    id: "bashkia-tirane-tirane",
    name: "Bashkia Tiranë",
    slug: "bashkia-tirane-tirane",
    type: "municipality",
    city: "Tiranë",
    address: "Sheshi Skënderbej",
    lat: 41.3275,
    lng: 19.8189,
    geohash: "srq5pu",
    weighted_score: 3.3,
    average_score: 3.1,
    total_ratings: 128,
    recommend_percent: 46,
    return_percent: 41,
    trust_index: 77,
  },
  {
    id: "spitali-universitar-tirane-tirane",
    name: "Spitali Universitar Tiranë",
    slug: "spitali-universitar-tirane-tirane",
    type: "hospital",
    city: "Tiranë",
    address: "Rruga e Dibrës",
    lat: 41.3408,
    lng: 19.8339,
    geohash: "srq7h2",
    weighted_score: 2.8,
    average_score: 2.7,
    total_ratings: 143,
    recommend_percent: 31,
    return_percent: 22,
    trust_index: 81,
  },
  {
    id: "bkt-dega-tirane-tirane",
    name: "BKT Dega Tiranë",
    slug: "bkt-dega-tirane-tirane",
    type: "bank",
    city: "Tiranë",
    address: "Bulevardi Zogu I",
    lat: 41.333,
    lng: 19.817,
    geohash: "srq5rj",
    weighted_score: 4.3,
    average_score: 4.1,
    total_ratings: 56,
    recommend_percent: 78,
    return_percent: 73,
    trust_index: 86,
  },
  {
    id: "vodafone-albania-tirane",
    name: "Vodafone Albania",
    slug: "vodafone-albania-tirane",
    type: "internet_provider",
    city: "Tiranë",
    address: "Rruga Ibrahim Rugova",
    lat: 41.3219,
    lng: 19.8162,
    geohash: "srq5ps",
    weighted_score: 3.2,
    average_score: 3.4,
    total_ratings: 92,
    recommend_percent: 49,
    return_percent: 45,
    trust_index: 75,
  },
  {
    id: "oda-shkodrane-shkoder",
    name: "Oda Shkodrane",
    slug: "oda-shkodrane-shkoder",
    type: "restaurant",
    city: "Shkodër",
    address: "Rruga Kolë Idromeno",
    lat: 42.068,
    lng: 19.512,
    geohash: "srkbcv",
    weighted_score: 4.6,
    average_score: 4.5,
    total_ratings: 38,
    recommend_percent: 91,
    return_percent: 88,
    trust_index: 89,
  },
];

const batch = db.batch();

for (const entity of entities) {
  batch.set(
    db.collection("entities").doc(entity.id),
    {
      ...entity,
      country: "Albania",
      status: "active",
      claim_status: entity.id === "bkt-dega-tirane-tirane" ? "approved" : "unclaimed",
      description: null,
      ai_description: `${entity.name} është një vend publik në ${entity.city}. Përdoruesit mund të vlerësojnë shërbimin, besimin, shpejtësinë dhe përvojën e përgjithshme.`,
      created_by: "seed",
      claimed_by: null,
      created_at: now,
      updated_at: now,
    },
    { merge: true },
  );
}

await batch.commit();
console.log(`Seeded ${entities.length} entities into ${projectId}.`);
