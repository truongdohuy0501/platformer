import Phaser from 'phaser';
import { loadAssets, preloadAssets } from '../assets';
import { SceneKeys } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Boot });
  }

  preload(): void {
    loadAssets(this, preloadAssets);
  }

  create(): void {
    this.scene.start(SceneKeys.Game);
  }
}
