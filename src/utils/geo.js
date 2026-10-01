const KAABA = { lat: 21.4225, lng: 39.8262 };
const rad = (deg) => (deg * Math.PI) / 180;
const DIRECTIONS = [
  "شمال",
  "شمال شرق",
  "شرق",
  "جنوب شرق",
  "جنوب",
  "جنوب غرب",
  "غرب",
  "شمال غرب",
];

export function qiblaBearing(lat, lng) {
  const lat1 = rad(lat);
  const lat2 = rad(KAABA.lat);
  const dLng = rad(KAABA.lng - lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function distanceToKaabaKm(lat, lng) {
  const dLat = rad(KAABA.lat - lat);
  const dLng = rad(KAABA.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const directionName = (deg) => DIRECTIONS[Math.round(deg / 45) % 8];
