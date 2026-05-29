import type { AnimationSetConfigData } from '../animations/types';
import { GameDataRegistry } from './GameDataRegistry';
import { gameDataPreload } from './game-data-preload';
import { gameDataPaths } from './game-data-paths';
import { resolveLevelPaths } from './resolve-level-paths';
import type {
  CollectibleConfigData,
  EnemyConfigData,
  GameManifestData,
  LevelConfigData,
  MovementConfigData,
} from './types';

const MANIFEST_CACHE_KEY = 'data-game-manifest';

const cacheKey = {
  movement: (id: string) => `data-movement-${id}`,
  level: (id: string) => `data-level-${id}`,
  collectible: (id: string) => `data-collectible-${id}`,
  enemy: (id: string) => `data-enemy-${id}`,
  animation: (id: string) => `data-animation-${id}`,
} as const;

/** Loads all gameplay JSON in BootScene.preload. */
export function preloadGameData(scene: Phaser.Scene): void {
  scene.load.json(MANIFEST_CACHE_KEY, gameDataPaths.manifest);
  scene.load.json(
    cacheKey.movement(gameDataPreload.movementId),
    gameDataPaths.movement(gameDataPreload.movementId),
  );

  for (const levelId of gameDataPreload.levels) {
    scene.load.json(cacheKey.level(levelId), gameDataPaths.level(levelId));
  }

  for (const collectibleId of gameDataPreload.collectibles) {
    scene.load.json(
      cacheKey.collectible(collectibleId),
      gameDataPaths.collectible(collectibleId),
    );
  }

  for (const enemyId of gameDataPreload.enemies) {
    scene.load.json(cacheKey.enemy(enemyId), gameDataPaths.enemy(enemyId));
  }

  for (const animationId of gameDataPreload.animations) {
    scene.load.json(
      cacheKey.animation(animationId),
      gameDataPaths.animation(animationId),
    );
  }
}

export function initGameDataRegistry(scene: Phaser.Scene): void {
  GameDataRegistry.reset();

  const manifest = getJson<GameManifestData>(scene, MANIFEST_CACHE_KEY);
  GameDataRegistry.setManifest(manifest);

  GameDataRegistry.registerMovement(
    getJson<MovementConfigData>(scene, cacheKey.movement(manifest.movementId)),
  );

  for (const levelId of manifest.levels) {
    GameDataRegistry.registerLevel(
      resolveLevelPaths(getJson<LevelConfigData>(scene, cacheKey.level(levelId))),
    );
  }

  for (const collectibleId of manifest.collectibles) {
    GameDataRegistry.registerCollectible(
      getJson<CollectibleConfigData>(scene, cacheKey.collectible(collectibleId)),
    );
  }

  for (const enemyId of manifest.enemies) {
    GameDataRegistry.registerEnemy(
      getJson<EnemyConfigData>(scene, cacheKey.enemy(enemyId)),
    );
  }

  for (const animationId of manifest.animations) {
    GameDataRegistry.registerAnimation(
      getJson<AnimationSetConfigData>(scene, cacheKey.animation(animationId)),
    );
  }
}

function getJson<T>(scene: Phaser.Scene, key: string): T {
  if (!scene.cache.json.exists(key)) {
    throw new Error(`JSON cache key "${key}" was not loaded in BootScene`);
  }

  return scene.cache.json.get(key) as T;
}
