import { TouchControlsConfig } from './touch-controls.config';

export class TouchButton {
  readonly container: Phaser.GameObjects.Container;
  private readonly background: Phaser.GameObjects.Arc;
  private readonly label: Phaser.GameObjects.Text;
  private readonly hitArea: Phaser.GameObjects.Rectangle;
  private activePointerId: number | null = null;
  private isPressed = false;
  private wasPressed = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    size: number,
    labelText: string,
  ) {
    this.container = scene.add.container(x, y);

    this.background = scene.add.circle(0, 0, size / 2, TouchControlsConfig.fillColor, TouchControlsConfig.idleAlpha);
    this.background.setStrokeStyle(
      TouchControlsConfig.strokeWidth,
      TouchControlsConfig.strokeColor,
      0.35,
    );

    this.label = scene.add.text(0, 0, labelText, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(size * 0.38)}px`,
      color: '#111111',
    });
    this.label.setOrigin(0.5);

    this.hitArea = scene.add.rectangle(0, 0, size, size);
    this.hitArea.setInteractive({ useHandCursor: false });

    this.container.add([this.background, this.label, this.hitArea]);
    this.bindPointerEvents();
  }

  setLayout(x: number, y: number, size: number): void {
    this.container.setPosition(x, y);
    this.background.setRadius(size / 2);
    this.hitArea.setSize(size, size);
    this.label.setFontSize(Math.round(size * 0.38));
  }

  setVisible(visible: boolean): void {
    this.container.setVisible(visible);
    this.hitArea.disableInteractive();

    if (visible) {
      this.hitArea.setInteractive({ useHandCursor: false });
    }
  }

  tick(): void {
    this.wasPressed = this.isPressed;
    this.background.setAlpha(
      this.isPressed ? TouchControlsConfig.pressedAlpha : TouchControlsConfig.idleAlpha,
    );
    this.container.setScale(this.isPressed ? 0.94 : 1);
  }

  get pressed(): boolean {
    return this.isPressed;
  }

  get justPressed(): boolean {
    return this.isPressed && !this.wasPressed;
  }

  destroy(): void {
    this.container.destroy(true);
  }

  private bindPointerEvents(): void {
    this.hitArea.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.activePointerId !== null) {
        return;
      }

      this.activePointerId = pointer.id;
      this.isPressed = true;
    });

    const release = (pointer: Phaser.Input.Pointer) => {
      if (pointer.id !== this.activePointerId) {
        return;
      }

      this.activePointerId = null;
      this.isPressed = false;
    };

    this.hitArea.on('pointerup', release);
    this.hitArea.on('pointerupoutside', release);
    this.hitArea.on('pointerout', release);
  }
}
