/**
 * Depth ordering for UI layers relative to gameplay.
 */
export const UiDepths = {
  Hud: 1000,
  Overlay: 2000,
  Modal: 3000,
  TouchControls: 4000,
} as const;
