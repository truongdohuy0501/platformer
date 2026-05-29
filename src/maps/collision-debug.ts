import { DEBUG_COLLISION } from '../config/debug.config';

export type CollisionDebugState = {
  readonly blockedDown: boolean;
  readonly blockedLeft: boolean;
  readonly blockedRight: boolean;
  readonly velocityX: number;
  readonly velocityY: number;
  readonly falling: boolean;
  readonly grounded: boolean;
};

export function readCollisionDebugState(
  sprite: Phaser.Physics.Arcade.Sprite,
): CollisionDebugState {
  const body = sprite.body as Phaser.Physics.Arcade.Body;

  return {
    blockedDown: body.blocked.down,
    blockedLeft: body.blocked.left,
    blockedRight: body.blocked.right,
    velocityX: body.velocity.x,
    velocityY: body.velocity.y,
    falling: body.velocity.y > 20,
    grounded: body.blocked.down,
  };
}

let lastLogTime = 0;

export function logCollisionDebug(
  sprite: Phaser.Physics.Arcade.Sprite,
  context: string,
): void {
  if (!DEBUG_COLLISION) {
    return;
  }

  const now = performance.now();

  if (now - lastLogTime < 500) {
    return;
  }

  lastLogTime = now;
  const state = readCollisionDebugState(sprite);
  console.debug(`[collision:${context}]`, state);
}

export function logDeathTrigger(
  reason: string,
  details: Record<string, unknown>,
): void {
  console.warn('[death]', reason, details);

  if (DEBUG_COLLISION) {
    console.trace('[death] stack');
  }
}
