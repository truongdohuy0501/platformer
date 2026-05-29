/**
 * Tilemap layer names for Tiled exports and Phaser tilemap layers.
 */
export const LayerKeys = {
  Background: 'background',
  Platforms: 'platforms',
  Decorations: 'decorations',
  Hazards: 'hazards',
  Objects: 'objects',
} as const;

export type LayerKey = (typeof LayerKeys)[keyof typeof LayerKeys];
