/**
 * PixiJS uses a special global type object called GlobalMixins
 * this can be used to add methods to existing PixiJS classes.
 */
declare namespace PixiMixins {
  interface Container {
    baseWidth: number;
    baseHeight: number;
    resize(width: number, height: number): void;
  }
}


export type PixiCssConfig = {
  htmlContent: string;
  cssContent: string;
};