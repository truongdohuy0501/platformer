import type { PlayerMovementConfig } from '../../config/player.config';
import type { MovementInput } from '../../input/MovementInput';
import type { MovementTimers } from './MovementTimers';

export function isGrounded(sprite: Phaser.Physics.Arcade.Sprite): boolean {
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  return body.blocked.down;
}

export function updateGroundTimers(
  sprite: Phaser.Physics.Arcade.Sprite,
  timers: MovementTimers,
  config: PlayerMovementConfig,
): void {
  if (isGrounded(sprite)) {
    timers.resetCoyote(config);
    timers.isJumping = false;
  }
}

export function handleJumpInput(
  input: MovementInput,
  timers: MovementTimers,
  config: PlayerMovementConfig,
): void {
  if (input.jumpPressed || input.jump) {
    timers.queueJumpBuffer(config);
  }
}

export function tryConsumeJump(
  sprite: Phaser.Physics.Arcade.Sprite,
  timers: MovementTimers,
  config: PlayerMovementConfig,
): void {
  const grounded = isGrounded(sprite);
  const canJump = grounded || timers.canCoyoteJump();

  if (!canJump || !timers.hasJumpBuffered()) {
    return;
  }

  const body = sprite.body as Phaser.Physics.Arcade.Body;
  body.setVelocityY(config.jumpVelocity);
  timers.isJumping = true;
  timers.clearJumpBuffer();
  timers.coyoteTimeRemaining = 0;
}

export function applyVariableJumpHeight(
  sprite: Phaser.Physics.Arcade.Sprite,
  input: MovementInput,
  timers: MovementTimers,
  config: PlayerMovementConfig,
): void {
  if (!timers.isJumping) {
    return;
  }

  const body = sprite.body as Phaser.Physics.Arcade.Body;

  if (body.velocity.y >= 0) {
    timers.isJumping = false;
    return;
  }

  if (!input.jump) {
    body.setVelocityY(body.velocity.y * config.jumpCutMultiplier);
    timers.isJumping = false;
  }
}

export function clampFallSpeed(
  sprite: Phaser.Physics.Arcade.Sprite,
  config: PlayerMovementConfig,
): void {
  const body = sprite.body as Phaser.Physics.Arcade.Body;

  if (body.velocity.y > config.maxFallSpeed) {
    body.setVelocityY(config.maxFallSpeed);
  }
}
