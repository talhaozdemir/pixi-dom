// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="../global.d.ts" />

import { Container } from "pixi.js";
import { PixiCssConfig } from "../global";

/**
 * Global PixiJS namespace.
 * @namespace PIXI
 * @see https://pixijs.download/main/docs/PIXI.html
 */

export class PixiCss extends Container {
  htmlContent: string;
  cssContent: string;
  constructor(config: PixiCssConfig) {
    super();

    this.htmlContent = config.htmlContent;
    this.cssContent = config.cssContent

    this.init();
  }

  init() {

  }
}