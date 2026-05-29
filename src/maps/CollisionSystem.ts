import type Phaser from 'phaser';
import type { LoadedMap } from './types';

export type DeathContext = {
  readonly layerName: string;
  readonly tile: Phaser.Tilemaps.Tile | null;
};

export type CollisionHandlers = {
  readonly onPlayerDeath: (context: DeathContext) => void;
  readonly onCoinCollect: (coin: Phaser.Physics.Arcade.Sprite) => void;
  readonly canTakeDamage: () => boolean;
};

export type CollisionSetupConfig = {
  readonly scene: Phaser.Scene;
  readonly player: Phaser.Physics.Arcade.Sprite;
  readonly loadedMap: LoadedMap;
  readonly handlers: CollisionHandlers;
};

/**
 * Wires colliders and overlap handlers for tilemap collision, hazards, and coins.
 */
export class CollisionSystem {
  private readonly colliders: Phaser.Physics.Arcade.Collider[] = [];
  private readonly overlaps: Phaser.Physics.Arcade.Collider[] = [];

  setup(config: CollisionSetupConfig): void {
    this.setupCollisionLayers(config);
    this.setupDeadlyLayers(config);
    this.setupCoinOverlaps(config);
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
            return tile !== null && tile.index > 0;
          },
        ),
      );
    }
  }

  private setupCoinOverlaps(config: CollisionSetupConfig): void {
    if (config.loadedMap.coins.getLength() === 0) {
      return;
    }

    this.overlaps.push(
      config.scene.physics.add.overlap(
        config.player,
        config.loadedMap.coins,
        (_player, coinObject) => {
          const coin = coinObject as Phaser.Physics.Arcade.Sprite;

          if (!coin.active) {
            return;
          }

          config.handlers.onCoinCollect(coin);
        },
      ),
    );
  }
}

export function logCollisionSetup(loadedMap: LoadedMap): void {
  console.info('[collision] setup complete', {
    collisionLayers: loadedMap.collisionLayers.map((layer) => layer.layer.name),
    deadlyLayers: loadedMap.deadlyLayers.map((layer) => layer.layer.name),
    spawn: {
      x: loadedMap.spawnPoint.x,
      y: loadedMap.spawnPoint.y,
    },
  });
}
