import { geohashForLocation } from "geofire-common";
import { sampleEntities, sampleRatings } from "@/lib/sample-data";

export function getFirebaseSeedPayload() {
  return {
    entities: sampleEntities.map((entity) => ({
      ...entity,
      geohash: geohashForLocation([entity.lat, entity.lng]),
    })),
    ratings: sampleRatings,
  };
}
