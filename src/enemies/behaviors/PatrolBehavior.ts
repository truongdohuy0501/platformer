import type { EnemyBehaviorConfigData } from '../../data/types';

export class PatrolBehavior {
  private readonly originX: number;
  private direction: -1 | 1;

  constructor(
    private readonly sprite: Phaser.Physics.Arcade.Sprite,
    private readonly config: Extract<EnemyBehaviorConfigData, { type: 'patrol' }>,
  ) {
    this.originX = sprite.x;
    this.direction = config.startDirection === 'left' ? -1 : 1;
  }

  update(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const leftBound = this.originX - this.config.patrolDistance;
    const rightBound = this.originX + this.config.patrolDistance;

    body.setVelocityX(this.config.speed * this.direction);
    this.sprite.setFlipX(this.direction < 0);

    if (this.sprite.x <= leftBound) {
      this.direction = 1;
    } else if (this.sprite.x >= rightBound) {
      this.direction = -1;
    }
  }
}
