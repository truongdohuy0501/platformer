import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class PlayerMovementSystem implements GameSystem {
  readonly key = 'player-movement';

  init(): void {
    // Player is spawned by PlayerSpawnSystem.
  }

  update({ state }: GameContext, _time: number, delta: number): void {
    const player = state.player;

    if (!player) {
      return;
    }

    player.applyMovement(state.input, delta);
  }
}
