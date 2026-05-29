import type { AnimationSetConfigData } from '../types';
import { buildStateMachineConfig } from '../build-state-machine-config';
import type { PlayerAnimationStateId } from '../config/player-animation.config';
import { resolvePlayerAnimationState } from '../state-machine/resolve-player-animation-state';
import { AnimationStateMachine } from '../state-machine/AnimationStateMachine';

export class PlayerAnimationController {
  private readonly stateMachine: AnimationStateMachine<PlayerAnimationStateId>;
  private readonly thresholds: AnimationSetConfigData['stateMachine']['thresholds'];

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    animationSet: AnimationSetConfigData,
  ) {
    this.thresholds = animationSet.stateMachine.thresholds;
    this.stateMachine = new AnimationStateMachine(
      sprite,
      buildStateMachineConfig<PlayerAnimationStateId>(animationSet),
    );
  }

  update(sprite: Phaser.Physics.Arcade.Sprite): void {
    const nextState = resolvePlayerAnimationState(sprite, this.thresholds);
    this.stateMachine.setState(nextState);
  }
}
