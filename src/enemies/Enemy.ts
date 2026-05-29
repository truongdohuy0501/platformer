import type { EnemyConfigData } from '../data/types';
import { PatrolBehavior } from './behaviors/PatrolBehavior';

export class Enemy {
  readonly id: string;
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly behavior: PatrolBehavior | null;

  constructor(scene: Phaser.Scene, config: EnemyConfigData, x: number, y: number) {
    this.id = config.id;
    this.sprite = scene.physics.add.sprite(x, y, config.sprite.textureKey, config.sprite.frame);

    this.sprite.setDisplaySize(config.sprite.displayWidth, config.sprite.displayHeight);
    this.configureBody(config);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setData('enemyId', config.id);

    this.behavior =
      config.behavior.type === 'patrol'
        ? new PatrolBehavior(this.sprite, config.behavior)
        : null;
  }

  update(): void {
    this.behavior?.update();
  }

  destroy(): void {
    this.sprite.destroy();
  }

  private configureBody(config: EnemyConfigData): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(config.physicsBody.width, config.physicsBody.height);
    body.setOffset(config.physicsBody.offsetX, config.physicsBody.offsetY);
    body.setAllowGravity(true);
  }
}
