const CITIES: { lat: number; lon: number; country: string }[] = [
  { lat: 48.1351, lon: 11.582, country: "DE" },
  { lat: 52.52, lon: 13.405, country: "DE" },
  { lat: 40.7128, lon: -74.006, country: "US" },
  { lat: 19.076, lon: 72.8777, country: "IN" },
  { lat: 35.6895, lon: 139.6917, country: "JP" },
  { lat: 51.5074, lon: -0.1278, country: "GB" },
  { lat: 53.4808, lon: -2.2426, country: "GB" },
  { lat: 28.6139, lon: 77.209, country: "IN" },
  { lat: 50.4501, lon: 30.5234, country: "UA" },
  { lat: 41.9028, lon: 12.4964, country: "IT" },
  { lat: 48.8566, lon: 2.3522, country: "FR" },
  { lat: 39.9042, lon: 116.4074, country: "CN" },
  { lat: -33.8688, lon: 151.2093, country: "AU" },
  { lat: -23.5505, lon: -46.6333, country: "BR" },
];

function dist(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Approximate country code from lat/long (distance to known city centers). */
export function getCountryFromCoords(latitude: number, longitude: number): string {
  let best = "Unknown";
  let bestD = Infinity;
  for (const c of CITIES) {
    const d = dist(latitude, longitude, c.lat, c.lon);
    if (d < bestD && d < 800) {
      bestD = d;
      best = c.country;
    }
  }
  return best;
}
