import { AssetKeys } from '../config/asset-keys';
import { MapKeys } from '../maps/map-keys';
import type { AssetDefinition } from './asset-definition';

/**
 * Critical path assets (UI, fonts). Loaded first in BootScene.
 */
export const bootAssets: readonly AssetDefinition[] = [];

/**
 * Gameplay assets (sprites, tilemaps, audio). Also loaded in BootScene
 * so GameScene stays create-only and can be restarted without reloading.
 */
export const gameAssets: readonly AssetDefinition[] = [
  {
    type: 'tilemap',
    key: MapKeys.Level1,
    path: '/maps/level1.json',
  },
  {
    type: 'spritesheet',
    key: AssetKeys.TilesetH2,
    path: '/tiles/H2.jpeg',
    frameConfig: { frameWidth: 32, frameHeight: 32 },
  },
];

/** Full preload list for BootScene. */
export const preloadAssets: readonly AssetDefinition[] = [
  ...bootAssets,
  ...gameAssets,
];
