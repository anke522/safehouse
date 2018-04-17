export interface Position {
  lat: number;
  lon: number;
  alt: number;
}

export const createPosition = (lat: number, lon: number, alt: number): Position => ({
  lat,
  lon,
  alt
});
