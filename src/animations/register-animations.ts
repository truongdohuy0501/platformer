import { resolveAnimationFrames } from './resolve-animation-frames';
import type { AnimationClipDefinition } from './types';

export type { AnimationClipDefinition, AnimationFrameSource } from './types';

/**
 * Registers sprite animations on a scene after textures are loaded.
 */
export function registerAnimations(
  scene: Phaser.Scene,
  definitions: readonly AnimationClipDefinition[],
): void {
  for (const definition of definitions) {
    if (scene.anims.exists(definition.key)) {
      continue;
    }

    if (!scene.textures.exists(definition.textureKey)) {
      console.error(
        `[animations] Cannot create "${definition.key}" — texture "${definition.textureKey}" is missing`,
      );
      continue;
    }

    const frames = resolveAnimationFrames(
      scene,
      definition.textureKey,
      definition.frames,
    );

    if (frames.length === 0) {
      console.error(
        `[animations] "${definition.key}" has zero frames on texture "${definition.textureKey}"`,
      );
      continue;
    }

    scene.anims.create({
      key: definition.key,
      frames,
      frameRate: definition.frameRate,
      repeat: definition.repeat,
    });
  }
}
