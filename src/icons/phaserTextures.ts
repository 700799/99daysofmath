import type Phaser from 'phaser';
import { iconDataUri, type IconName } from './registry';

/**
 * Loads app icons into a Phaser scene as textures (keyed by icon name) by
 * rasterizing their SVG data URIs through an HTMLImageElement. Resolves once
 * every texture exists; safe to call repeatedly (e.g. on scene restart).
 *
 * Icons are rasterized at `px` square — display smaller via setDisplaySize
 * for crisp results on high-DPI screens.
 */
export function loadIconTextures(
  scene: Phaser.Scene,
  names: IconName[],
  px = 128,
): Promise<void> {
  const jobs = names.map(
    (name) =>
      new Promise<void>((resolve) => {
        if (scene.textures.exists(name)) {
          resolve();
          return;
        }
        const img = new Image();
        img.onload = () => {
          // A parallel load (or scene restart) may have beaten us to it.
          if (!scene.textures.exists(name)) scene.textures.addImage(name, img);
          resolve();
        };
        // Never block the game on one bad asset; the scene draws without it.
        img.onerror = () => resolve();
        img.src = iconDataUri(name, px);
      }),
  );
  return Promise.all(jobs).then(() => undefined);
}
