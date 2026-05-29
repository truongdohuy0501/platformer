import { AssetKeys } from '../config/asset-keys';
import { MapKeys } from '../maps/map-keys';
import { publicUrl } from '../utils/public-url';
import type { AssetDefinition } from './asset-definition';

export const preloadAssets: readonly AssetDefinition[] = [
  {
    type: 'atlas',
    key: AssetKeys.Player,
    texturePath: publicUrl('/assets/player/1.png'),
    atlasPath: publicUrl('/assets/player/1.json'),
  },
  {
    type: 'tilemap',
    key: MapKeys.Level1,
    path: publicUrl('/maps/level1.json'),
  },
  {
    type: 'spritesheet',
    key: AssetKeys.TilesetH2,
    path: publicUrl('/tiles/H2.jpeg'),
    frameConfig: { frameWidth: 32, frameHeight: 32 },
  },
];
