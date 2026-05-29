import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class EnemySystem implements GameSystem {
  readonly key = 'enemies';

  init(): void {
    // Enemies are spawned during map load.
  }

  update({ state }: GameContext): void {
    for (const enemy of state.enemies) {
      enemy.update();
    }
  }

  destroy({ state }: GameContext): void {
    for (const enemy of state.enemies) {
      enemy.destroy();
    }
  }
}
