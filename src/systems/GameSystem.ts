import type { GameContext } from './GameContext';

export interface GameSystem {
  readonly key: string;
  init(context: GameContext): void;
  update?(context: GameContext, time: number, delta: number): void;
  destroy?(context: GameContext): void;
}
