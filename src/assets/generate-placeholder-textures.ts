import { AssetKeys } from '../config/asset-keys';

const PLATFORM_TILE_SIZE = 32;
const PLAYER_FRAME_WIDTH = 32;
const PLAYER_FRAME_HEIGHT = 48;

const PLAYER_FRAME_COLORS = [
  0x4fc3f7,
  0x5eb8e8,
  0x29b6f6,
  0x039be5,
  0x0288d1,
  0xffa726,
  0xef5350,
] as const;

export function registerPlaceholderTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists(AssetKeys.PlayerSheet)) {
    registerPlayerSpritesheet(scene);
  }

  if (!scene.textures.exists(AssetKeys.Platform)) {
    createTexture(
      scene,
      AssetKeys.Platform,
      PLATFORM_TILE_SIZE,
      PLATFORM_TILE_SIZE,
      0x6d4c41,
    );
  }
}

function registerPlayerSpritesheet(scene: Phaser.Scene): void {
  const frameCount = PLAYER_FRAME_COLORS.length;
  const sheetWidth = PLAYER_FRAME_WIDTH * frameCount;
  const graphics = scene.add.graphics();

  for (let index = 0; index < frameCount; index += 1) {
    graphics.fillStyle(PLAYER_FRAME_COLORS[index], 1);
    graphics.fillRect(
      index * PLAYER_FRAME_WIDTH,
      0,
      PLAYER_FRAME_WIDTH,
      PLAYER_FRAME_HEIGHT,
    );
  }

  graphics.generateTexture(AssetKeys.PlayerSheet, sheetWidth, PLAYER_FRAME_HEIGHT);
  graphics.destroy();

  const texture = scene.textures.get(AssetKeys.PlayerSheet);

  for (let index = 0; index < frameCount; index += 1) {
    texture.add(
      String(index),
      0,
      index * PLAYER_FRAME_WIDTH,
      0,
      PLAYER_FRAME_WIDTH,
      PLAYER_FRAME_HEIGHT,
    );
  }
}

function createTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  color: number,
): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(color, 1);
  graphics.fillRect(0, 0, width, height);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
}
