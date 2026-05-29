import Phaser from 'phaser';
import { SceneKeys } from '../config';
import { createGameSystems } from '../systems/create-game-systems';

export class GameScene extends Phaser.Scene {
  private readonly systems = createGameSystems();

  constructor() {
    super({ key: SceneKeys.Game });
  }

  create(): void {
    this.systems.init(this);
  }

  update(time: number, delta: number): void {
    this.systems.update(time, delta);
  }

  shutdown(): void {
    this.systems.destroy();
  }
}
