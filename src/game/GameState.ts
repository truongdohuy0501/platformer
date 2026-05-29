import type { LoadedMap } from '../maps/types';
import type { CollisionSystem } from '../maps/CollisionSystem';
import type { Player } from '../entities/Player';
import type { TouchControlsUI } from '../ui/touch/TouchControlsUI';
import { createMovementInput, type MovementInput } from '../input/MovementInput';

export type WorldState = {
  readonly loadedMap: LoadedMap;
  collisionSystem: CollisionSystem | null;
};

export class GameState {
  player: Player | null = null;
  world: WorldState | null = null;
  touchControls: TouchControlsUI | null = null;
  input: MovementInput = createMovementInput();
  score = 0;
  isRespawning = false;

  reset(): void {
    this.player = null;
    this.world = null;
    this.touchControls = null;
    this.input = createMovementInput();
    this.score = 0;
    this.isRespawning = false;
  }
}
