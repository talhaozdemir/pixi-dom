import { Container, Graphics } from "pixi.js";
import { HTMLContainerConfig } from "../global";

export class HTMLContainer extends Container {
  rootDiv: HTMLDivElement;
  _htmlContent: string;
  _cssContent: string;
  styleTag: HTMLStyleElement;
  htmlChildren: HTMLElement[] = [];
  _debug: {
    enabled: boolean;
    color1: number;
    color2: number;
  } = {
    enabled: false,
    color1: 0x92b7d1,
    color2: 0x2d86c4,
  };

  constructor(config: HTMLContainerConfig) {
    super();

    this._debug = config.debug;
    
    // Remove all newlines and extra spaces from the HTML and CSS content
    this._htmlContent = config.htmlContent.replace(/\n/g, "").replace(/\s{2,}/g, "");
    this._cssContent = config.cssContent.replace(/\n/g, "").replace(/\s{2,}/g, "");

    this.baseWidth = 800;
    this.baseHeight = 600;

    this.initializeRootDiv();
    this.injectCss();
    this.appendRootToBody();
    this.collectHtmlChildren(this.rootDiv);
    this.renderDom();
  }

  initializeRootDiv() {
    this.rootDiv = document.createElement("div");
    this.rootDiv.style.pointerEvents = "none";
    this.rootDiv.style.position = "absolute";
    this.rootDiv.style.top = "0";
    this.rootDiv.style.left = "0";
    this.rootDiv.style.width = "100%";
    this.rootDiv.style.height = "100%";
    this.rootDiv.innerHTML = this._htmlContent;
  }

  injectCss() {
    this.styleTag = document.createElement("style");
    this.styleTag.textContent = this._cssContent;
    document.head.appendChild(this.styleTag);
  }

  appendRootToBody() {
    document.body.appendChild(this.rootDiv);
  }

  renderDom() {
    let debugColors: number[] = [];
    let debugGraphics = null;

    if (this._debug?.enabled) {
      debugGraphics = new Graphics();
      this.addChildAt(debugGraphics, 0);
    }

    this.resize = () => {
      if (this._debug?.enabled) {
        debugGraphics.clear();
      }
    };

    if (this._debug?.enabled) {
      debugColors = generateColors(this.htmlChildren.length, this._debug?.color1, this._debug?.color2);
    }

    this.htmlChildren.forEach((child, i) => {
      const wrapper = new Container();

      this.addChild(wrapper);
      wrapper.label = child.id || child.className || `Element_${i}`;

      wrapper.resize = () => {
        const rect = child.getBoundingClientRect();
        wrapper.baseWidth = rect.width;
        wrapper.baseHeight = rect.height;
        wrapper.position.set(rect.x, rect.y);

        console.log({
          name: wrapper.label,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        });

        if (this._debug?.enabled) {
          debugGraphics.rect(rect.x, rect.y, rect.width, rect.height);
          debugGraphics.fill({ color: debugColors[i] });
        }

        // sprite.resize(wrapper.baseWidth, wrapper.baseHeight);
      };

      wrapper.resize();
    });
  }

  collectHtmlChildren(parent: HTMLElement) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i] as HTMLElement;
      this.htmlChildren.push(child);
      this.collectHtmlChildren(child);
    }
  }

  getWrapperByLabel(label: string): Container | undefined {
    return this.children.find((child) => child.label === label);
  }

  destroy() {
    // Clean up when destroying the object
    if (this.rootDiv.parentElement) {
      this.rootDiv.parentElement.removeChild(this.rootDiv);
    }
  }
}

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
