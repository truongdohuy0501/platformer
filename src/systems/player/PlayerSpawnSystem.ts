import { GameDataRegistry } from '../../data/GameDataRegistry';
import { MapLoader } from '../../maps/MapLoader';
import { Player } from '../../entities/Player';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

export class PlayerSpawnSystem implements GameSystem {
  readonly key = 'player-spawn';

  init({ scene, state }: GameContext): void {
    const spawnPoint = state.world?.loadedMap.spawnPoint;
    const movement = GameDataRegistry.getMovement();
    const animation = GameDataRegistry.getPlayerAnimation();

    if (!spawnPoint) {
      throw new Error('Cannot spawn player before the level map is loaded');
    }

    const player = new Player(scene, {
      textureKey: movement.textureKey,
      defaultFrame: animation.defaultFrame,
      displaySize: movement.displaySize,
      spawn: { x: spawnPoint.x, y: spawnPoint.y },
      physicsBody: movement.physicsBody,
      movement: movement.movement,
    });

    console.info('[spawn] player feet at', spawnPoint.x, spawnPoint.y);

    state.player = player;

    if (state.world) {
      MapLoader.configureCamera(scene, state.world.loadedMap, player.sprite);
      scene.cameras.main.centerOn(player.sprite.x, player.sprite.y - 120);
    }
  }

  destroy({ state }: GameContext): void {
    state.player?.destroy();
    state.player = null;
  }
}
