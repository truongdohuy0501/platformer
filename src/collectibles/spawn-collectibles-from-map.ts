import { GameDataRegistry } from '../data/GameDataRegistry';
import { resolveTiledObjectType } from '../data/resolve-tiled-object-type';
import type { LevelConfigData } from '../data/types';
import { Collectible } from './Collectible';

export type CollectibleSpawnResult = {
  readonly group: Phaser.Physics.Arcade.StaticGroup;
  readonly instances: readonly Collectible[];
};

export function spawnCollectiblesFromMap(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  tileset: Phaser.Tilemaps.Tileset,
  tilesetImageKey: string,
  levelConfig: LevelConfigData,
): CollectibleSpawnResult {
  const group = scene.physics.add.staticGroup();
  const instances: Collectible[] = [];
  const spawnConfig = levelConfig.collectibleSpawns;
  const objectLayer = map.getObjectLayer(spawnConfig.objectLayer);

  if (!objectLayer?.objects?.length) {
    return { group, instances };
  }

  for (const object of objectLayer.objects) {
    const collectibleId = resolveTiledObjectType(object, spawnConfig);

    if (!collectibleId) {
      continue;
    }

    const definition = GameDataRegistry.tryGetCollectible(collectibleId);

    if (!definition) {
      console.warn(`[collectibles] unknown type "${collectibleId}" in Tiled object ${object.id}`);
      continue;
    }

    const sprite = createCollectibleSprite(
      scene,
      map,
      tileset,
      tilesetImageKey,
      object,
      definition,
    );

    if (!sprite) {
      continue;
    }

    group.add(sprite);
    instances.push(new Collectible(definition, sprite));
  }

  return { group, instances };
}

function createCollectibleSprite(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  tileset: Phaser.Tilemaps.Tileset,
  tilesetImageKey: string,
  object: Phaser.Types.Tilemaps.TiledObject,
  definition: {
    readonly id: string;
    readonly useMapTile: boolean;
    readonly textureKey?: string;
    readonly frame?: number;
  },
): Phaser.Physics.Arcade.Sprite | null {
  const width = object.width ?? map.tileWidth;
  const height = object.height ?? map.tileHeight;
  const x = (object.x ?? 0) + width / 2;
  const y = (object.y ?? 0) - height / 2;

  if (definition.useMapTile && object.gid) {
    const frame = object.gid - tileset.firstgid;
    return scene.physics.add.staticSprite(x, y, tilesetImageKey, frame);
  }

  const textureKey = definition.textureKey;

  if (!textureKey || definition.frame === undefined) {
    console.warn(
      `[collectibles] "${definition.id}" requires textureKey and frame when useMapTile is false`,
    );
    return null;
  }

  return scene.physics.add.staticSprite(x, y, textureKey, definition.frame);
}
