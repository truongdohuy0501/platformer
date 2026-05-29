import { publicUrl } from '../utils/public-url';
import type { LevelConfigData } from './types';

export function resolveLevelPaths(level: LevelConfigData): LevelConfigData {
  return {
    ...level,
    mapPath: publicUrl(level.mapPath),
    tilesetImagePath: publicUrl(level.tilesetImagePath),
  };
}
