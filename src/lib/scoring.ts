import type { Rating, RatingInput } from "@/lib/types";

export function calculateRatingWeight({
  rating,
  accountAgeDays = 0,
  normalRatingsCount = 0,
  sameDeviceAccounts = 1,
}: {
  rating: RatingInput;
  accountAgeDays?: number;
  normalRatingsCount?: number;
  sameDeviceAccounts?: number;
}): number {
  let weight = 1;

  if (rating.gps_verified) weight += 1;
  if ((rating.gps_accuracy_meters ?? 999) <= 35) weight += 0.15;
  if (accountAgeDays >= 7) weight += 0.15;
  if (normalRatingsCount >= 3) weight += 0.25;
  if (!rating.comment || rating.comment.trim().length < 20) weight -= 0.1;
  if (accountAgeDays < 2) weight -= 0.2;
  if (sameDeviceAccounts > 2) weight -= 0.7;
  if ((rating.gps_accuracy_meters ?? 0) > 100) weight -= 0.8;

  return Number(Math.min(2.5, Math.max(0.1, weight)).toFixed(2));
}

export function calculateFraudScore({
  rating,
  sameDeviceAccounts = 1,
  ratingsLastHour = 0,
  duplicateText = false,
}: {
  rating: RatingInput;
  sameDeviceAccounts?: number;
  ratingsLastHour?: number;
  duplicateText?: boolean;
}): number {
  let score = 0;

  if (!rating.gps_verified) score += 70;
  if ((rating.gps_accuracy_meters ?? 0) > 100) score += 25;
  if (sameDeviceAccounts > 2) score += 40;
  if (ratingsLastHour >= 5) score += 30;
  if (duplicateText) score += 20;
  if (!rating.comment || rating.comment.trim().length < 10) score += 5;

  return Math.min(100, Math.max(0, score));
}

export function statusFromFraudScore(
  fraudScore: number,
): Rating["status"] {
  if (fraudScore >= 80) return "flagged";
  if (fraudScore >= 55) return "pending";
  return "approved";
}

export function calculateEntityScores(ratings: Rating[]) {
  const approved = ratings.filter((rating) => rating.status === "approved");
  const totalRatings = approved.length;

  if (totalRatings === 0) {
    return {
      average_score: 0,
      weighted_score: 0,
      total_ratings: 0,
      recommend_percent: 0,
      return_percent: 0,
      trust_index: 0,
    };
  }

  const average =
    approved.reduce((sum, rating) => sum + rating.overall, 0) / totalRatings;
  const totalWeight = approved.reduce((sum, rating) => sum + rating.weight, 0);
  const weighted =
    approved.reduce(
      (sum, rating) => sum + rating.overall * rating.weight,
      0,
    ) / Math.max(totalWeight, 0.1);
  const recommend =
    approved.filter((rating) => rating.would_recommend).length / totalRatings;
  const wouldReturn =
    approved.filter((rating) => rating.would_return).length / totalRatings;
  const trustIndex =
    approved.reduce(
      (sum, rating) => sum + (100 - rating.fraud_score) * rating.weight,
      0,
    ) / Math.max(totalWeight, 0.1);

  return {
    average_score: Number(average.toFixed(2)),
    weighted_score: Number(weighted.toFixed(2)),
    total_ratings: totalRatings,
    recommend_percent: Math.round(recommend * 100),
    return_percent: Math.round(wouldReturn * 100),
    trust_index: Math.round(trustIndex),
  };
}

export function scoreTone(score: number): "good" | "warn" | "bad" | "empty" {
  if (score === 0) return "empty";
  if (score >= 4) return "good";
  if (score >= 2.8) return "warn";
  return "bad";
}
