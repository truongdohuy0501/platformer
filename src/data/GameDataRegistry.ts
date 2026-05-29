import type { AnimationSetConfigData } from '../animations/types';
import type {
  CollectibleConfigData,
  EnemyConfigData,
  GameManifestData,
  LevelConfigData,
  MovementConfigData,
} from './types';

export class GameDataRegistry {
  private static manifest: GameManifestData | null = null;
  private static movement = new Map<string, MovementConfigData>();
  private static levels = new Map<string, LevelConfigData>();
  private static collectibles = new Map<string, CollectibleConfigData>();
  private static enemies = new Map<string, EnemyConfigData>();
  private static animations = new Map<string, AnimationSetConfigData>();

  static reset(): void {
    this.manifest = null;
    this.movement.clear();
    this.levels.clear();
    this.collectibles.clear();
    this.enemies.clear();
    this.animations.clear();
  }

  static setManifest(manifest: GameManifestData): void {
    this.manifest = manifest;
  }

  static registerMovement(config: MovementConfigData): void {
    this.movement.set(config.id, config);
  }

  static registerLevel(config: LevelConfigData): void {
    this.levels.set(config.id, config);
  }

  static registerCollectible(config: CollectibleConfigData): void {
    this.collectibles.set(config.id, config);
  }

  static registerEnemy(config: EnemyConfigData): void {
    this.enemies.set(config.id, config);
  }

  static registerAnimation(config: AnimationSetConfigData): void {
    this.animations.set(config.id, config);
  }

  static getManifest(): GameManifestData {
    return this.require(this.manifest, 'game manifest');
  }

  static getDefaultLevel(): LevelConfigData {
    const manifest = this.getManifest();
    return this.getLevel(manifest.defaultLevelId);
  }

  static getMovement(id?: string): MovementConfigData {
    const movementId = id ?? this.getManifest().movementId;
    return this.require(this.movement.get(movementId), `movement "${movementId}"`);
  }

  static getPlayerAnimation(id?: string): AnimationSetConfigData {
    const animationId = id ?? this.getManifest().playerAnimationId;
    return this.getAnimation(animationId);
  }

  static getAnimation(id: string): AnimationSetConfigData {
    return this.require(this.animations.get(id), `animation "${id}"`);
  }

  static getLevel(id: string): LevelConfigData {
    return this.require(this.levels.get(id), `level "${id}"`);
  }

  static getCollectible(id: string): CollectibleConfigData {
    return this.require(this.collectibles.get(id), `collectible "${id}"`);
  }

  static getEnemy(id: string): EnemyConfigData {
    return this.require(this.enemies.get(id), `enemy "${id}"`);
  }

  static tryGetCollectible(id: string): CollectibleConfigData | null {
    return this.collectibles.get(id) ?? null;
  }

  static tryGetEnemy(id: string): EnemyConfigData | null {
    return this.enemies.get(id) ?? null;
  }

  private static require<T>(value: T | null | undefined, label: string): T {
    if (value === null || value === undefined) {
      throw new Error(`Missing game data config: ${label}`);
    }

    return value;
  }
}
