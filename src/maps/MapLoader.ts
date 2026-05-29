import type Phaser from 'phaser';
import { DEBUG_COLLISION } from '../config/debug.config';
import { createCoinGroup } from './objects/create-coin-group';
import { findMapSpawnPoint } from './spawn/find-map-spawn-point';
import { applyTiledLayerOffset } from './tiled/apply-tiled-layer-offset';
import {
  getLayerBooleanProperty,
  layerHasBooleanProperty,
} from './tiled/tiled-layer-properties';
import { setupTilemapLayerCollision } from './tiled/setup-tilemap-collision';
import type { LevelLoadConfig, LoadedMap, LoadedTilemapLayer } from './types';

const TILE_SIZE = 32;

/**
 * Loads Tiled JSON maps, tilesets, layers, coins, and spawn metadata.
 */
export class MapLoader {
  static preload(scene: Phaser.Scene, config: LevelLoadConfig): void {
    scene.load.tilemapTiledJSON(config.mapKey, config.mapPath);
    scene.load.image(config.tilesetImageKey, config.tilesetImagePath);
  }

  static load(scene: Phaser.Scene, config: LevelLoadConfig): LoadedMap {
    configureArcadePhysics(scene);

    const map = scene.make.tilemap({ key: config.mapKey });
    const tileset = map.addTilesetImage(
      config.tilesetName,
      config.tilesetImageKey,
      TILE_SIZE,
      TILE_SIZE,
      0,
      0,
      1,
    );

    if (!tileset) {
      throw new Error(
        `Tileset "${config.tilesetName}" could not be attached to map "${config.mapKey}"`,
      );
    }

    const tileLayers = createTileLayers(map, tileset, config.tileLayerOrder);
    const collisionLayers = collectLayersByProperty(
      tileLayers,
      config.collisionProperty,
    );
    const deadlyLayers = collectLayersByProperty(
      tileLayers,
      config.deadlyProperty,
    );

    applyCollisions(collisionLayers);
    applyDeadlyTileOverlap(collisionLayers, deadlyLayers);

    const coins = createCoinGroup(
      scene,
      map,
      tileset,
      config.objectLayers.coins,
      config.tilesetImageKey,
    );

    const spawnPoint = findMapSpawnPoint(map, {
      collisionLayers: collisionLayers.map((entry) => entry.layer),
      deadlyLayers: deadlyLayers.map((entry) => entry.layer),
      spawnLayerName: config.objectLayers.spawn,
      spawnCollisionLayerOrder: config.spawnCollisionLayerOrder,
    });

    if (DEBUG_COLLISION) {
      console.info('[map] loaded', {
        mapKey: config.mapKey,
        collisionLayers: collisionLayers.map((entry) => entry.name),
        deadlyLayers: deadlyLayers.map((entry) => entry.name),
        spawnPoint: { x: spawnPoint.x, y: spawnPoint.y },
        worldSize: { w: map.widthInPixels, h: map.heightInPixels },
      });
    }

    return {
      map,
      tileset,
      tileLayers,
      collisionLayers: collisionLayers.map((entry) => entry.layer),
      deadlyLayers: deadlyLayers.map((entry) => entry.layer),
      coins,
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

function configureArcadePhysics(scene: Phaser.Scene): void {
  scene.physics.world.setFPS(60);
  scene.physics.world.TILE_BIAS = 24;
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

/** Deadly layers need collision data on tiles for overlap detection, but no solid collider. */
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
