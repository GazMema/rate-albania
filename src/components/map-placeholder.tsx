import { MapPin } from "lucide-react";

export function MapPlaceholder({
  name,
  lat,
  lng,
}: {
  name: string;
  lat: number;
  lng: number;
}) {
  return (
    <div className="map-grid relative min-h-72 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c91f37] text-white shadow-lg">
          <MapPin size={24} />
        </span>
        <span className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
          {name}
        </span>
        <span className="rounded-md bg-white/90 px-2 py-1 text-xs text-stone-600">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
