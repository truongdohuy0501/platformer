import type Phaser from 'phaser';

export type LoadedTilemapLayer = {
  readonly name: string;
  readonly layer: Phaser.Tilemaps.TilemapLayer;
};

export type LoadedMap = {
  readonly map: Phaser.Tilemaps.Tilemap;
  readonly tileset: Phaser.Tilemaps.Tileset;
  readonly tileLayers: readonly LoadedTilemapLayer[];
  readonly collisionLayers: readonly Phaser.Tilemaps.TilemapLayer[];
  readonly deadlyLayers: readonly Phaser.Tilemaps.TilemapLayer[];
  readonly coins: Phaser.Physics.Arcade.StaticGroup;
  readonly spawnPoint: Phaser.Math.Vector2;
  readonly worldWidth: number;
  readonly worldHeight: number;
};

export type LevelLoadConfig = {
  readonly mapKey: string;
  readonly mapPath: string;
  readonly tilesetName: string;
  readonly tilesetImageKey: string;
  readonly tilesetImagePath: string;
  readonly tileLayerOrder: readonly string[];
  readonly spawnCollisionLayerOrder: readonly string[];
  readonly objectLayers: {
    readonly coins: string;
    readonly spawn?: string;
  };
  readonly collisionProperty: string;
  readonly deadlyProperty: string;
};
