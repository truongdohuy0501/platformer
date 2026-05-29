export function isFullscreenSupported(scene: Phaser.Scene): boolean {
  return scene.scale.fullscreen.available;
}

export function isFullscreenActive(scene: Phaser.Scene): boolean {
  return scene.scale.isFullscreen;
}

export function toggleFullscreen(scene: Phaser.Scene): void {
  if (!isFullscreenSupported(scene)) {
    return;
  }

  if (isFullscreenActive(scene)) {
    scene.scale.stopFullscreen();
  } else {
    scene.scale.startFullscreen();
  }
}
