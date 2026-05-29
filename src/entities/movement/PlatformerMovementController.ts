import type { PlayerMovementConfig } from '../../config/player.config';
import type { MovementInput } from '../../input/MovementInput';
import { applyHorizontalMovement } from './horizontal-movement';
import {
  applyVariableJumpHeight,
  clampFallSpeed,
  handleJumpInput,
  isGrounded,
  tryConsumeJump,
  updateGroundTimers,
} from './jump-movement';
import { MovementTimers } from './MovementTimers';

export class PlatformerMovementController {
  private readonly timers = new MovementTimers();

  update(
    sprite: Phaser.Physics.Arcade.Sprite,
    input: MovementInput,
    config: PlayerMovementConfig,
    deltaMs: number,
  ): void {
    const deltaSeconds = deltaMs / 1000;

    this.timers.tick(deltaMs);
    updateGroundTimers(sprite, this.timers, config);
    handleJumpInput(input, this.timers, config);

    const grounded = isGrounded(sprite);

    applyHorizontalMovement(sprite, input, config, grounded, deltaSeconds);
    tryConsumeJump(sprite, this.timers, config);
    applyVariableJumpHeight(sprite, input, this.timers, config);
    clampFallSpeed(sprite, config);
  }
}
