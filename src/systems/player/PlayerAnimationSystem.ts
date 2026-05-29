import { PlayerAnimationController } from '../../animations/player/PlayerAnimationController';
import { GameDataRegistry } from '../../data/GameDataRegistry';
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
      const animationSet = GameDataRegistry.getPlayerAnimation();
      this.controller = new PlayerAnimationController(player.sprite, animationSet);
    }

    this.controller.update(player.sprite);
  }

  destroy(): void {
    this.controller = null;
  }
}
