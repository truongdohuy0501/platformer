/**
 * Central registry for asset keys used by loaders, scenes, and entities.
 */
export const AssetKeys = {
  /** TexturePacker JSON Hash atlas — public/assets/player/1.png + 1.json */
  Player: 'player',
  Platform: 'platform',
  TilesetH2: 'tileset-h2',
  EnemySlime: 'enemy-slime',
} as const;

export type AssetKey = (typeof AssetKeys)[keyof typeof AssetKeys];
