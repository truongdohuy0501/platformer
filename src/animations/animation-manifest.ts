import { AssetKeys } from '../config/asset-keys';
import { PlayerAnimationKeys } from './keys/player-animation-keys';
import type { AnimationDefinition } from './register-animations';

export const gameAnimations: readonly AnimationDefinition[] = [
  {
    key: PlayerAnimationKeys.Idle,
    textureKey: AssetKeys.PlayerSheet,
    frames: { start: 0, end: 1 },
    frameRate: 4,
    repeat: -1,
  },
  {
    key: PlayerAnimationKeys.Run,
    textureKey: AssetKeys.PlayerSheet,
    frames: { start: 2, end: 4 },
    frameRate: 10,
    repeat: -1,
  },
  {
    key: PlayerAnimationKeys.Jump,
    textureKey: AssetKeys.PlayerSheet,
    frames: { start: 5, end: 5 },
    frameRate: 1,
    repeat: 0,
  },
  {
    key: PlayerAnimationKeys.Fall,
    textureKey: AssetKeys.PlayerSheet,
    frames: { start: 6, end: 6 },
    frameRate: 1,
    repeat: 0,
  },
];
