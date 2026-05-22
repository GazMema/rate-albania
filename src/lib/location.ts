import type { EntityType } from "@/lib/types";

export type Coordinates = {
  lat: number;
  lng: number;
};

export function allowedRadiusForType(type: EntityType): number {
  if (type === "restaurant" || type === "cafe" || type === "shop") {
    return 100;
  }

  if (
    type === "bank" ||
    type === "government_office" ||
    type === "police_station"
  ) {
    return 150;
  }

  if (
    type === "hospital" ||
    type === "clinic" ||
    type === "school" ||
    type === "university" ||
    type === "municipality"
  ) {
    return 250;
  }

  return 200;
}

export function distanceMeters(from: Coordinates, to: Coordinates): number {
  const earthRadius = 6_371_000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return Math.round(
    earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
  );
}

export function isLocationEligible({
  user,
  entity,
  entityType,
  accuracyMeters,
}: {
  user: Coordinates;
  entity: Coordinates;
  entityType: EntityType;
  accuracyMeters: number;
}) {
  const distance = distanceMeters(user, entity);
  const radius = allowedRadiusForType(entityType);

  return {
    allowed: accuracyMeters <= 100 && distance <= radius,
    distance,
    radius,
    needsBetterAccuracy: accuracyMeters > 100,
  };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}
