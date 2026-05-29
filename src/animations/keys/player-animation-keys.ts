/** Phaser animation keys for the player sprite. */
export const PlayerAnimationKeys = {
  Idle: 'player-idle',
  Run: 'player-run',
  Jump: 'player-jump',
  Fall: 'player-fall',
} as const;

export type PlayerAnimationKey =
  (typeof PlayerAnimationKeys)[keyof typeof PlayerAnimationKeys];
