export type AnimationDefinition = {
  readonly key: string;
  readonly textureKey: string;
  readonly frames: Phaser.Types.Animations.GenerateFrameNumbers;
  readonly frameRate: number;
  readonly repeat: number;
};
