import type { ObjectSpawnConfigData } from './types';

type TiledObject = Phaser.Types.Tilemaps.TiledObject & {
  readonly properties?: readonly {
    readonly name: string;
    readonly value: unknown;
  }[];
};

export function resolveTiledObjectType(
  object: TiledObject,
  spawnConfig: ObjectSpawnConfigData,
): string | null {
  const propertyMatch = object.properties?.find(
    (entry: { readonly name: string; readonly value: unknown }) =>
      entry.name === spawnConfig.propertyKey,
  );

  if (propertyMatch?.value !== undefined && propertyMatch.value !== '') {
    return String(propertyMatch.value);
  }

  if (object.type) {
    return object.type;
  }

  if (object.name) {
    return object.name;
  }

  return spawnConfig.defaultType ?? null;
}
