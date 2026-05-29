import type { CollectibleConfigData } from '../data/types';

export class Collectible {
  readonly definition: CollectibleConfigData;
  readonly sprite: Phaser.Physics.Arcade.Sprite;

  constructor(definition: CollectibleConfigData, sprite: Phaser.Physics.Arcade.Sprite) {
    this.definition = definition;
    this.sprite = sprite;
    this.sprite.setData('collectibleId', definition.id);
  }

  collect(): void {
    if (this.definition.hiddenOnCollect) {
      this.sprite.disableBody(true, true);
      this.sprite.setVisible(false);
    }
  }
}
