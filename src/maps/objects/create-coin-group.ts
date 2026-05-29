import Phaser from 'phaser';

export function createCoinGroup(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  tileset: Phaser.Tilemaps.Tileset,
  objectLayerName: string,
  tilesetImageKey: string,
): Phaser.Physics.Arcade.StaticGroup {
  const coins = scene.physics.add.staticGroup();
  const objectLayer = map.getObjectLayer(objectLayerName);

  if (!objectLayer?.objects?.length) {
    return coins;
  }

  for (const object of objectLayer.objects) {
    if (!object.gid) {
      continue;
    }

    const coin = createCoinFromTiledObject(
      scene,
      map,
      tileset,
      tilesetImageKey,
      object,
    );

    coins.add(coin);
    coin.setData('collectible', 'coin');
  }

  return coins;
}

function createCoinFromTiledObject(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap,
  tileset: Phaser.Tilemaps.Tileset,
  tilesetImageKey: string,
  object: Phaser.Types.Tilemaps.TiledObject,
): Phaser.Physics.Arcade.Sprite {
  const width = object.width ?? map.tileWidth;
  const height = object.height ?? map.tileHeight;
  const x = (object.x ?? 0) + width / 2;
  const y = (object.y ?? 0) - height / 2;
  const frame = object.gid! - tileset.firstgid;

  if (!scene.textures.exists(tilesetImageKey)) {
    throw new Error(`Tileset texture "${tilesetImageKey}" is not loaded`);
  }

  const texture = scene.textures.get(tilesetImageKey);

  if (!texture.has(String(frame))) {
    console.warn(
      `[coins] frame ${frame} missing on "${tilesetImageKey}" (gid ${object.gid})`,
    );
  }

  return scene.physics.add.staticSprite(x, y, tilesetImageKey, frame);
}
