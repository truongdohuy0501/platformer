export type ImageAssetDefinition = {
  readonly type: 'image';
  readonly key: string;
  readonly path: string;
};

export type SpritesheetAssetDefinition = {
  readonly type: 'spritesheet';
  readonly key: string;
  readonly path: string;
  readonly frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
};

export type AtlasAssetDefinition = {
  readonly type: 'atlas';
  readonly key: string;
  readonly texturePath: string;
  readonly atlasPath: string;
};

export type TilemapAssetDefinition = {
  readonly type: 'tilemap';
  readonly key: string;
  readonly path: string;
};

export type TilesetAssetDefinition = {
  readonly type: 'tileset';
  readonly key: string;
  readonly path: string;
};

export type AudioAssetDefinition = {
  readonly type: 'audio';
  readonly key: string;
  readonly paths: string[];
};

export type AssetDefinition =
  | ImageAssetDefinition
  | SpritesheetAssetDefinition
  | AtlasAssetDefinition
  | TilemapAssetDefinition
  | TilesetAssetDefinition
  | AudioAssetDefinition;
