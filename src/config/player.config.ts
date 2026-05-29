/**
 * Player config types — values are loaded from public/data/movement/player.json.
 */
import type { MovementConfigData } from '../data/types';

export type PlayerMovementConfig = MovementConfigData['movement'];

export type PlayerPhysicsBodyConfig = {
  readonly width: number;
  readonly height: number;
  readonly offsetX: number;
  readonly offsetY: number;
};

export type PlayerSpawnConfig = {
  readonly textureKey: string;
  readonly defaultFrame: string;
  readonly displaySize?: { readonly width: number; readonly height: number };
  readonly spawn: { readonly x: number; readonly y: number };
  readonly physicsBody: PlayerPhysicsBodyConfig;
  readonly movement: MovementConfigData['movement'];
};
