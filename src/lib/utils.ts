import { clsx, type ClassValue } from "clsx";

export function cn(...classes: ClassValue[]) {
  return clsx(classes);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function percentage(value: number) {
  return `${Math.round(value)}%`;
}

export function formatScore(score: number) {
  return score > 0 ? score.toFixed(1) : "Pa vlerësim";
}
