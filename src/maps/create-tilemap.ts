import type { LayerKey } from '../config';

export type TilemapBuildConfig = {
  readonly mapKey: string;
  readonly tilesetKey: string;
  readonly layerKeys: readonly LayerKey[];
};

export type BuiltTilemap = {
  readonly map: Phaser.Tilemaps.Tilemap;
  readonly layers: ReadonlyMap<LayerKey, Phaser.Tilemaps.TilemapLayer>;
};

/**
 * Creates a tilemap and named layers from loaded Tiled assets.
 */
export function createTilemap(
  scene: Phaser.Scene,
  config: TilemapBuildConfig,
): BuiltTilemap {
  const map = scene.make.tilemap({ key: config.mapKey });
  const tileset = map.addTilesetImage(config.tilesetKey, config.tilesetKey);

  if (!tileset) {
    throw new Error(
      `Tileset "${config.tilesetKey}" could not be attached to map "${config.mapKey}"`,
    );
  }

  const layers = new Map<LayerKey, Phaser.Tilemaps.TilemapLayer>();

  for (const layerKey of config.layerKeys) {
    const layer = map.createLayer(layerKey, tileset, 0, 0);

    if (!layer) {
      throw new Error(`Layer "${layerKey}" not found in map "${config.mapKey}"`);
    }

    layers.set(layerKey, layer);
  }

  return { map, layers };
}
