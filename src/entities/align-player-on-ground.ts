const MAX_EMBED_CORRECTION_PX = 4;

/**
 * After colliders + snap: round feet Y and lift out of tile embed if Arcade reports embedded.
 */
export function alignPlayerOnGround(sprite: Phaser.Physics.Arcade.Sprite): void {
  const body = sprite.body as Phaser.Physics.Arcade.Body;

  if (!body.blocked.down) {
    return;
  }

  sprite.y = Math.round(sprite.y);

  for (let step = 0; step < MAX_EMBED_CORRECTION_PX && body.embedded; step += 1) {
    sprite.y -= 1;
    body.updateFromGameObject();
  }

  body.setVelocity(0, 0);
}
