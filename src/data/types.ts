export type MovementConfigData = {
  readonly id: string;
  readonly textureKey: string;
  readonly displaySize?: { readonly width: number; readonly height: number };
  readonly physicsBody: {
    readonly width: number;
    readonly height: number;
    readonly offsetX: number;
    readonly offsetY: number;
  };
  readonly movement: {
    readonly groundMaxSpeed: number;
    readonly groundAcceleration: number;
    readonly groundDeceleration: number;
    readonly airMaxSpeed: number;
    readonly airAcceleration: number;
    readonly airDeceleration: number;
    readonly jumpVelocity: number;
    readonly jumpCutMultiplier: number;
    readonly maxFallSpeed: number;
    readonly coyoteTimeMs: number;
    readonly jumpBufferMs: number;
  };
};

export type CollectibleConfigData = {
  readonly id: string;
  readonly displayName: string;
  readonly scoreValue: number;
  readonly useMapTile: boolean;
  readonly hiddenOnCollect: boolean;
  readonly textureKey?: string;
  readonly frame?: number;
};

export type EnemyBehaviorConfigData =
  | {
      readonly type: 'patrol';
      readonly speed: number;
      readonly patrolDistance: number;
      readonly startDirection: 'left' | 'right';
    };

export type EnemyConfigData = {
  readonly id: string;
  readonly displayName: string;
  readonly sprite: {
    readonly textureKey: string;
    readonly frame: number;
    readonly displayWidth: number;
    readonly displayHeight: number;
  };
  readonly physicsBody: {
    readonly width: number;
    readonly height: number;
    readonly offsetX: number;
    readonly offsetY: number;
  };
  readonly behavior: EnemyBehaviorConfigData;
  readonly contact: {
    readonly damagesPlayer: boolean;
  };
};

export type ObjectSpawnConfigData = {
  readonly objectLayer: string;
  readonly propertyKey: string;
  readonly defaultType?: string;
};

export type LevelConfigData = {
  readonly id: string;
  readonly mapKey: string;
  readonly mapPath: string;
  readonly tilesetName: string;
  readonly tilesetImageKey: string;
  readonly tilesetImagePath: string;
  readonly tileLayerOrder: readonly string[];
  readonly spawnCollisionLayerOrder: readonly string[];
  readonly objectLayers: {
    readonly spawn?: string;
    readonly collectibles?: string;
    readonly enemies?: string;
  };
  readonly collectibleSpawns: ObjectSpawnConfigData;
  readonly enemySpawns: ObjectSpawnConfigData;
  readonly collisionProperty: string;
  readonly deadlyProperty: string;
  readonly gameplay: {
    readonly gravityY: number;
    readonly respawnInvincibilityMs: number;
  };
};

export type { AnimationSetConfigData } from '../animations/types';

export type GameManifestData = {
  readonly defaultLevelId: string;
  readonly movementId: string;
  readonly playerAnimationId: string;
  readonly levels: readonly string[];
  readonly collectibles: readonly string[];
  readonly enemies: readonly string[];
  readonly animations: readonly string[];
};
