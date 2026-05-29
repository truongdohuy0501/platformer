import Phaser from 'phaser';
import { DEBUG_COLLISION } from '../../config/debug.config';

type SpawnObject = Phaser.Types.Tilemaps.TiledObject & {
  readonly type?: string;
  readonly name?: string;
};

export type SpawnSearchConfig = {
  readonly collisionLayers: readonly Phaser.Tilemaps.TilemapLayer[];
  readonly deadlyLayers: readonly Phaser.Tilemaps.TilemapLayer[];
  readonly spawnLayerName?: string;
  /** Layers scanned in order for platform spawn (topmost solid in left half). */
  readonly spawnCollisionLayerOrder: readonly string[];
};

/**
 * Resolves spawn from Tiled object layer, or a safe point with feet on solid tiles.
 * Positions assume sprite origin (0.5, 1) — y is the feet.
 */
export function findMapSpawnPoint(
  map: Phaser.Tilemaps.Tilemap,
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 {
  const objectSpawn = findSpawnFromObjectLayer(map, config);

  if (objectSpawn && isSpawnSafe(config.deadlyLayers, objectSpawn)) {
    logSpawnChoice('object-layer', objectSpawn);
    return objectSpawn;
  }

  const platformSpawn = findSpawnFromPlatforms(config);

  if (platformSpawn) {
    logSpawnChoice('platform-tile', platformSpawn);
    return platformSpawn;
  }

  const fallback = new Phaser.Math.Vector2(map.tileWidth * 2, map.tileHeight * 3);
  logSpawnChoice('fallback', fallback);
  return fallback;
}

function findSpawnFromObjectLayer(
  map: Phaser.Tilemaps.Tilemap,
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 | null {
  if (!config.spawnLayerName) {
    return null;
  }

  const layer = map.getObjectLayer(config.spawnLayerName);

  if (!layer?.objects?.length) {
    return null;
  }

  const spawnObject = layer.objects.find((object) => isSpawnObject(object));

  if (!spawnObject || spawnObject.x === undefined || spawnObject.y === undefined) {
    return null;
  }

  const width = spawnObject.width ?? map.tileWidth;

  return new Phaser.Math.Vector2(
    spawnObject.x + width / 2,
    spawnObject.y,
  );
}

function isSpawnObject(object: SpawnObject): boolean {
  const normalizedType = object.type?.toLowerCase();
  const normalizedName = object.name?.toLowerCase();

  return (
    normalizedType === 'spawn' ||
    normalizedName === 'spawn' ||
    normalizedName === 'player'
  );
}

function findSpawnFromPlatforms(
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 | null {
  const layerByName = new Map(
    config.collisionLayers.map((layer) => [layer.layer.name, layer]),
  );

  for (const layerName of config.spawnCollisionLayerOrder) {
    const tilemapLayer = layerByName.get(layerName);

    if (!tilemapLayer) {
      continue;
    }

    const spawn = findHighestSolidTileSpawn(tilemapLayer, config);

    if (spawn) {
      return spawn;
    }
  }

  return null;
}

/**
 * Finds the topmost solid tile in the left half of the map and spawns feet on its surface.
 */
function findHighestSolidTileSpawn(
  tilemapLayer: Phaser.Tilemaps.TilemapLayer,
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 | null {
  const map = tilemapLayer.tilemap;
  const searchColumns = Math.max(1, Math.floor(map.width / 2));

  for (let tileY = 0; tileY < map.height; tileY += 1) {
    for (let tileX = 0; tileX < searchColumns; tileX += 1) {
      const tile = tilemapLayer.getTileAt(tileX, tileY);

      if (!tile || tile.index <= 0) {
        continue;
      }

      const feetX = tile.getCenterX();
      const feetY = tile.getTop();
      const spawn = new Phaser.Math.Vector2(feetX, feetY);

      if (isSpawnSafe(config.deadlyLayers, spawn)) {
        return spawn;
      }
    }
  }

  return null;
}

function isSpawnSafe(
  deadlyLayers: readonly Phaser.Tilemaps.TilemapLayer[],
  feetPosition: Phaser.Math.Vector2,
): boolean {
  for (const layer of deadlyLayers) {
    const tile = layer.getTileAtWorldXY(feetPosition.x, feetPosition.y - 1, true);

    if (tile && tile.index > 0) {
      return false;
    }
  }

  return true;
}

function logSpawnChoice(
  source: string,
  position: Phaser.Math.Vector2,
): void {
  if (!DEBUG_COLLISION) {
    return;
  }

  console.info(`[spawn] chosen (${source})`, {
    x: position.x,
    y: position.y,
  });
}
