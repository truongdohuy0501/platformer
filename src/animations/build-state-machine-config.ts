import type { AnimationSetConfigData } from './types';
import type { AnimationStateMachineConfig } from './state-machine/types';

export function buildStateMachineConfig<TState extends string>(
  animationSet: AnimationSetConfigData,
): AnimationStateMachineConfig<TState> {
  const stateMap = {} as Record<
    TState,
    { readonly animKey: string; readonly ignoreIfPlaying: boolean }
  >;

  for (const [stateId, stateDef] of Object.entries(animationSet.stateMachine.states)) {
    stateMap[stateId as TState] = {
      animKey: stateDef.clipKey,
      ignoreIfPlaying: stateDef.ignoreIfPlaying ?? true,
    };
  }

  return { states: stateMap };
}
