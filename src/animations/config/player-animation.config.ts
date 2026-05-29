/** Logical player animation states (must match stateMachine.states in animation JSON). */
export const PlayerAnimationStates = ['idle', 'run', 'jump', 'fall'] as const;

export type PlayerAnimationStateId =
  (typeof PlayerAnimationStates)[number];

export type PlayerAnimationThresholds = {
  readonly runSpeed: number;
  readonly jumpVelocityY: number;
  readonly fallVelocityY: number;
};
