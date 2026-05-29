import { gameAnimations, registerAnimations } from '../animations';
import type { GameContext } from './GameContext';
import type { GameSystem } from './GameSystem';

export class AnimationSystem implements GameSystem {
  readonly key = 'animations';

  init({ scene }: GameContext): void {
    registerAnimations(scene, gameAnimations);
  }
}
