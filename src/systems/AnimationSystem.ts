import { registerAllGameAnimations } from '../animations/register-all-game-animations';
import type { GameContext } from './GameContext';
import type { GameSystem } from './GameSystem';

export class AnimationSystem implements GameSystem {
  readonly key = 'animations';

  init({ scene }: GameContext): void {
    registerAllGameAnimations(scene);
  }
}
