import { AssetKeys } from './asset-keys';
import { GAME_HEIGHT, GAME_WIDTH } from './game.config';

export type PlatformDefinition = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export const WorldConfig = {
  platformTextureKey: AssetKeys.Platform,
  platforms: [
    { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 24, width: GAME_WIDTH, height: 48 },
    { x: 320, y: 520, width: 220, height: 28 },
    { x: 880, y: 400, width: 200, height: 28 },
    { x: 560, y: 300, width: 160, height: 28 },
  ] satisfies readonly PlatformDefinition[],
} as const;
