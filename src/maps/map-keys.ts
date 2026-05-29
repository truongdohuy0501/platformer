export const MapKeys = {
  Level1: 'level1',
} as const;

export type MapKey = (typeof MapKeys)[keyof typeof MapKeys];
