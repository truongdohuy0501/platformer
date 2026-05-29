import type { PlayerSpawnConfig } from '../config/player.config';
import type { MovementInput } from '../input/MovementInput';
import { configurePlayerPhysicsBody } from './configure-player-physics-body';
import type { Entity } from './Entity';
import { PlatformerMovementController } from './movement/PlatformerMovementController';

const PLAYER_DEPTH = 100;

export class Player implements Entity {
  readonly id = 'player';
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly movementConfig: PlayerSpawnConfig['movement'];
  private readonly movementController = new PlatformerMovementController();

  constructor(scene: Phaser.Scene, config: PlayerSpawnConfig) {
    this.movementConfig = config.movement;

    this.sprite = scene.physics.add.sprite(
      config.spawn.x,
      config.spawn.y,
      config.textureKey,
      config.defaultFrame,
    );

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setFrame(config.defaultFrame);
    this.sprite.setDepth(PLAYER_DEPTH);
    this.sprite.setAlpha(1);
    this.sprite.setVisible(true);
    this.sprite.clearTint();

    if (config.displaySize) {
      this.sprite.setDisplaySize(config.displaySize.width, config.displaySize.height);
    }

    configurePlayerPhysicsBody(this.sprite, config.physicsBody);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0);
  }

  applyMovement(input: MovementInput, deltaMs: number): void {
    this.movementController.update(
      this.sprite,
      input,
      this.movementConfig,
      deltaMs,
    );
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
