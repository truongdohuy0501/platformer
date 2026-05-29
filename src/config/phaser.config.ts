import Phaser from 'phaser';
import { gameScenes } from '../scenes/scene-list';
import {
  GAME_BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH,
  PhysicsConfig,
  RenderConfig,
  ScaleConfig,
} from './game.config';
import { InputConfig } from './input.config';

export const GAME_CONTAINER_ID = 'game-container';

export function createPhaserConfig(
  parent: HTMLElement,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: GAME_BACKGROUND_COLOR,
    pixelArt: RenderConfig.pixelArt,
    antialias: RenderConfig.antialias,
    roundPixels: RenderConfig.roundPixels,
    scale: ScaleConfig,
    physics: PhysicsConfig,
    input: {
      activePointers: InputConfig.activePointers,
      touch: {
        capture: InputConfig.touch.capture,
      },
    },
    scene: [...gameScenes],
  };
}
