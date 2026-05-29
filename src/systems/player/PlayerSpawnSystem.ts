import { MapLoader } from '../../maps/MapLoader';
import { PlayerConfig } from '../../config/player.config';
import { Player } from '../../entities/Player';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class PlayerSpawnSystem implements GameSystem {
  readonly key = 'player-spawn';

  init({ scene, state }: GameContext): void {
    const spawnPoint = state.world?.loadedMap.spawnPoint;

    if (!spawnPoint) {
      throw new Error('Cannot spawn player before the level map is loaded');
    }

    const player = new Player(scene, {
      ...PlayerConfig,
      spawn: {
        x: spawnPoint.x,
        y: spawnPoint.y,
      },
    });

    state.player = player;

    if (state.world) {
      MapLoader.configureCamera(scene, state.world.loadedMap, player.sprite);
    }
  }

  destroy({ state }: GameContext): void {
    state.player?.destroy();
    state.player = null;
  }
}
