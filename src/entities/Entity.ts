/**
 * Lifecycle handle for a spawned gameplay object (player, enemy, pickup).
 * Wrap Phaser game objects; do not extend Phaser classes here.
 */
export interface Entity {
  readonly id: string;
  destroy(): void;
}
