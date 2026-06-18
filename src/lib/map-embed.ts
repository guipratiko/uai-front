export function buildMapEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&hl=pt-BR&z=15&output=embed`;
}

export function validateCoordinates(coords: { lat: number; lng: number }): string | null {
  if (!Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
    return "Informe latitude e longitude do local";
  }
  if (coords.lat < -90 || coords.lat > 90) {
    return "Latitude inválida (use valores entre -90 e 90)";
  }
  if (coords.lng < -180 || coords.lng > 180) {
    return "Longitude inválida (use valores entre -180 e 180)";
  }
  return null;
}

export function applyMapEmbed<T extends { coordinates: { lat: number; lng: number }; mapEmbedUrl: string }>(
  form: T,
): T {
  const err = validateCoordinates(form.coordinates);
  if (err) return form;
  return {
    ...form,
    mapEmbedUrl: buildMapEmbedUrl(form.coordinates.lat, form.coordinates.lng),
  };
}
