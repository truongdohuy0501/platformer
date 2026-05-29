import type Phaser from 'phaser';
import { spawnCollectiblesFromMap } from '../collectibles/spawn-collectibles-from-map';
import type { LevelConfigData } from '../data/types';
import { spawnEnemiesFromMap } from '../enemies/spawn-enemies-from-map';
import { findMapSpawnPoint } from './spawn/find-map-spawn-point';
import { applyTiledLayerOffset } from './tiled/apply-tiled-layer-offset';
import {
  getLayerBooleanProperty,
  layerHasBooleanProperty,
} from './tiled/tiled-layer-properties';
import { setupTilemapLayerCollision } from './tiled/setup-tilemap-collision';
import type { LoadedMap, LoadedTilemapLayer } from './types';

const TILE_SIZE = 32;

/**
 * Loads Tiled JSON maps, tilesets, layers, and data-driven gameplay objects.
 */
export class MapLoader {
  static preload(scene: Phaser.Scene, config: LevelConfigData): void {
    scene.load.tilemapTiledJSON(config.mapKey, config.mapPath);
    scene.load.image(config.tilesetImageKey, config.tilesetImagePath);
  }

  static load(scene: Phaser.Scene, level: LevelConfigData): LoadedMap {
    const map = scene.make.tilemap({ key: level.mapKey });

    configureArcadePhysics(scene, level, map);
    const tileset = map.addTilesetImage(
      level.tilesetName,
      level.tilesetImageKey,
      TILE_SIZE,
      TILE_SIZE,
      0,
      0,
      1,
    );

    if (!tileset) {
      throw new Error(
        `Tileset "${level.tilesetName}" could not be attached to map "${level.mapKey}"`,
      );
    }

    const tileLayers = createTileLayers(map, tileset, level.tileLayerOrder);
    const collisionLayers = collectLayersByProperty(
      tileLayers,
      level.collisionProperty,
    );
    const deadlyLayers = collectLayersByProperty(
      tileLayers,
      level.deadlyProperty,
    );

    applyCollisions(collisionLayers);
    applyDeadlyTileOverlap(collisionLayers, deadlyLayers);

    const collectibles = spawnCollectiblesFromMap(
      scene,
      map,
      tileset,
      level.tilesetImageKey,
      level,
    );

    const enemies = spawnEnemiesFromMap(scene, map, level);

    const spawnPoint = findMapSpawnPoint(map, {
      collisionLayers: collisionLayers.map((entry) => entry.layer),
      deadlyLayers: deadlyLayers.map((entry) => entry.layer),
      spawnLayerName: level.objectLayers.spawn,
      spawnCollisionLayerOrder: level.spawnCollisionLayerOrder,
    });

    return {
      level,
      map,
      tileset,
      tileLayers,
      collisionLayers: collisionLayers.map((entry) => entry.layer),
      deadlyLayers: deadlyLayers.map((entry) => entry.layer),
      collectibles,
      enemies,
      spawnPoint,
      worldWidth: map.widthInPixels,
      worldHeight: map.heightInPixels,
    };
  }

  static configureCamera(
    scene: Phaser.Scene,
    loadedMap: LoadedMap,
    followTarget?: Phaser.GameObjects.GameObject,
  ): void {
    const camera = scene.cameras.main;
    camera.setBounds(0, 0, loadedMap.worldWidth, loadedMap.worldHeight);

    if (followTarget) {
      camera.startFollow(followTarget, true, 0.12, 0.12);
    }
  }
}

function configureArcadePhysics(
  scene: Phaser.Scene,
  level: LevelConfigData,
  map: Phaser.Tilemaps.Tilemap,
): void {
  scene.physics.world.setFPS(60);
  scene.physics.world.TILE_BIAS = 24;
  scene.physics.world.gravity.y = level.gameplay.gravityY;
  scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true);
}

function createTileLayers(
  map: Phaser.Tilemaps.Tilemap,
  tileset: Phaser.Tilemaps.Tileset,
  layerOrder: readonly string[],
): LoadedTilemapLayer[] {
  const layers: LoadedTilemapLayer[] = [];

  layerOrder.forEach((layerName, depth) => {
    const layer = map.createLayer(layerName, tileset, 0, 0);

    if (!layer) {
      throw new Error(`Tile layer "${layerName}" was not found in map`);
    }

    applyTiledLayerOffset(layer);
    layer.setDepth(depth);
    layers.push({ name: layerName, layer });
  });

  return layers;
}

function collectLayersByProperty(
  layers: readonly LoadedTilemapLayer[],
  propertyName: string,
): LoadedTilemapLayer[] {
  return layers.filter(
    (entry) =>
      layerHasBooleanProperty(entry.layer, propertyName) &&
      getLayerBooleanProperty(entry.layer, propertyName),
  );
}

function applyCollisions(layers: readonly LoadedTilemapLayer[]): void {
  for (const entry of layers) {
    setupTilemapLayerCollision(entry.layer, entry.name);
  }
}

function applyDeadlyTileOverlap(
  collisionLayers: readonly LoadedTilemapLayer[],
  deadlyLayers: readonly LoadedTilemapLayer[],
): void {
  const collisionNames = new Set(collisionLayers.map((entry) => entry.name));

  for (const entry of deadlyLayers) {
    if (collisionNames.has(entry.name)) {
      continue;
    }

    setupTilemapLayerCollision(entry.layer, entry.name);
  }
}
