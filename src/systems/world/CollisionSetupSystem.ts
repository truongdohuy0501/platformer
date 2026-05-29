import {
  CollisionSystem,
  logCollisionSetup,
} from '../../maps/CollisionSystem';
import { snapPlayerToGround } from '../../maps/spawn/snap-player-to-ground';
import {
  logCollisionDebug,
  logDeathTrigger,
  readCollisionDebugState,
} from '../../maps/collision-debug';
import { DEBUG_COLLISION } from '../../config/debug.config';
import type { DeathContext } from '../../maps/CollisionSystem';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';

const RESPAWN_INVINCIBILITY_MS = 1200;

export class CollisionSetupSystem implements GameSystem {
  readonly key = 'collision';

  init({ scene, state }: GameContext): void {
    const player = state.player;
    const world = state.world;

    if (!player || !world) {
      return;
    }

    logCollisionSetup(world.loadedMap);

    const collisionSystem = new CollisionSystem();

    collisionSystem.setup({
      scene,
      player: player.sprite,
      loadedMap: world.loadedMap,
      handlers: {
        canTakeDamage: () => !state.isRespawning,
        onPlayerDeath: (context) => handlePlayerDeath(scene, state, context),
        onCoinCollect: (coin) => handleCoinCollect(state, coin),
      },
    });

    world.collisionSystem = collisionSystem;

    snapPlayerToGround(scene, player.sprite);

    if (DEBUG_COLLISION) {
      const body = player.sprite.body as Phaser.Physics.Arcade.Body;
      console.info('[spawn] after collision + snap', {
        x: player.sprite.x,
        y: player.sprite.y,
        blockedDown: body.blocked.down,
        velocityY: body.velocity.y,
      });
    }
  }

  update({ state }: GameContext): void {
    if (!DEBUG_COLLISION || !state.player) {
      return;
    }

    logCollisionDebug(state.player.sprite, 'update');
  }

  destroy({ state }: GameContext): void {
    state.world?.collisionSystem?.destroy();

    if (state.world) {
      state.world.collisionSystem = null;
    }
  }
}

function handlePlayerDeath(
  scene: Phaser.Scene,
  state: GameContext['state'],
  context: DeathContext,
): void {
  const player = state.player;
  const spawnPoint = state.world?.loadedMap.spawnPoint;

  if (!player || !spawnPoint || state.isRespawning) {
    return;
  }

  const body = player.sprite.body as Phaser.Physics.Arcade.Body;
  const collisionState = readCollisionDebugState(player.sprite);

  logDeathTrigger('hazard-overlap', {
    layer: context.layerName,
    tileIndex: context.tile?.index ?? null,
    playerPosition: { x: player.sprite.x, y: player.sprite.y },
    velocity: { x: body.velocity.x, y: body.velocity.y },
    blockedDown: collisionState.blockedDown,
    falling: collisionState.falling,
    grounded: collisionState.grounded,
  });

  state.isRespawning = true;
  player.sprite.setVelocity(0, 0);
  player.sprite.setPosition(spawnPoint.x, spawnPoint.y);

  scene.time.delayedCall(RESPAWN_INVINCIBILITY_MS, () => {
    state.isRespawning = false;

    if (DEBUG_COLLISION) {
      logCollisionDebug(player.sprite, 'respawn-complete');
    }
  });
}

function handleCoinCollect(
  state: GameContext['state'],
  coin: Phaser.Physics.Arcade.Sprite,
): void {
  coin.disableBody(true, true);
  coin.setVisible(false);
  state.score += 1;
}
