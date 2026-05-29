import { PlayerAnimationKeys } from '../keys/player-animation-keys';

export const PlayerAnimationStates = ['idle', 'run', 'jump', 'fall'] as const;

export type PlayerAnimationStateId =
  (typeof PlayerAnimationStates)[number];

export type PlayerAnimationThresholds = {
  readonly runSpeed: number;
  readonly jumpVelocityY: number;
  readonly fallVelocityY: number;
};

export const PlayerAnimationThresholds: PlayerAnimationThresholds = {
  runSpeed: 15,
  jumpVelocityY: -20,
  fallVelocityY: 20,
};

export type PlayerAnimationStateDefinition = {
  readonly animKey: string;
  readonly ignoreIfPlaying: boolean;
};

export const PlayerAnimationStateConfig: Record<
  PlayerAnimationStateId,
  PlayerAnimationStateDefinition
> = {
  idle: { animKey: PlayerAnimationKeys.Idle, ignoreIfPlaying: true },
  run: { animKey: PlayerAnimationKeys.Run, ignoreIfPlaying: true },
  jump: { animKey: PlayerAnimationKeys.Jump, ignoreIfPlaying: true },
  fall: { animKey: PlayerAnimationKeys.Fall, ignoreIfPlaying: true },
};
