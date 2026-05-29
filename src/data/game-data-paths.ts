import { publicUrl } from '../utils/public-url';

/** URL paths for gameplay JSON under /public/data. */
export const gameDataPaths = {
  manifest: publicUrl('/data/game.json'),
  movement: (id: string) => publicUrl(`/data/movement/${id}.json`),
  level: (id: string) => publicUrl(`/data/levels/${id}.json`),
  collectible: (id: string) => publicUrl(`/data/collectibles/${id}.json`),
  enemy: (id: string) => publicUrl(`/data/enemies/${id}.json`),
  animation: (id: string) => publicUrl(`/data/animations/${id}.json`),
} as const;
