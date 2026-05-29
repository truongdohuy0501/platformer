import Phaser from 'phaser';
import { createPhaserConfig, GAME_CONTAINER_ID } from '../config';

export function createGame(
  containerId: string = GAME_CONTAINER_ID,
): Phaser.Game {
  const parent = document.getElementById(containerId);

  if (!parent) {
    throw new Error(`Game container "#${containerId}" not found`);
  }

  return new Phaser.Game(createPhaserConfig(parent));
}
