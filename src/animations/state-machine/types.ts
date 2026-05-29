export type AnimationStateDefinition = {
  readonly animKey: string;
  readonly ignoreIfPlaying?: boolean;
};

export type AnimationStateMachineConfig<TState extends string> = {
  readonly states: Record<TState, AnimationStateDefinition>;
};
