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
  readonly spawnCollisionLayerOrder: readonly string[];
};

/**
 * Resolves spawn from Tiled object layer, or feet on a walkable tile surface.
 * Positions assume sprite origin (0.5, 1) — y is the feet on top of the tile.
 */
export function findMapSpawnPoint(
  map: Phaser.Tilemaps.Tilemap,
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 {
  const objectSpawn = findSpawnFromObjectLayer(map, config);

  if (objectSpawn && hasSolidGroundAtFeet(config.collisionLayers, objectSpawn)) {
    logSpawnChoice('object-layer', objectSpawn);
    return objectSpawn;
  }

  const platformSpawn = findSpawnFromPlatforms(config);

  if (platformSpawn) {
    logSpawnChoice('platform-surface', platformSpawn);
    return platformSpawn;
  }

  const fallback = findSpawnSurfaceAnywhere(config);

  if (fallback) {
    logSpawnChoice('fallback-surface', fallback);
    return fallback;
  }

  const lastResort = new Phaser.Math.Vector2(
    map.widthInPixels * 0.25,
    map.heightInPixels - map.tileHeight,
  );
  logSpawnChoice('last-resort', lastResort);
  return lastResort;
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
    spawnObject.y + (spawnObject.height ?? 0),
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

    const spawn = findSpawnSurfaceInLayer(tilemapLayer, config);

    if (spawn) {
      return spawn;
    }
  }

  return null;
}

/**
 * First walkable surface scanning columns left → right (level start at x ≈ 16).
 * Within each column, uses the lowest surface tile (top of a stack).
 */
function findSpawnSurfaceInLayer(
  tilemapLayer: Phaser.Tilemaps.TilemapLayer,
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 | null {
  const map = tilemapLayer.tilemap;
  const searchColumns = Math.max(1, Math.floor(map.width / 2));

  for (let tileX = 0; tileX < searchColumns; tileX += 1) {
    const spawn = findSurfaceInColumn(tilemapLayer, tileX, config);

    if (spawn) {
      return spawn;
    }
  }

  return null;
}

/** Lowest surface tile in one column (feet on top of land, not inside the stack). */
function findSurfaceInColumn(
  layer: Phaser.Tilemaps.TilemapLayer,
  tileX: number,
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 | null {
  const map = layer.tilemap;
  let bestSpawn: Phaser.Math.Vector2 | null = null;
  let bestFeetY = -1;

  for (let tileY = 0; tileY < map.height; tileY += 1) {
    if (!isSurfaceTile(layer, tileX, tileY)) {
      continue;
    }

    const spawn = feetOnTileSurface(layer, tileX, tileY);

    if (!spawn || !hasSolidGroundAtFeet(config.collisionLayers, spawn)) {
      continue;
    }

    if (spawn.y > bestFeetY) {
      bestFeetY = spawn.y;
      bestSpawn = spawn;
    }
  }

  return bestSpawn;
}

function findSpawnSurfaceAnywhere(
  config: SpawnSearchConfig,
): Phaser.Math.Vector2 | null {
  let bestSpawn: Phaser.Math.Vector2 | null = null;
  let bestFeetY = -1;

  for (const layer of config.collisionLayers) {
    const map = layer.tilemap;

    for (let tileX = 0; tileX < map.width; tileX += 1) {
      for (let tileY = 0; tileY < map.height; tileY += 1) {
        if (!isSurfaceTile(layer, tileX, tileY)) {
          continue;
        }

        const spawn = feetOnTileSurface(layer, tileX, tileY);

        if (!spawn || !hasSolidGroundAtFeet(config.collisionLayers, spawn)) {
          continue;
        }

        if (spawn.y > bestFeetY) {
          bestFeetY = spawn.y;
          bestSpawn = spawn;
        }
      }
    }
  }

  return bestSpawn;
}

/** Solid tile with no solid tile directly above — the block you stand on. */
function isSurfaceTile(
  layer: Phaser.Tilemaps.TilemapLayer,
  tileX: number,
  tileY: number,
): boolean {
  const tile = layer.getTileAt(tileX, tileY);

  if (!tile || tile.index <= 0 || !tile.collides) {
    return false;
  }

  if (tileY === 0) {
    return true;
  }

  const above = layer.getTileAt(tileX, tileY - 1);

  return !above || above.index <= 0;
}

/**
 * World position for feet on top of a surface tile (uses layer offsets).
 */
function feetOnTileSurface(
  layer: Phaser.Tilemaps.TilemapLayer,
  tileX: number,
  tileY: number,
): Phaser.Math.Vector2 | null {
  const tile = layer.getTileAt(tileX, tileY);

  if (!tile || tile.index <= 0 || !tile.collides) {
    return null;
  }

  const world = layer.tileToWorldXY(tileX, tileY);

  if (!world) {
    return null;
  }

  const tileWidth = layer.tilemap.tileWidth;

  return new Phaser.Math.Vector2(world.x + tileWidth * 0.5, world.y);
}

function hasSolidGroundAtFeet(
  collisionLayers: readonly Phaser.Tilemaps.TilemapLayer[],
  feetPosition: Phaser.Math.Vector2,
): boolean {
  for (const layer of collisionLayers) {
    const tile = layer.getTileAtWorldXY(
      feetPosition.x,
      feetPosition.y + 1,
      true,
    );

    if (tile && tile.index > 0 && tile.collides) {
      return true;
    }
  }

  return false;
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
