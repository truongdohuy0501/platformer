import type { AnimationDefinition } from './register-animations.types';

export type { AnimationDefinition } from './register-animations.types';

/**
 * Registers sprite animations on a scene after textures are loaded.
 */
export function registerAnimations(
  scene: Phaser.Scene,
  definitions: readonly AnimationDefinition[],
): void {
  for (const definition of definitions) {
    if (scene.anims.exists(definition.key)) {
      continue;
    }

    scene.anims.create({
      key: definition.key,
      frames: scene.anims.generateFrameNumbers(
        definition.textureKey,
        definition.frames,
      ),
      frameRate: definition.frameRate,
      repeat: definition.repeat,
    });
  }
}
