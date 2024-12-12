/**
 * PixiJS uses a special global type object called GlobalMixins
 * this can be used to add methods to existing PixiJS classes.
 */
declare global {
  namespace PixiMixins {
    interface Container {
      baseWidth: number;
      baseHeight: number;
      resize(width?: number, height?: number): void;
    }

    interface Sprite {
      resize(width?: number, height?: number): void;
    }
  }
}

export type HTMLContainerConfig = {
  htmlContent: string;
  cssContent: string;
};

export {};
