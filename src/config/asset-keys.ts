/**
 * Central registry for asset keys used by loaders, scenes, and entities.
 */
export const AssetKeys = {
  PlayerSheet: 'player-sheet',
  Platform: 'platform',
  TilesetH2: 'tileset-h2',
} as const;

export type AssetKey = (typeof AssetKeys)[keyof typeof AssetKeys];
