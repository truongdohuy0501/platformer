import { DEBUG_COLLISION } from '../../config/debug.config';

const PHYSICS_STEP_MS = 1000 / 60;
const MAX_SNAP_STEPS = 48;

/**
 * Runs arcade physics steps so colliders settle the player onto solid ground.
 * Call once after colliders are registered.
 */
export function snapPlayerToGround(
  scene: Phaser.Scene,
  sprite: Phaser.Physics.Arcade.Sprite,
): void {
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  const world = scene.physics.world;

  body.setVelocity(0, 0);

  let time = 0;

  for (let step = 0; step < MAX_SNAP_STEPS; step += 1) {
    time += PHYSICS_STEP_MS;
    world.update(time, PHYSICS_STEP_MS);

    if (body.blocked.down) {
      if (DEBUG_COLLISION) {
        console.info('[spawn] snap settled', {
          step,
          x: sprite.x,
          y: sprite.y,
          blockedDown: body.blocked.down,
        });
      }

      return;
    }
  }

  if (DEBUG_COLLISION) {
    console.warn('[spawn] snap did not find ground', {
      x: sprite.x,
      y: sprite.y,
      blockedDown: body.blocked.down,
    });
  }
}
