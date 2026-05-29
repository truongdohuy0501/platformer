import type Phaser from 'phaser';
import { GameDataRegistry } from '../data/GameDataRegistry';
import type { LoadedMap } from './types';

export type DeathContext = {
  readonly layerName: string;
  readonly tile: Phaser.Tilemaps.Tile | null;
};

export type CollisionHandlers = {
  readonly onPlayerDeath: (context: DeathContext) => void;
  readonly onCoinCollect: (coin: Phaser.Physics.Arcade.Sprite) => void;
  readonly onEnemyHitPlayer: (enemyId: string) => void;
  readonly canTakeDamage: () => boolean;
};

export type CollisionSetupConfig = {
  readonly scene: Phaser.Scene;
  readonly player: Phaser.Physics.Arcade.Sprite;
  readonly loadedMap: LoadedMap;
  readonly handlers: CollisionHandlers;
};

/**
 * Wires colliders and overlap handlers for tilemap collision, hazards, and collectibles.
 */
export class CollisionSystem {
  private readonly colliders: Phaser.Physics.Arcade.Collider[] = [];
  private readonly overlaps: Phaser.Physics.Arcade.Collider[] = [];

  setup(config: CollisionSetupConfig): void {
    this.setupCollisionLayers(config);
    this.setupDeadlyLayers(config);
    this.setupCollectibleOverlaps(config);
    this.setupEnemyOverlaps(config);
  }

  destroy(): void {
    for (const collider of this.colliders) {
      collider.destroy();
    }

    for (const overlap of this.overlaps) {
      overlap.destroy();
    }

    this.colliders.length = 0;
    this.overlaps.length = 0;
  }

  private setupCollisionLayers(config: CollisionSetupConfig): void {
    for (const layer of config.loadedMap.collisionLayers) {
      this.colliders.push(
        config.scene.physics.add.collider(config.player, layer),
      );
    }

    for (const enemy of config.loadedMap.enemies) {
      for (const layer of config.loadedMap.collisionLayers) {
        this.colliders.push(
          config.scene.physics.add.collider(enemy.sprite, layer),
        );
      }
    }
  }

  private setupDeadlyLayers(config: CollisionSetupConfig): void {
    for (const layer of config.loadedMap.deadlyLayers) {
      const layerName = layer.layer.name;

      this.overlaps.push(
        config.scene.physics.add.overlap(
          config.player,
          layer,
          (_player, hazardousTile) => {
            const tile = hazardousTile as Phaser.Tilemaps.Tile | null;

            if (!tile || !config.handlers.canTakeDamage()) {
              return;
            }

            config.handlers.onPlayerDeath({
              layerName,
              tile,
            });
          },
          (_player, hazardousTile) => {
            if (!config.handlers.canTakeDamage()) {
              return false;
            }

            const tile = hazardousTile as Phaser.Tilemaps.Tile | null;

            if (!tile || tile.index <= 0) {
              return false;
            }

            const player = _player as Phaser.Physics.Arcade.Sprite;
            const body = player.body as Phaser.Physics.Arcade.Body;

            // Water/land often share cells — only damage when not standing on solid ground.
            return !body.blocked.down;
          },
        ),
      );
    }
  }

  private setupCollectibleOverlaps(config: CollisionSetupConfig): void {
    const group = config.loadedMap.collectibles.group;

    if (group.getLength() === 0) {
      return;
    }

    this.overlaps.push(
      config.scene.physics.add.overlap(
        config.player,
        group,
        (_player, collectibleObject) => {
          const sprite = collectibleObject as Phaser.Physics.Arcade.Sprite;

          if (!sprite.active) {
            return;
          }

          config.handlers.onCoinCollect(sprite);
        },
      ),
    );
  }

  private setupEnemyOverlaps(config: CollisionSetupConfig): void {
    for (const enemy of config.loadedMap.enemies) {
      const enemyConfig = GameDataRegistry.tryGetEnemy(enemy.id);

      if (!enemyConfig?.contact.damagesPlayer) {
        continue;
      }

      this.overlaps.push(
        config.scene.physics.add.overlap(
          config.player,
          enemy.sprite,
          () => {
            if (!config.handlers.canTakeDamage()) {
              return;
            }

            config.handlers.onEnemyHitPlayer(enemy.id);
          },
        ),
      );
    }
  }
}

export function logCollisionSetup(loadedMap: LoadedMap): void {
  console.info('[collision] setup complete', {
    spawn: {
      x: loadedMap.spawnPoint.x,
      y: loadedMap.spawnPoint.y,
    },
    collisionLayers: loadedMap.collisionLayers.map((layer) => layer.layer.name),
    deadlyLayers: loadedMap.deadlyLayers.map((layer) => layer.layer.name),
    collectibles: loadedMap.collectibles.instances.length,
    enemies: loadedMap.enemies.length,
  });
}
