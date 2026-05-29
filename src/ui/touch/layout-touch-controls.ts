import Phaser from 'phaser';

export type TouchButtonLayout = {
  readonly x: number;
  readonly y: number;
  readonly size: number;
};

export type TouchControlsLayout = {
  readonly buttonSize: number;
  readonly left: TouchButtonLayout;
  readonly right: TouchButtonLayout;
  readonly jump: TouchButtonLayout;
};

export type ViewportSize = {
  readonly width: number;
  readonly height: number;
};

export function computeTouchControlsLayout(
  viewport: ViewportSize,
  options: {
    readonly showMoveButtons: boolean;
    readonly minButtonSize: number;
    readonly maxButtonSize: number;
    readonly buttonSizeRatio: number;
    readonly marginRatio: number;
    readonly moveButtonGapRatio: number;
  },
): TouchControlsLayout {
  const minEdge = Math.min(viewport.width, viewport.height);
  const margin = minEdge * options.marginRatio;
  const buttonSize = Phaser.Math.Clamp(
    minEdge * options.buttonSizeRatio,
    options.minButtonSize,
    options.maxButtonSize,
  );
  const isPortrait = viewport.height > viewport.width;
  const moveGap = buttonSize * options.moveButtonGapRatio;

  if (isPortrait) {
    return layoutPortrait(viewport, buttonSize, margin, moveGap, options.showMoveButtons);
  }

  return layoutLandscape(viewport, buttonSize, margin, moveGap, options.showMoveButtons);
}

function layoutPortrait(
  viewport: ViewportSize,
  buttonSize: number,
  margin: number,
  moveGap: number,
  showMoveButtons: boolean,
): TouchControlsLayout {
  const baseY = viewport.height - margin - buttonSize / 2;
  const jumpX = viewport.width - margin - buttonSize / 2;

  if (!showMoveButtons) {
    return {
      buttonSize,
      left: { x: -9999, y: baseY, size: buttonSize },
      right: { x: -9999, y: baseY, size: buttonSize },
      jump: { x: jumpX, y: baseY, size: buttonSize },
    };
  }

  const leftX = margin + buttonSize / 2;
  const rightX = leftX + buttonSize + moveGap;

  return {
    buttonSize,
    left: { x: leftX, y: baseY, size: buttonSize },
    right: { x: rightX, y: baseY, size: buttonSize },
    jump: { x: jumpX, y: baseY, size: buttonSize },
  };
}

function layoutLandscape(
  viewport: ViewportSize,
  buttonSize: number,
  margin: number,
  moveGap: number,
  showMoveButtons: boolean,
): TouchControlsLayout {
  const baseY = viewport.height - margin - buttonSize / 2;
  const jumpX = viewport.width - margin - buttonSize / 2;

  if (!showMoveButtons) {
    return {
      buttonSize,
      left: { x: -9999, y: baseY, size: buttonSize },
      right: { x: -9999, y: baseY, size: buttonSize },
      jump: { x: jumpX, y: baseY, size: buttonSize * 1.05 },
    };
  }

  const leftX = margin + buttonSize / 2;
  const rightX = leftX + buttonSize + moveGap;

  return {
    buttonSize,
    left: { x: leftX, y: baseY, size: buttonSize },
    right: { x: rightX, y: baseY, size: buttonSize },
    jump: { x: jumpX, y: baseY, size: buttonSize * 1.05 },
  };
}
