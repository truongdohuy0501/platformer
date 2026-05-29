/**
 * Frame snapshot of movement intent. Produced by InputSystem, consumed by Player.
 */
export type MovementInput = {
  readonly left: boolean;
  readonly right: boolean;
  readonly jump: boolean;
  readonly jumpPressed: boolean;
};

export function createMovementInput(
  overrides: Partial<MovementInput> = {},
): MovementInput {
  return {
    left: false,
    right: false,
    jump: false,
    jumpPressed: false,
    ...overrides,
  };
}
