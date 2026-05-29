import { AssetKeys } from '../../config/asset-keys';
import { MapKeys } from '../map-keys';

export const Level1Config = {
  mapKey: MapKeys.Level1,
  mapPath: '/maps/level1.json',
  tilesetName: 'H2',
  tilesetImageKey: AssetKeys.TilesetH2,
  tilesetImagePath: '/tiles/H2.jpeg',
  /** Draw order: first = back, last = front */
  tileLayerOrder: [
    'land',
    'ground',
    'rock',
    'mushroom',
    'cloud',
    'water',
  ],
  /** Prefer elevated platforms over bottom "land" strip near water */
  spawnCollisionLayerOrder: ['ground', 'rock', 'land'],
  objectLayers: {
    coins: 'coins',
    spawn: 'spawn',
  },
  collisionProperty: 'collides',
  deadlyProperty: 'deadly',
} as const;

export type LevelConfig = typeof Level1Config;
