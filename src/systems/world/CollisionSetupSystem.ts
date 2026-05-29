import {
  CollisionSystem,
  logCollisionSetup,
} from '../../maps/CollisionSystem';
import {
  logCollisionDebug,
  logDeathTrigger,
  readCollisionDebugState,
} from '../../maps/collision-debug';
import { GameDataRegistry } from '../../data/GameDataRegistry';
import { DEBUG_COLLISION } from '../../config/debug.config';
import type { DeathContext } from '../../maps/CollisionSystem';
import type { GameContext } from '../GameContext';
import type { GameSystem } from '../GameSystem';
import { alignPlayerOnGround } from '../../entities/align-player-on-ground';
import { snapPlayerToGround } from '../../maps/spawn/snap-player-to-ground';

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
        onCoinCollect: (sprite) => handleCoinCollect(state, sprite),
        onEnemyHitPlayer: (enemyId) => handleEnemyHitPlayer(scene, state, enemyId),
      },
    });

    world.collisionSystem = collisionSystem;

    logSpawnAfterSnap(scene, player.sprite);
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

function logSpawnAfterSnap(
  scene: Phaser.Scene,
  sprite: Phaser.Physics.Arcade.Sprite,
): void {
  snapPlayerToGround(scene, sprite);
  alignPlayerOnGround(sprite);

  if (DEBUG_COLLISION) {
    const body = sprite.body as Phaser.Physics.Arcade.Body;
    console.info('[spawn] after collision + snap', {
      x: sprite.x,
      y: sprite.y,
      blockedDown: body.blocked.down,
      velocityY: body.velocity.y,
    });
  }
}

function getRespawnInvincibilityMs(): number {
  return GameDataRegistry.getDefaultLevel().gameplay.respawnInvincibilityMs;
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

  respawnPlayer(scene, state, spawnPoint);
}

function handleEnemyHitPlayer(
  scene: Phaser.Scene,
  state: GameContext['state'],
  enemyId: string,
): void {
  const spawnPoint = state.world?.loadedMap.spawnPoint;

  if (!state.player || !spawnPoint || state.isRespawning) {
    return;
  }

  logDeathTrigger('enemy-contact', { enemyId });

  respawnPlayer(scene, state, spawnPoint);
}

function respawnPlayer(
  scene: Phaser.Scene,
  state: GameContext['state'],
  spawnPoint: Phaser.Math.Vector2,
): void {
  const player = state.player!;

  state.isRespawning = true;
  player.sprite.setVelocity(0, 0);
  player.sprite.setPosition(spawnPoint.x, spawnPoint.y);

  scene.time.delayedCall(getRespawnInvincibilityMs(), () => {
    state.isRespawning = false;

    if (DEBUG_COLLISION) {
      logCollisionDebug(player.sprite, 'respawn-complete');
    }
  });

  snapPlayerToGround(scene, player.sprite);
  alignPlayerOnGround(player.sprite);
}

function handleCoinCollect(
  state: GameContext['state'],
  sprite: Phaser.Physics.Arcade.Sprite,
): void {
  const collectibleId = sprite.getData('collectibleId') as string | undefined;
  const instance = state.world?.loadedMap.collectibles.instances.find(
    (entry) => entry.sprite === sprite,
  );

  if (instance) {
    instance.collect();
    state.score += instance.definition.scoreValue;
    return;
  }

  if (collectibleId) {
    const definition = GameDataRegistry.getCollectible(collectibleId);
    sprite.disableBody(true, true);
    sprite.setVisible(false);
    state.score += definition.scoreValue;
  }
}
