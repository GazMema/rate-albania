import { sampleEntities, sampleRatings } from "@/lib/sample-data";
import type { Entity, EntityType, SortMode } from "@/lib/types";

export async function getEntities(params?: {
  query?: string;
  city?: string;
  type?: EntityType | string;
  sort?: SortMode | string;
  limit?: number;
}) {
  return sortEntities(
    sampleEntities.filter((entity) => {
      const matchesQuery = params?.query
        ? `${entity.name} ${entity.city} ${entity.address ?? ""}`
            .toLowerCase()
            .includes(params.query.toLowerCase())
        : true;
      const matchesCity = params?.city
        ? entity.city.toLowerCase().includes(params.city.toLowerCase())
        : true;
      const matchesType = params?.type ? entity.type === params.type : true;
      return matchesQuery && matchesCity && matchesType;
    }),
    params?.sort,
  ).slice(0, params?.limit ?? 24);
}

export async function getEntityBySlug(slug: string) {
  return sampleEntities.find((entity) => entity.slug === slug) ?? null;
}

export async function getEntityById(id: string) {
  return sampleEntities.find((entity) => entity.id === id) ?? null;
}

export async function getRatingsForEntity(entityId: string) {
  return sampleRatings.filter((rating) => rating.entity_id === entityId);
}

export async function getRankingGroups() {
  const entities = await getEntities({ limit: 100 });
  const enough = entities.filter((entity) => entity.total_ratings >= 5);

  return {
    best: [...enough]
      .sort((a, b) => b.weighted_score - a.weighted_score)
      .slice(0, 8),
    worst: [...enough]
      .sort((a, b) => a.weighted_score - b.weighted_score)
      .slice(0, 8),
    recommended: [...enough]
      .sort((a, b) => b.recommend_percent - a.recommend_percent)
      .slice(0, 8),
    avoid: [...enough]
      .sort((a, b) => {
        const aScore = a.weighted_score + a.return_percent / 100;
        const bScore = b.weighted_score + b.return_percent / 100;
        return aScore - bScore;
      })
      .slice(0, 8),
    improved: [...enough]
      .sort((a, b) => (b.trend_delta ?? 0) - (a.trend_delta ?? 0))
      .slice(0, 8),
    trendingDown: [...enough]
      .sort((a, b) => (a.trend_delta ?? 0) - (b.trend_delta ?? 0))
      .slice(0, 8),
    mostReviewed: [...enough]
      .sort((a, b) => b.total_ratings - a.total_ratings)
      .slice(0, 8),
  };
}

function sortEntities(entities: Entity[], sort?: string) {
  const next = [...entities];

  if (sort === "worst") {
    return next.sort((a, b) => a.weighted_score - b.weighted_score);
  }

  if (sort === "most_reviewed") {
    return next.sort((a, b) => b.total_ratings - a.total_ratings);
  }

  if (sort === "recommended") {
    return next.sort((a, b) => b.recommend_percent - a.recommend_percent);
  }

  if (sort === "avoid") {
    return next.sort((a, b) => {
      const aScore = a.weighted_score + a.return_percent / 100;
      const bScore = b.weighted_score + b.return_percent / 100;
      return aScore - bScore;
    });
  }

  if (sort === "improved") {
    return next.sort((a, b) => (b.trend_delta ?? 0) - (a.trend_delta ?? 0));
  }

  if (sort === "trending") {
    return next.sort(
      (a, b) => (b.recent_reviews_count ?? 0) - (a.recent_reviews_count ?? 0),
    );
  }

  return next.sort((a, b) => b.weighted_score - a.weighted_score);
}
