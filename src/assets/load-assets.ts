import type { AssetDefinition } from './asset-definition';

export function loadAssets(
  scene: Phaser.Scene,
  assets: readonly AssetDefinition[],
): void {
  for (const asset of assets) {
    registerAsset(scene, asset);
  }
}

function registerAsset(scene: Phaser.Scene, asset: AssetDefinition): void {
  switch (asset.type) {
    case 'image':
      scene.load.image(asset.key, asset.path);
      break;
    case 'spritesheet':
      scene.load.spritesheet(asset.key, asset.path, asset.frameConfig);
      break;
    case 'atlas':
      scene.load.atlas(asset.key, asset.texturePath, asset.atlasPath);
      break;
    case 'tilemap':
      scene.load.tilemapTiledJSON(asset.key, asset.path);
      break;
    case 'tileset':
      scene.load.image(asset.key, asset.path);
      break;
    case 'audio':
      scene.load.audio(asset.key, asset.paths);
      break;
    default: {
      const _exhaustive: never = asset;
      return _exhaustive;
    }
  }
}
