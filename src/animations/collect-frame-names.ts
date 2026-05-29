import type { AnimationClipDefinition, AnimationFrameSource } from './types';

/** Collects unique frame names referenced by clips (for atlas placeholder generation). */
export function collectFrameNamesFromClips(
  clips: readonly AnimationClipDefinition[],
): readonly string[] {
  const names = new Set<string>();

  for (const clip of clips) {
    for (const name of collectFrameNamesFromSource(clip.frames)) {
      names.add(name);
    }
  }

  return [...names];
}

export function collectFrameNamesFromSource(
  source: AnimationFrameSource,
): readonly string[] {
  switch (source.type) {
    case 'names':
      return source.names;
    case 'pattern': {
      const pad = source.zeroPad ?? 0;
      const result: string[] = [];

      for (let index = source.start; index <= source.end; index += 1) {
        const numeric = pad > 0 ? String(index).padStart(pad, '0') : String(index);
        result.push(`${source.prefix}${numeric}${source.suffix ?? ''}`);
      }

      return result;
    }
    case 'numeric': {
      const result: string[] = [];
      for (let index = source.start; index <= source.end; index += 1) {
        result.push(String(index));
      }
      return result;
    }
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}
