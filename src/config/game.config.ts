import Phaser from 'phaser';
import { DEBUG_PHYSICS_BODY } from './debug.config';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const GAME_BACKGROUND_COLOR = '#1a1a2e';

export const RenderConfig = {
  pixelArt: true,
  antialias: false,
  roundPixels: true,
} as const;

export const ScaleConfig: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
};

/** World gravity (pixels/s²). Tune per game feel. */
export const PLATFORMER_GRAVITY_Y = 300;

export const PhysicsConfig: Phaser.Types.Core.PhysicsConfig = {
  default: 'arcade',
  arcade: {
    gravity: { x: 0, y: PLATFORMER_GRAVITY_Y },
    debug: DEBUG_PHYSICS_BODY,
  },
};
