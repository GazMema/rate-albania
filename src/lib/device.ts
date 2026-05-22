export const DEVICE_STORAGE_KEY = "vlereso_device_id";

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") return "";

  const current = window.localStorage.getItem(DEVICE_STORAGE_KEY);
  if (current) return current;

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(DEVICE_STORAGE_KEY, next);
  return next;
}
