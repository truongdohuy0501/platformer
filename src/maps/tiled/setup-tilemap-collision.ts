import { DEBUG_COLLISION } from '../../config/debug.config';

export function setupTilemapLayerCollision(
  layer: Phaser.Tilemaps.TilemapLayer,
  layerName: string,
): number {
  layer.setCollisionByExclusion([-1, 0], true);

  const collidingTileCount = countCollidingTiles(layer);

  if (DEBUG_COLLISION) {
    console.info(
      `[collision] layer "${layerName}": ${collidingTileCount} colliding tiles`,
    );
  }

  if (collidingTileCount === 0) {
    console.warn(`[collision] layer "${layerName}" has zero colliding tiles`);
  }

  return collidingTileCount;
}

function countCollidingTiles(layer: Phaser.Tilemaps.TilemapLayer): number {
  let count = 0;

  layer.forEachTile((tile) => {
    if (tile.collides) {
      count += 1;
    }
  });

  return count;
}
