import { FullscreenButtonConfig } from '../../ui/fullscreen/fullscreen-button.config';
import { FullscreenButton } from '../../ui/fullscreen/FullscreenButton';
import {
  isFullscreenSupported,
  toggleFullscreen,
} from '../../ui/fullscreen/toggle-fullscreen';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class FullscreenSystem implements GameSystem {
  readonly key = 'fullscreen';

  private button: FullscreenButton | null = null;
  private fullscreenKey: Phaser.Input.Keyboard.Key | null = null;

  init({ scene }: GameContext): void {
    if (!isFullscreenSupported(scene)) {
      return;
    }

    this.button = new FullscreenButton(scene);

    const keyboard = scene.input.keyboard;
    if (keyboard) {
      this.fullscreenKey = keyboard.addKey(FullscreenButtonConfig.keyboardKey);
    }
  }

  update({ scene }: GameContext): void {
    if (
      this.fullscreenKey &&
      Phaser.Input.Keyboard.JustDown(this.fullscreenKey)
    ) {
      toggleFullscreen(scene);
    }
  }

  destroy(): void {
    this.button?.destroy();
    this.button = null;
    this.fullscreenKey = null;
  }
}
