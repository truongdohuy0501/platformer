import type {
  PlayerAnimationStateId,
  PlayerAnimationThresholds,
} from '../config/player-animation.config';

export function resolvePlayerAnimationState(
  sprite: Phaser.Physics.Arcade.Sprite,
  thresholds: PlayerAnimationThresholds,
): PlayerAnimationStateId {
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  const airborne = !body.blocked.down;

  if (airborne) {
    if (body.velocity.y < thresholds.jumpVelocityY) {
      return 'jump';
    }

    if (body.velocity.y > thresholds.fallVelocityY) {
      return 'fall';
    }

    return body.velocity.y <= 0 ? 'jump' : 'fall';
  }

  if (Math.abs(body.velocity.x) > thresholds.runSpeed) {
    return 'run';
  }

  return 'idle';
}
