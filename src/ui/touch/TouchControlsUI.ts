import { UiDepths } from '../ui-depths';
import { TouchControlsConfig } from './touch-controls.config';
import { computeTouchControlsLayout } from './layout-touch-controls';
import { TouchButton } from './TouchButton';
import { createMovementInput, type MovementInput } from '../../input/MovementInput';

export class TouchControlsUI {
  private readonly root: Phaser.GameObjects.Container;
  private readonly leftButton: TouchButton;
  private readonly rightButton: TouchButton;
  private readonly jumpButton: TouchButton;
  private readonly resizeHandler: () => void;

  constructor(private readonly scene: Phaser.Scene) {
    this.root = scene.add.container(0, 0);
    this.root.setScrollFactor(0);
    this.root.setDepth(UiDepths.TouchControls);

    this.leftButton = new TouchButton(
      scene,
      0,
      0,
      TouchControlsConfig.minButtonSize,
      TouchControlsConfig.leftLabel,
    );
    this.rightButton = new TouchButton(
      scene,
      0,
      0,
      TouchControlsConfig.minButtonSize,
      TouchControlsConfig.rightLabel,
    );
    this.jumpButton = new TouchButton(
      scene,
      0,
      0,
      TouchControlsConfig.minButtonSize,
      TouchControlsConfig.jumpLabel,
    );

    this.root.add([
      this.leftButton.container,
      this.rightButton.container,
      this.jumpButton.container,
    ]);

    this.resizeHandler = () => this.applyLayout();
    scene.scale.on('resize', this.resizeHandler);
    this.applyLayout();
  }

  tick(): void {
    this.leftButton.tick();
    this.rightButton.tick();
    this.jumpButton.tick();
  }

  getMovementInput(): MovementInput {
    const showMove = TouchControlsConfig.showMoveButtons;

    return createMovementInput({
      left: showMove && this.leftButton.pressed,
      right: showMove && this.rightButton.pressed,
      jump: this.jumpButton.pressed,
      jumpPressed: this.jumpButton.justPressed,
    });
  }

  destroy(): void {
    this.scene.scale.off('resize', this.resizeHandler);
    this.leftButton.destroy();
    this.rightButton.destroy();
    this.jumpButton.destroy();
    this.root.destroy(true);
  }

  private applyLayout(): void {
    const layout = computeTouchControlsLayout(
      {
        width: this.scene.scale.width,
        height: this.scene.scale.height,
      },
      {
        showMoveButtons: TouchControlsConfig.showMoveButtons,
        minButtonSize: TouchControlsConfig.minButtonSize,
        maxButtonSize: TouchControlsConfig.maxButtonSize,
        buttonSizeRatio: TouchControlsConfig.buttonSizeRatio,
        marginRatio: TouchControlsConfig.marginRatio,
        moveButtonGapRatio: TouchControlsConfig.moveButtonGapRatio,
      },
    );

    this.leftButton.setLayout(layout.left.x, layout.left.y, layout.left.size);
    this.rightButton.setLayout(layout.right.x, layout.right.y, layout.right.size);
    this.jumpButton.setLayout(layout.jump.x, layout.jump.y, layout.jump.size);

    this.leftButton.setVisible(TouchControlsConfig.showMoveButtons);
    this.rightButton.setVisible(TouchControlsConfig.showMoveButtons);
  }
}
