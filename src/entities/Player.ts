import type { PlayerSpawnConfig } from '../config/player.config';
import type { MovementInput } from '../input/MovementInput';
import type { Entity } from './Entity';
import { PlatformerMovementController } from './movement/PlatformerMovementController';

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
      0,
    );

    this.sprite.setOrigin(0.5, 1);
    this.configurePhysicsBody(config.physicsBody);
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

  private configurePhysicsBody(
    bodyConfig: PlayerSpawnConfig['physicsBody'],
  ): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(bodyConfig.width, bodyConfig.height);
    body.setOffset(bodyConfig.offsetX, bodyConfig.offsetY);
  }
}
