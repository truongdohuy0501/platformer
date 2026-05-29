import type Phaser from 'phaser';

type TiledProperty = {
  readonly name: string;
  readonly value: unknown;
};

export function getLayerBooleanProperty(
  layer: Phaser.Tilemaps.TilemapLayer,
  propertyName: string,
): boolean {
  const properties = layer.layer.properties as readonly TiledProperty[] | undefined;
  const match = properties?.find((entry) => entry.name === propertyName);

  return match?.value === true;
}

export function layerHasBooleanProperty(
  layer: Phaser.Tilemaps.TilemapLayer,
  propertyName: string,
): boolean {
  const properties = layer.layer.properties as readonly TiledProperty[] | undefined;

  return properties?.some((entry) => entry.name === propertyName) ?? false;
}
