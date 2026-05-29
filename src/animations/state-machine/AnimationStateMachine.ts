import type { AnimationStateMachineConfig } from './types';

/**
 * Drives sprite animations from logical states. Only calls play() on transitions.
 */
export class AnimationStateMachine<TState extends string> {
  private currentState: TState | null = null;

  constructor(
    private readonly sprite: Phaser.GameObjects.Sprite,
    private readonly config: AnimationStateMachineConfig<TState>,
  ) {}

  getState(): TState | null {
    return this.currentState;
  }

  setState(next: TState): void {
    if (this.currentState === next) {
      return;
    }

    const stateDef = this.config.states[next];
    this.currentState = next;
    this.playAnimation(stateDef.animKey, stateDef.ignoreIfPlaying ?? true);
  }

  private playAnimation(animKey: string, ignoreIfPlaying: boolean): void {
    if (!this.sprite.scene.anims.exists(animKey)) {
      return;
    }

    this.sprite.play(animKey, ignoreIfPlaying);
  }
}
