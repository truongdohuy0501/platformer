import { AnimationSystem } from './AnimationSystem';
import { InputSystem } from './input/InputSystem';
import { TouchControlsSystem } from './ui/TouchControlsSystem';
import { PlayerAnimationSystem } from './player/PlayerAnimationSystem';
import { PlayerMovementSystem } from './player/PlayerMovementSystem';
import { PlayerSpawnSystem } from './player/PlayerSpawnSystem';
import { SystemRegistry } from './SystemRegistry';
import { CollisionSetupSystem } from './world/CollisionSetupSystem';
import { MapLoadSystem } from './world/MapLoadSystem';

/**
 * Composes gameplay systems for a scene. Order matters for init dependencies.
 */
export function createGameSystems(): SystemRegistry {
  return new SystemRegistry()
    .register(new MapLoadSystem())
    .register(new PlayerSpawnSystem())
    .register(new CollisionSetupSystem())
    .register(new AnimationSystem())
    .register(new TouchControlsSystem())
    .register(new InputSystem())
    .register(new PlayerMovementSystem())
    .register(new PlayerAnimationSystem());
}
