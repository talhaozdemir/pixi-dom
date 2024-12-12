import { Container, Sprite, Texture } from "pixi.js";
import { HTMLContainerConfig } from "../global";

export class HTMLContainer extends Container {
  rootDiv: HTMLDivElement;
  htmlContent: string;
  cssContent: string;
  styleTag: HTMLStyleElement;
  htmlChildren: HTMLElement[] = [];
  constructor(config: HTMLContainerConfig) {
    super();

    this.htmlContent = config.htmlContent;
    this.cssContent = config.cssContent;

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
    this.rootDiv.innerHTML = this.htmlContent;
  }

  injectCss() {
    this.styleTag = document.createElement("style");
    this.styleTag.textContent = this.cssContent;
    document.head.appendChild(this.styleTag);
  }

  appendRootToBody() {
    document.body.appendChild(this.rootDiv);
  }

  renderDom() {
    this.htmlChildren.forEach((child, i) => {
      const wrapper = new Container();

      this.addChild(wrapper);
      wrapper.label = child.id || child.className || `Element_${i}`;

      const sprite = new Sprite(Texture.WHITE);
      sprite.tint = Math.random() * 0xffffff;
      wrapper.addChild(sprite);

      sprite.resize = (width: number, height: number) => {
        sprite.width = width;
        sprite.height = height;
      };

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

        sprite.resize(wrapper.baseWidth, wrapper.baseHeight);
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
