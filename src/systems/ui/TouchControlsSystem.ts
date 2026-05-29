import { shouldShowTouchControls } from '../../ui/touch/should-show-touch-controls';
import { TouchControlsUI } from '../../ui/touch/TouchControlsUI';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class TouchControlsSystem implements GameSystem {
  readonly key = 'touch-controls';

  private controls: TouchControlsUI | null = null;

  init({ scene, state }: GameContext): void {
    if (!shouldShowTouchControls(scene.sys.game)) {
      return;
    }

    this.controls = new TouchControlsUI(scene);
    state.touchControls = this.controls;
  }

  update({ state }: GameContext): void {
    this.controls?.tick();
    state.touchControls = this.controls;
  }

  destroy({ state }: GameContext): void {
    this.controls?.destroy();
    this.controls = null;
    state.touchControls = null;
  }
}
