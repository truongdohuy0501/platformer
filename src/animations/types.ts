/**
 * Frame sources for Phaser animations.
 *
 * Prefer `names` (TexturePacker JSON Hash) or `pattern` (generateFrameNames).
 * Use `numeric` only for uniform grid spritesheets without named atlas frames.
 */
export type AnimationFrameSource =
  | {
      readonly type: 'names';
      readonly names: readonly string[];
    }
  | {
      readonly type: 'pattern';
      readonly prefix: string;
      readonly start: number;
      readonly end: number;
      readonly suffix?: string;
      readonly zeroPad?: number;
    }
  | {
      readonly type: 'numeric';
      readonly start: number;
      readonly end: number;
    };

export type AnimationClipDefinition = {
  readonly key: string;
  readonly textureKey: string;
  readonly frames: AnimationFrameSource;
  readonly frameRate: number;
  readonly repeat: number;
};

export type AnimationSetConfigData = {
  readonly id: string;
  readonly textureKey: string;
  readonly defaultFrame: string;
  readonly display?: {
    readonly width: number;
    readonly height: number;
  };
  readonly clips: readonly AnimationClipDefinition[];
  readonly stateMachine: {
    readonly thresholds: {
      readonly runSpeed: number;
      readonly jumpVelocityY: number;
      readonly fallVelocityY: number;
    };
    readonly states: Record<
      string,
      {
        readonly clipKey: string;
        readonly ignoreIfPlaying?: boolean;
      }
    >;
  };
};
