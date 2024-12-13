import * as PIXI from "pixi.js";
import { HTMLContainerConfig } from "../global";

/**
 * Global PixiJS namespace.
 * @namespace PIXI
 * @see https://pixijs.download/release/docs/index.html
 */

export class Container extends PIXI.Container {

  /**
  * This is a holder wrapper that contains HTML elements.
  */
  public rootDiv: HTMLDivElement;

  /**
  *  This is an array of all the HTML elements that are present in the rootDiv.
  */
  public htmlElements: HTMLElement[] = [];

  /**
   * The HTML content that will be injected into the rootDiv.
   */
  private _htmlContent: string;

  /**
   * The CSS content that will be injected into the head tag.
   */
  private _cssContent: string;

  /**
   * The style tag that will include the CSS content.
   */
  private _styleTag: HTMLStyleElement;

  /**
   * The debug configuration object. A Graphics object will be created to visualize the HTML elements.
   * Instead of using debug mode, you can also play with the zIndex of the rootDiv  
   * Length of htmlElements array will determine the number of colors generated between color1 and color2.
   * This object contains the following properties:
   * @param {boolean} enabled - A boolean that enables or disables the debug mode.
   * @param {number} color1 - The start color of the debug mode.
   * @param {number} color2 - The end color of the debug mode.
   */
  private _debug: {
    enabled: boolean;
    color1: number;
    color2: number;
  } = {
      enabled: false,
      color1: 0x92b7d1,
      color2: 0x2d86c4,
    };

  /**
   * The constructor of the Container class.
   * @param {HTMLContainerConfig} config - The configuration object for the Container class.
   * @param {string} config.html - The HTML content that will be injected into the rootDiv.
   * @param {string} config.css - The CSS content that will be injected into the head tag for the rootDiv.
   * @param {object} config.debug - The debug configuration object.
   */
  constructor(config: HTMLContainerConfig) {
    super();

    this._debug = config.debug;

    // Remove all newlines and extra spaces from the HTML and CSS content
    this._htmlContent = config.html.replace(/\n/g, "").replace(/\s{2,}/g, "");
    this._cssContent = config.css.replace(/\n/g, "").replace(/\s{2,}/g, "");

    this.initializeRootDiv();
    this.injectCss();
    this.appendRootToBody();
    this.collectHtmlElements(this.rootDiv);
    this.renderDom();
  }

  /**
   * Initializes the rootDiv and sets its style properties.
   */
  private initializeRootDiv() {
    this.rootDiv = document.createElement("div");
    this.rootDiv.style.pointerEvents = "none";
    this.rootDiv.style.position = "absolute";
    this.rootDiv.style.top = "0";
    this.rootDiv.style.left = "0";
    this.rootDiv.style.width = "100%";
    this.rootDiv.style.height = "100%";
    this.rootDiv.innerHTML = this._htmlContent;
  }

  /**
   * Inject the CSS content into the head tag.
   */
  private injectCss() {
    this._styleTag = document.createElement("style");
    this._styleTag.textContent = this._cssContent;
    document.head.appendChild(this._styleTag);
  }

  /**
   * This method appends the rootDiv to the body tag.
   */
  private appendRootToBody() {
    document.body.appendChild(this.rootDiv);
  }

  /**
   * Render the HTML elements into the PIXI Container object.
   */
  private renderDom() {
    let debugColors: number[] = [];
    let debugGraphics = null;

    if (this._debug?.enabled) {
      debugGraphics = new PIXI.Graphics();
      debugGraphics.label = "debugGraphics";
      this.addChildAt(debugGraphics, 0);
    }

    this.resize = () => {
      if (this._debug?.enabled) {
        debugGraphics.clear();
      }
    };

    if (this._debug?.enabled) {
      debugColors = generateColors(this.htmlElements.length, this._debug?.color1, this._debug?.color2);
    }

    this.htmlElements.forEach((child, i) => {
      const wrapper = new PIXI.Container();

      this.addChild(wrapper);
      wrapper.label = child.id || child.className || `Element_${i}`;

      wrapper.resize = () => {
        const rect = child.getBoundingClientRect();
        wrapper.baseWidth = rect.width;
        wrapper.baseHeight = rect.height;
        wrapper.position.set(rect.x, rect.y);

        // console.log({
        //   name: wrapper.label,
        //   x: rect.x,
        //   y: rect.y,
        //   width: rect.width,
        //   height: rect.height,
        // });

        if (this._debug?.enabled) {
          debugGraphics.rect(rect.x, rect.y, rect.width, rect.height);
          debugGraphics.fill({ color: debugColors[i] });
        }
      };

      wrapper.resize();
    });
  }

  /**
   * This method collects all the HTML elements that are present in the rootDiv.
   * @param {HTMLElement} parent - The parent HTML element.
   */
  private collectHtmlElements(parent: HTMLElement) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i] as HTMLElement;
      if (child.tagName !== "DIV") {
        continue;
      }
      this.htmlElements.push(child);
      this.collectHtmlElements(child);
    }
  }

  /**
   * Returns the PIXI.Container object that has the same label as the input.
   * @param {string} label - The label of the Container object.
   * @returns {PIXI.Container | undefined} - The PIXI.Container object that has the same label as the input.
   */
  public getElementByLabel(label: string): PIXI.Container | undefined {
    return this.children.find((child) => child.label === label);
  }

  /**
   * Destroys the Container object and removes the rootDiv and styleTag from the DOM.
   */
  public destroy(...args: any[]): void {

    super.destroy(...args);

    if (this.rootDiv.parentElement) {
      this.rootDiv.parentElement.removeChild(this.rootDiv);
    }

    if (this._styleTag.parentElement) {
      this._styleTag.parentElement.removeChild(this._styleTag);
    }
  }
}

/**
 * This function generates an array of colors between the startColor and endColor.
 * @param {number} count - The number of colors to generate.
 * @param {number} startColor - The start color of the gradient.
 * @param {number} endColor - The end color of the gradient.
 * @returns {number[]} - An array of colors between the startColor and endColor.
 */
function generateColors(count: number, startColor: number, endColor: number): number[] {
  const colors = [];
  const startR = (startColor >> 16) & 0xff;
  const startG = (startColor >> 8) & 0xff;
  const startB = startColor & 0xff;

  const endR = (endColor >> 16) & 0xff;
  const endG = (endColor >> 8) & 0xff;
  const endB = endColor & 0xff;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const r = Math.round(startR + t * (endR - startR));
    const g = Math.round(startG + t * (endG - startG));
    const b = Math.round(startB + t * (endB - startB));
    const color = (r << 16) | (g << 8) | b;
    colors.push(color);
  }
  return colors;
}
