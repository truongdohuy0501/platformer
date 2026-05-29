import { GameDataRegistry } from '../../data/GameDataRegistry';
import { MapLoader } from '../../maps/MapLoader';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class MapLoadSystem implements GameSystem {
  readonly key = 'map-load';

  init({ scene, state }: GameContext): void {
    const level = GameDataRegistry.getDefaultLevel();
    const loadedMap = MapLoader.load(scene, level);

    state.world = {
      loadedMap,
      collisionSystem: null,
    };
  }
}
