import Phaser from 'phaser';
import { loadAssets, preloadAssets } from '../assets';
import { AssetKeys } from '../config/asset-keys';
import { initGameDataRegistry, preloadGameData } from '../data/load-game-data';
import { SceneKeys } from '../config';

const PLAYER_FRAME_NAMES = [
  'idle-0',
  'idle-1',
  'run-0',
  'run-1',
  'run-2',
  'jump-0',
  'fall-0',
] as const;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Boot });
  }

  preload(): void {
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error(`[assets] failed to load: ${file.key} (${file.url})`);
    });

    preloadGameData(this);
    loadAssets(this, preloadAssets);
  }

  create(): void {
    initGameDataRegistry(this);
    assertPlayerAtlas(this);
    this.scene.start(SceneKeys.Game);
  }
}

function assertPlayerAtlas(scene: Phaser.Scene): void {
  if (!scene.textures.exists(AssetKeys.Player)) {
    throw new Error(
      `[assets] texture "${AssetKeys.Player}" missing — load.atlas must run in BootScene`,
    );
  }

  const texture = scene.textures.get(AssetKeys.Player);
  const missing = PLAYER_FRAME_NAMES.filter((name) => !texture.has(name));

  if (missing.length > 0) {
    throw new Error(
      `[assets] atlas "${AssetKeys.Player}" missing frames: ${missing.join(', ')} — re-export 1.png + 1.json from TexturePacker`,
    );
  }
}
