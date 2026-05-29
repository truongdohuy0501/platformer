import { PlayerAnimationController } from '../../animations/player/PlayerAnimationController';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class PlayerAnimationSystem implements GameSystem {
  readonly key = 'player-animation';

  private controller: PlayerAnimationController | null = null;

  init(): void {
    // Animations are registered by AnimationSystem before this runs.
  }

  update({ state }: GameContext): void {
    const player = state.player;

    if (!player) {
      return;
    }

    if (!this.controller) {
      this.controller = new PlayerAnimationController(player.sprite);
    }

    this.controller.update(player.sprite);
  }

  destroy(_context: GameContext): void {
    this.controller = null;
  }
}
