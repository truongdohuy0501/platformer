import type { Entity } from './Entity';

/**
 * Contract for spawning reusable game entities (player, enemies, pickups).
 */
export interface EntityFactory<TConfig = unknown> {
  readonly type: string;
  create(scene: Phaser.Scene, config: TConfig): Entity;
}
