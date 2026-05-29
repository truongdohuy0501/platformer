import { registerPlaceholderTextures } from '../../assets/generate-placeholder-textures';
import { MapLoader } from '../../maps/MapLoader';
import { Level1Config } from '../../maps/levels/level1.config';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class MapLoadSystem implements GameSystem {
  readonly key = 'map-load';

  init({ scene, state }: GameContext): void {
    registerPlaceholderTextures(scene);

    const loadedMap = MapLoader.load(scene, Level1Config);

    state.world = {
      loadedMap,
      collisionSystem: null,
    };
  }
}
