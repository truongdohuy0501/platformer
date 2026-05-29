/**
 * Keyboard bindings. InputSystem reads these — scenes never reference keys directly.
 */
export const InputKeys = {
  left: ['A', 'LEFT'],
  right: ['D', 'RIGHT'],
  jump: ['W', 'UP', 'SPACE'],
} as const;

export type InputAction = keyof typeof InputKeys;
