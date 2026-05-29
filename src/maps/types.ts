import type Phaser from 'phaser';
import type { CollectibleSpawnResult } from '../collectibles/spawn-collectibles-from-map';
import type { LevelConfigData } from '../data/types';
import type { Enemy } from '../enemies/Enemy';

export type { LevelConfigData as LevelLoadConfig };

export type LoadedTilemapLayer = {
  readonly name: string;
  readonly layer: Phaser.Tilemaps.TilemapLayer;
};

export type LoadedMap = {
  readonly level: LevelConfigData;
  readonly map: Phaser.Tilemaps.Tilemap;
  readonly tileset: Phaser.Tilemaps.Tileset;
  readonly tileLayers: readonly LoadedTilemapLayer[];
  readonly collisionLayers: readonly Phaser.Tilemaps.TilemapLayer[];
  readonly deadlyLayers: readonly Phaser.Tilemaps.TilemapLayer[];
  readonly collectibles: CollectibleSpawnResult;
  readonly enemies: readonly Enemy[];
  readonly spawnPoint: Phaser.Math.Vector2;
  readonly worldWidth: number;
  readonly worldHeight: number;
};
