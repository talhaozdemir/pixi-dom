import { Container, Renderer } from "pixi.js";

export class Responsive {
  renderer: Renderer<HTMLCanvasElement>;
  stage: Container;
  constructor(renderer: Renderer<HTMLCanvasElement>, stage: Container) {
    this.renderer = renderer;
    this.stage = stage;
    window.addEventListener("resize", this.resize.bind(this));

    this.resize();
  }

  resize(): void {
    const width: number = window.innerWidth;
    const height: number = window.innerHeight;

    this.renderer.resize(width, height);
    this.stage.baseWidth = width;
    this.stage.baseHeight = height;

    const allChildren = this.getAllChildren(this.stage);
    for (let i = 0; i < allChildren.length; i++) {
      const child = allChildren[i];
      const childParent = child.parent as Container;

      if (childParent && child.resize) {
        child.resize(childParent.baseWidth, childParent.baseHeight);
      }
    }
  }

  private getAllChildren(container: Container): Container[] {
    let children: Container[] = [];
    container.children.forEach((child) => {
      children.push(child);
      if (child instanceof Container) {
        children = children.concat(this.getAllChildren(child));
      }
    });
    return children;
  }
}
