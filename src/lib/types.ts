export const entityTypes = [
  "restaurant",
  "cafe",
  "bank",
  "hospital",
  "clinic",
  "school",
  "university",
  "municipality",
  "government_office",
  "police_station",
  "utility_company",
  "internet_provider",
  "transport",
  "shop",
  "other",
] as const;

export type EntityType = (typeof entityTypes)[number];

export type UserRole = "user" | "moderator" | "admin";
export type RatingStatus = "approved" | "pending" | "rejected" | "flagged";
export type ClaimStatus = "unclaimed" | "pending" | "approved" | "rejected";
export type SortMode =
  | "best"
  | "worst"
  | "most_reviewed"
  | "recommended"
  | "avoid"
  | "improved"
  | "trending";

export type Entity = {
  id: string;
  name: string;
  slug: string;
  type: EntityType;
  description: string | null;
  ai_description: string | null;
  address: string | null;
  city: string;
  country: string;
  lat: number;
  lng: number;
  claimed_by?: string | null;
  claim_status: ClaimStatus;
  status: "active" | "inactive" | "merged";
  average_score: number;
  weighted_score: number;
  total_ratings: number;
  recommend_percent: number;
  return_percent: number;
  trust_index: number;
  created_at: string;
  updated_at: string;
  trend_delta?: number;
  recent_reviews_count?: number;
};

export type Rating = {
  id: string;
  entity_id: string;
  user_id: string;
  device_id: string;
  overall: number;
  service: number;
  trust: number;
  cleanliness: number;
  speed: number;
  fairness: number;
  would_recommend: boolean;
  would_return: boolean;
  comment: string | null;
  gps_verified: boolean;
  gps_lat: number | null;
  gps_lng: number | null;
  gps_accuracy_meters: number | null;
  distance_meters: number | null;
  weight: number;
  fraud_score: number;
  status: RatingStatus;
  created_at: string;
  updated_at: string;
};

export type RatingInput = Pick<
  Rating,
  | "overall"
  | "service"
  | "trust"
  | "cleanliness"
  | "speed"
  | "fairness"
  | "would_recommend"
  | "would_return"
  | "comment"
  | "gps_verified"
  | "gps_accuracy_meters"
  | "distance_meters"
>;

export type RatingCategory = {
  key: string;
  labelSq: string;
  labelEn: string;
};

export const entityTypeLabels: Record<EntityType, string> = {
  restaurant: "Restorant",
  cafe: "Kafe",
  bank: "Bankë",
  hospital: "Spital",
  clinic: "Klinikë",
  school: "Shkollë",
  university: "Universitet",
  municipality: "Bashki",
  government_office: "Zyrë shtetërore",
  police_station: "Stacion policie",
  utility_company: "Shërbim publik",
  internet_provider: "Internet",
  transport: "Transport",
  shop: "Dyqan",
  other: "Tjetër",
};

export const universalRatingCategories: RatingCategory[] = [
  { key: "overall", labelSq: "Vlerësimi total", labelEn: "Overall" },
  { key: "service", labelSq: "Shërbimi", labelEn: "Service" },
  { key: "trust", labelSq: "Besimi", labelEn: "Trust" },
  { key: "cleanliness", labelSq: "Pastërtia", labelEn: "Cleanliness" },
  { key: "speed", labelSq: "Shpejtësia", labelEn: "Speed" },
  { key: "fairness", labelSq: "Drejtësia e çmimit", labelEn: "Fairness" },
];

export const entitySpecificCategories: Partial<
  Record<EntityType, RatingCategory[]>
> = {
  government_office: [
    { key: "transparency", labelSq: "Transparenca", labelEn: "Transparency" },
    {
      key: "employee_behavior",
      labelSq: "Sjellja e punonjësve",
      labelEn: "Employee behavior",
    },
    { key: "waiting_time", labelSq: "Koha e pritjes", labelEn: "Waiting time" },
    {
      key: "problem_resolution",
      labelSq: "Zgjidhja e problemit",
      labelEn: "Problem resolution",
    },
  ],
  municipality: [
    { key: "transparency", labelSq: "Transparenca", labelEn: "Transparency" },
    { key: "respect", labelSq: "Respekti ndaj qytetarëve", labelEn: "Respect" },
    {
      key: "digital_service",
      labelSq: "Shërbimi digjital",
      labelEn: "Digital service",
    },
  ],
  hospital: [
    {
      key: "professionalism",
      labelSq: "Profesionalizmi",
      labelEn: "Professionalism",
    },
    { key: "care_quality", labelSq: "Cilësia e kujdesit", labelEn: "Care" },
    { key: "communication", labelSq: "Komunikimi", labelEn: "Communication" },
  ],
  clinic: [
    {
      key: "professionalism",
      labelSq: "Profesionalizmi",
      labelEn: "Professionalism",
    },
    { key: "care_quality", labelSq: "Cilësia e kujdesit", labelEn: "Care" },
    { key: "communication", labelSq: "Komunikimi", labelEn: "Communication" },
  ],
  bank: [
    { key: "queue_time", labelSq: "Koha në radhë", labelEn: "Queue time" },
    {
      key: "fees_transparency",
      labelSq: "Transparenca e tarifave",
      labelEn: "Fee transparency",
    },
    {
      key: "online_service",
      labelSq: "Aplikacioni dhe online",
      labelEn: "Online service",
    },
  ],
  school: [
    {
      key: "teaching_quality",
      labelSq: "Cilësia e mësimit",
      labelEn: "Teaching quality",
    },
    { key: "safety", labelSq: "Siguria", labelEn: "Safety" },
    { key: "facilities", labelSq: "Ambientet", labelEn: "Facilities" },
  ],
  university: [
    {
      key: "teaching_quality",
      labelSq: "Cilësia e mësimit",
      labelEn: "Teaching quality",
    },
    { key: "fairness", labelSq: "Drejtësia", labelEn: "Fairness" },
    { key: "facilities", labelSq: "Ambientet", labelEn: "Facilities" },
  ],
  restaurant: [
    {
      key: "food_quality",
      labelSq: "Cilësia e ushqimit",
      labelEn: "Food quality",
    },
    { key: "atmosphere", labelSq: "Atmosfera", labelEn: "Atmosphere" },
  ],
  cafe: [
    {
      key: "drink_quality",
      labelSq: "Cilësia e pijeve",
      labelEn: "Drink quality",
    },
    { key: "atmosphere", labelSq: "Atmosfera", labelEn: "Atmosphere" },
  ],
};
