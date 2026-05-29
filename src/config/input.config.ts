/**
 * Input configuration for keyboard and touch / virtual-pad controls.
 */
export const InputConfig = {
  /** Allow left, right, and jump touches at the same time. */
  activePointers: 4,
  keyboard: {
    enabled: true,
  },
  touch: {
    enabled: true,
    preventDefault: true,
    capture: true,
  },
  virtualPad: {
    enabled: true,
    deadZone: 0.15,
    buttonSize: 64,
    margin: 16,
  },
} as const;
