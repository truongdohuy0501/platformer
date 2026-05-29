/**
 * Touch control layout and sizing. All dimensions are relative to the viewport.
 */
export const TouchControlsConfig = {
  enabled: true,
  /** Show on touch-capable devices; set true to always show (e.g. iPad testing on desktop). */
  forceShow: true,
  showMoveButtons: true,
  minButtonSize: 56,
  maxButtonSize: 104,
  /** Button diameter as a fraction of the shorter screen edge. */
  buttonSizeRatio: 0.14,
  /** Edge inset as a fraction of the shorter screen edge. */
  marginRatio: 0.035,
  /** Gap between left and right move buttons as a fraction of button size. */
  moveButtonGapRatio: 0.2,
  idleAlpha: 0.42,
  pressedAlpha: 0.72,
  fillColor: 0xffffff,
  strokeColor: 0x000000,
  strokeWidth: 2,
  jumpLabel: '↑',
  leftLabel: '◀',
  rightLabel: '▶',
} as const;
