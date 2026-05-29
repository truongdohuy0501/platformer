import { collectFrameNamesFromClips } from '../animations/collect-frame-names';
import { AssetKeys } from '../config/asset-keys';
import { GameDataRegistry } from '../data/GameDataRegistry';

const PLATFORM_TILE_SIZE = 32;
const PLAYER_FRAME_WIDTH = 32;
const PLAYER_FRAME_HEIGHT = 48;

const PLACEHOLDER_FRAME_COLORS = [
  0x4fc3f7,
  0x5eb8e8,
  0x29b6f6,
  0x039be5,
  0x0288d1,
  0xffa726,
  0xef5350,
  0xab47bc,
] as const;

/** Dev fallback when the player atlas did not load in BootScene. */
export function registerPlaceholderTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists(AssetKeys.Player)) {
    console.warn(
      `[assets] "${AssetKeys.Player}" missing — using colored placeholder frames`,
    );
    registerPlayerAtlasPlaceholder(scene);
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

  if (!scene.textures.exists(AssetKeys.EnemySlime)) {
    createTexture(scene, AssetKeys.EnemySlime, 32, 28, 0x66bb6a);
  }
}

function registerPlayerAtlasPlaceholder(scene: Phaser.Scene): void {
  const animationSet = GameDataRegistry.getPlayerAnimation();
  const frameNames = collectFrameNamesFromClips(animationSet.clips);

  if (frameNames.length === 0) {
    throw new Error(
      `[assets] No frame names defined for animation set "${animationSet.id}"`,
    );
  }

  const sheetWidth = PLAYER_FRAME_WIDTH * frameNames.length;
  const graphics = scene.add.graphics();

  frameNames.forEach((_frameName, index) => {
    const color =
      PLACEHOLDER_FRAME_COLORS[index % PLACEHOLDER_FRAME_COLORS.length];
    graphics.fillStyle(color, 1);
    graphics.fillRect(
      index * PLAYER_FRAME_WIDTH,
      0,
      PLAYER_FRAME_WIDTH,
      PLAYER_FRAME_HEIGHT,
    );
  });

  graphics.generateTexture(AssetKeys.Player, sheetWidth, PLAYER_FRAME_HEIGHT);
  graphics.destroy();

  const texture = scene.textures.get(AssetKeys.Player);

  frameNames.forEach((frameName, index) => {
    texture.add(
      frameName,
      0,
      index * PLAYER_FRAME_WIDTH,
      0,
      PLAYER_FRAME_WIDTH,
      PLAYER_FRAME_HEIGHT,
    );
  });
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
