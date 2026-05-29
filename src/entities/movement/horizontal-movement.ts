import type { PlayerMovementConfig } from '../../config/player.config';
import type { MovementInput } from '../../input/MovementInput';
import { approach } from './approach';

type HorizontalAxisConfig = {
  readonly acceleration: number;
  readonly deceleration: number;
  readonly maxSpeed: number;
};

function resolveAxisConfig(
  config: PlayerMovementConfig,
  grounded: boolean,
): HorizontalAxisConfig {
  if (grounded) {
    return {
      acceleration: config.groundAcceleration,
      deceleration: config.groundDeceleration,
      maxSpeed: config.groundMaxSpeed,
    };
  }

  return {
    acceleration: config.airAcceleration,
    deceleration: config.airDeceleration,
    maxSpeed: config.airMaxSpeed,
  };
}

function getMoveDirection(input: MovementInput): -1 | 0 | 1 {
  if (input.left && !input.right) {
    return -1;
  }

  if (input.right && !input.left) {
    return 1;
  }

  return 0;
}

export function applyHorizontalMovement(
  sprite: Phaser.Physics.Arcade.Sprite,
  input: MovementInput,
  config: PlayerMovementConfig,
  grounded: boolean,
  deltaSeconds: number,
): void {
  const axis = resolveAxisConfig(config, grounded);
  const moveDirection = getMoveDirection(input);
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  const delta = deltaSeconds;

  if (moveDirection !== 0) {
    const targetSpeed = moveDirection * axis.maxSpeed;
    const nextVelocity = approach(
      body.velocity.x,
      targetSpeed,
      axis.acceleration * delta,
    );
    body.setVelocityX(nextVelocity);
    sprite.setFlipX(moveDirection < 0);
    return;
  }

  const nextVelocity = approach(
    body.velocity.x,
    0,
    axis.deceleration * delta,
  );
  body.setVelocityX(nextVelocity);
}
