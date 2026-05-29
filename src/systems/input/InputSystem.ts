import {
  createKeyboardBindings,
  readMovementInput,
  type KeyboardInputBindings,
} from '../../input/keyboard-input';
import { mergeMovementInput } from '../../input/merge-movement-input';
import { createMovementInput } from '../../input/MovementInput';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class InputSystem implements GameSystem {
  readonly key = 'input';

  private bindings: KeyboardInputBindings | null = null;

  init({ scene }: GameContext): void {
    this.bindings = createKeyboardBindings(scene);
  }

  update({ state }: GameContext): void {
    const keyboardInput = this.bindings
      ? readMovementInput(this.bindings)
      : createMovementInput();

    const touchInput =
      state.touchControls?.getMovementInput() ?? createMovementInput();

    state.input = mergeMovementInput(keyboardInput, touchInput);
  }

  destroy(): void {
    this.bindings = null;
  }
}
