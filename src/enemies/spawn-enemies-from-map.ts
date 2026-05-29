import { GameDataRegistry } from '../data/GameDataRegistry';
import { resolveTiledObjectType } from '../data/resolve-tiled-object-type';
import type { LevelConfigData } from '../data/types';
import { Enemy } from './Enemy';

export function spawnEnemiesFromMap(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  levelConfig: LevelConfigData,
): Enemy[] {
  const spawnConfig = levelConfig.enemySpawns;
  const objectLayer = map.getObjectLayer(spawnConfig.objectLayer);

  if (!objectLayer?.objects?.length) {
    return [];
  }

  const enemies: Enemy[] = [];

  for (const object of objectLayer.objects) {
    const enemyId = resolveTiledObjectType(object, spawnConfig);

    if (!enemyId) {
      continue;
    }

    const definition = GameDataRegistry.tryGetEnemy(enemyId);

    if (!definition) {
      console.warn(`[enemies] unknown type "${enemyId}" in Tiled object ${object.id}`);
      continue;
    }

    const width = object.width ?? map.tileWidth;
    const height = object.height ?? map.tileHeight;
    const x = (object.x ?? 0) + width / 2;
    const y = (object.y ?? 0) - height / 2;

    enemies.push(new Enemy(scene, definition, x, y));
  }

  return enemies;
}
