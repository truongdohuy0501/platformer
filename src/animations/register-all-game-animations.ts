import { GameDataRegistry } from '../data/GameDataRegistry';
import { registerAnimations } from './register-animations';

/** Registers every clip from every animation set listed in the game manifest. */
export function registerAllGameAnimations(scene: Phaser.Scene): void {
  const manifest = GameDataRegistry.getManifest();

  for (const animationId of manifest.animations) {
    const animationSet = GameDataRegistry.getAnimation(animationId);
    registerAnimations(scene, animationSet.clips);
  }
}
