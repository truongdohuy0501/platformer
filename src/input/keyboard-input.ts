import Phaser from 'phaser';
import { InputKeys } from '../config/input-keys.config';
import { createMovementInput, type MovementInput } from './MovementInput';

type KeyGroup = readonly Phaser.Input.Keyboard.Key[];

function createKeyGroup(
  keyboard: Phaser.Input.Keyboard.KeyboardPlugin,
  keyCodes: readonly string[],
): KeyGroup {
  return keyCodes.map((code) => keyboard.addKey(code));
}

function isGroupDown(keys: KeyGroup): boolean {
  return keys.some((key) => key.isDown);
}

function isGroupJustDown(keys: KeyGroup): boolean {
  return keys.some((key) => Phaser.Input.Keyboard.JustDown(key));
}

export type KeyboardInputBindings = {
  readonly left: KeyGroup;
  readonly right: KeyGroup;
  readonly jump: KeyGroup;
};

export function createKeyboardBindings(
  scene: Phaser.Scene,
): KeyboardInputBindings {
  const keyboard = scene.input.keyboard;

  if (!keyboard) {
    throw new Error('Keyboard input is not enabled for this scene');
  }

  return {
    left: createKeyGroup(keyboard, InputKeys.left),
    right: createKeyGroup(keyboard, InputKeys.right),
    jump: createKeyGroup(keyboard, InputKeys.jump),
  };
}

export function readMovementInput(
  bindings: KeyboardInputBindings,
): MovementInput {
  return createMovementInput({
    left: isGroupDown(bindings.left),
    right: isGroupDown(bindings.right),
    jump: isGroupDown(bindings.jump),
    jumpPressed: isGroupJustDown(bindings.jump),
  });
}
