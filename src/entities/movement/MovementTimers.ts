import type { PlayerMovementConfig } from '../../config/player.config';

export class MovementTimers {
  coyoteTimeRemaining = 0;
  jumpBufferRemaining = 0;
  isJumping = false;

  resetCoyote(config: PlayerMovementConfig): void {
    this.coyoteTimeRemaining = config.coyoteTimeMs;
  }

  queueJumpBuffer(config: PlayerMovementConfig): void {
    this.jumpBufferRemaining = config.jumpBufferMs;
  }

  tick(deltaMs: number): void {
    this.coyoteTimeRemaining = Math.max(0, this.coyoteTimeRemaining - deltaMs);
    this.jumpBufferRemaining = Math.max(0, this.jumpBufferRemaining - deltaMs);
  }

  canCoyoteJump(): boolean {
    return this.coyoteTimeRemaining > 0;
  }

  hasJumpBuffered(): boolean {
    return this.jumpBufferRemaining > 0;
  }

  clearJumpBuffer(): void {
    this.jumpBufferRemaining = 0;
  }
}
