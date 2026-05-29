export function applyTiledLayerOffset(layer: Phaser.Tilemaps.TilemapLayer): void {
  const data = layer.layer;

  if (data.x) {
    layer.setX(data.x);
  }

  if (data.y) {
    layer.setY(data.y);
  }
}
