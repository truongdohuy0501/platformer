import { GameState } from '../game/GameState';

/**
 * Shared runtime context passed to systems on init and update.
 */
export type GameContext = {
  readonly scene: Phaser.Scene;
  readonly state: GameState;
};

export function createGameContext(scene: Phaser.Scene): GameContext {
  return { scene, state: new GameState() };
}
