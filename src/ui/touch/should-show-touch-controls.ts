import { TouchControlsConfig } from './touch-controls.config';

export function shouldShowTouchControls(game: Phaser.Game): boolean {
  if (!TouchControlsConfig.enabled) {
    return false;
  }

  if (TouchControlsConfig.forceShow) {
    return true;
  }

  return game.device.input.touch;
}
