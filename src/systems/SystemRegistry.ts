import { createGameContext, type GameContext } from './GameContext';
import type { GameSystem } from './GameSystem';

export class SystemRegistry {
  private readonly systems: GameSystem[] = [];
  private context: GameContext | null = null;

  register(system: GameSystem): this {
    if (this.systems.some((existing) => existing.key === system.key)) {
      throw new Error(`Duplicate system key: "${system.key}"`);
    }

    this.systems.push(system);
    return this;
  }

  init(scene: Phaser.Scene): void {
    this.context = createGameContext(scene);

    for (const system of this.systems) {
      system.init(this.context);
    }
  }

  update(time: number, delta: number): void {
    if (!this.context) {
      return;
    }

    for (const system of this.systems) {
      system.update?.(this.context, time, delta);
    }
  }

  destroy(): void {
    const context = this.context;

    if (context) {
      for (const system of this.systems) {
        system.destroy?.(context);
      }
    }

    this.systems.length = 0;
    this.context = null;
  }
}
