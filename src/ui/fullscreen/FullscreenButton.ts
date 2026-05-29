import { UiDepths } from '../ui-depths';
import { FullscreenButtonConfig } from './fullscreen-button.config';
import {
  isFullscreenActive,
  isFullscreenSupported,
  toggleFullscreen,
} from './toggle-fullscreen';

const LABEL_ENTER = '⛶';
const LABEL_EXIT = '✕';

export class FullscreenButton {
  private readonly root: Phaser.GameObjects.Container;
  private readonly background: Phaser.GameObjects.Arc;
  private readonly label: Phaser.GameObjects.Text;
  private readonly hitArea: Phaser.GameObjects.Rectangle;
  private readonly resizeHandler: () => void;
  private readonly enterHandler: () => void;
  private readonly leaveHandler: () => void;

  constructor(private readonly scene: Phaser.Scene) {
    const { size, fillColor, idleAlpha, strokeColor, strokeWidth } =
      FullscreenButtonConfig;

    this.root = scene.add.container(0, 0);
    this.root.setScrollFactor(0);
    this.root.setDepth(UiDepths.FullscreenButton);

    this.background = scene.add.circle(0, 0, size / 2, fillColor, idleAlpha);
    this.background.setStrokeStyle(strokeWidth, strokeColor, 0.35);

    this.label = scene.add.text(0, 0, LABEL_ENTER, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(size * 0.42)}px`,
      color: '#111111',
    });
    this.label.setOrigin(0.5);

    this.hitArea = scene.add.rectangle(0, 0, size, size);
    this.hitArea.setInteractive({ useHandCursor: true });

    this.root.add([this.background, this.label, this.hitArea]);

    this.hitArea.on('pointerdown', () => toggleFullscreen(scene));

    this.resizeHandler = () => this.layout();
    this.enterHandler = () => this.syncLabel();
    this.leaveHandler = () => this.syncLabel();

    scene.scale.on('resize', this.resizeHandler);
    scene.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, this.enterHandler);
    scene.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, this.leaveHandler);

    this.root.setVisible(isFullscreenSupported(scene));
    this.layout();
    this.syncLabel();
  }

  destroy(): void {
    this.scene.scale.off('resize', this.resizeHandler);
    this.scene.scale.off(Phaser.Scale.Events.ENTER_FULLSCREEN, this.enterHandler);
    this.scene.scale.off(Phaser.Scale.Events.LEAVE_FULLSCREEN, this.leaveHandler);
    this.root.destroy(true);
  }

  private layout(): void {
    const { marginPx, size } = FullscreenButtonConfig;
    this.root.setPosition(
      this.scene.scale.width - marginPx - size / 2,
      marginPx + size / 2,
    );
  }

  private syncLabel(): void {
    this.label.setText(isFullscreenActive(this.scene) ? LABEL_EXIT : LABEL_ENTER);
  }
}
