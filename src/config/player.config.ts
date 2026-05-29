import { AssetKeys } from './asset-keys';
import { GAME_HEIGHT, GAME_WIDTH } from './game.config';

export type PlayerPhysicsBodyConfig = {
  readonly width: number;
  readonly height: number;
  readonly offsetX: number;
  readonly offsetY: number;
};

export type PlayerMovementConfig = {
  readonly groundMaxSpeed: number;
  readonly groundAcceleration: number;
  readonly groundDeceleration: number;
  readonly airMaxSpeed: number;
  readonly airAcceleration: number;
  readonly airDeceleration: number;
  readonly jumpVelocity: number;
  readonly jumpCutMultiplier: number;
  readonly maxFallSpeed: number;
  readonly coyoteTimeMs: number;
  readonly jumpBufferMs: number;
};

export type PlayerSpawnConfig = {
  readonly textureKey: string;
  readonly spawn: { readonly x: number; readonly y: number };
  readonly physicsBody: PlayerPhysicsBodyConfig;
  readonly movement: PlayerMovementConfig;
};

export const PlayerConfig: PlayerSpawnConfig = {
  textureKey: AssetKeys.PlayerSheet,
  spawn: {
    x: GAME_WIDTH * 0.15,
    y: GAME_HEIGHT * 0.45,
  },
  physicsBody: {
    width: 28,
    height: 44,
    offsetX: 2,
    offsetY: 4,
  },
  movement: {
    groundMaxSpeed: 220,
    groundAcceleration: 2400,
    groundDeceleration: 2800,
    airMaxSpeed: 230,
    airAcceleration: 1100,
    airDeceleration: 700,
    jumpVelocity: -440,
    jumpCutMultiplier: 0.48,
    maxFallSpeed: 560,
    coyoteTimeMs: 120,
    jumpBufferMs: 150,
  },
};
