import type { AnimationFrameSource } from './types';

/**
 * Builds Phaser animation frame objects from a declarative frame source.
 * Hash atlases must use named frames (type: names).
 */
export function resolveAnimationFrames(
  scene: Phaser.Scene,
  textureKey: string,
  source: AnimationFrameSource,
): Phaser.Types.Animations.AnimationFrame[] {
  if (!scene.textures.exists(textureKey)) {
    return [];
  }

  const texture = scene.textures.get(textureKey);

  switch (source.type) {
    case 'names':
      return resolveNamedFrames(texture, textureKey, source.names);
    case 'pattern':
      return resolvePatternFrames(texture, textureKey, source);
    case 'numeric':
      return scene.anims.generateFrameNumbers(textureKey, {
        start: source.start,
        end: source.end,
      });
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}

function resolveNamedFrames(
  texture: Phaser.Textures.Texture,
  textureKey: string,
  names: readonly string[],
): Phaser.Types.Animations.AnimationFrame[] {
  const frames: Phaser.Types.Animations.AnimationFrame[] = [];

  for (const frameName of names) {
    if (!texture.has(frameName)) {
      console.error(
        `[animations] frame "${frameName}" not found in atlas "${textureKey}"`,
      );
      continue;
    }

    frames.push({ key: textureKey, frame: frameName });
  }

  return frames;
}

function resolvePatternFrames(
  texture: Phaser.Textures.Texture,
  textureKey: string,
  source: Extract<AnimationFrameSource, { readonly type: 'pattern' }>,
): Phaser.Types.Animations.AnimationFrame[] {
  const pad = source.zeroPad ?? 0;
  const names: string[] = [];

  for (let index = source.start; index <= source.end; index += 1) {
    const numeric = pad > 0 ? String(index).padStart(pad, '0') : String(index);
    names.push(`${source.prefix}${numeric}${source.suffix ?? ''}`);
  }

  return resolveNamedFrames(texture, textureKey, names);
}
