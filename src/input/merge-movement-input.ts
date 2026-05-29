import { createMovementInput, type MovementInput } from './MovementInput';

/** Combines keyboard and touch intent; either source can drive movement. */
export function mergeMovementInput(
  primary: MovementInput,
  secondary: MovementInput,
): MovementInput {
  return createMovementInput({
    left: primary.left || secondary.left,
    right: primary.right || secondary.right,
    jump: primary.jump || secondary.jump,
    jumpPressed: primary.jumpPressed || secondary.jumpPressed,
  });
}
