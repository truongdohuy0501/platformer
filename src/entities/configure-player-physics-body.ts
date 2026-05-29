import type { PlayerPhysicsBodyConfig } from '../config/player.config';

/**
 * Physics body values in movement JSON are authored for a 32×48 on-screen sprite.
 * Phaser `body.setSize` expects unscaled frame-space units (× sprite.scale).
 */
const REF_DISPLAY_WIDTH = 32;
const REF_DISPLAY_HEIGHT = 48;

/**
 * Applies a manually sized Arcade body for platformer feet origin (0.5, 1).
 */
export function configurePlayerPhysicsBody(
  sprite: Phaser.Physics.Arcade.Sprite,
  config: PlayerPhysicsBodyConfig,
): void {
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  const frameW = sprite.frame.width;
  const frameH = sprite.frame.height;
  const toFrameX = frameW / REF_DISPLAY_WIDTH;
  const toFrameY = frameH / REF_DISPLAY_HEIGHT;

  body.setSize(config.width * toFrameX, config.height * toFrameY, false);
  body.setOffset(config.offsetX * toFrameX, config.offsetY * toFrameY);
  body.updateFromGameObject();
}
