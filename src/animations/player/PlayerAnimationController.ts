import {
  PlayerAnimationStateConfig,
  PlayerAnimationThresholds,
} from '../config/player-animation.config';
import { resolvePlayerAnimationState } from '../state-machine/resolve-player-animation-state';
import { AnimationStateMachine } from '../state-machine/AnimationStateMachine';
import type { PlayerAnimationStateId } from '../config/player-animation.config';

export class PlayerAnimationController {
  private readonly stateMachine: AnimationStateMachine<PlayerAnimationStateId>;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.stateMachine = new AnimationStateMachine(sprite, {
      states: PlayerAnimationStateConfig,
    });
  }

  update(sprite: Phaser.Physics.Arcade.Sprite): void {
    const nextState = resolvePlayerAnimationState(
      sprite,
      PlayerAnimationThresholds,
    );
    this.stateMachine.setState(nextState);
  }
}
