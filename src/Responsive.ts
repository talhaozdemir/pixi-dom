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

      if (childParent) {
        if (child.resizeData) {
          this.scaleChildWithResizeData(child);
          this.locateChildWithResizeData(child);
        }
        if (child.resize) child.resize(childParent.baseWidth, childParent.baseHeight);
      }
    }
  }

  private scaleChildWithResizeData(child: Container): void {
    const childParent = child.parent as Container;

    if (child.resizeData.portrait.scale.type === "absolute") {
      child.scale.set(
        child.resizeData.portrait.scale.x,
        child.resizeData.portrait.scale.y
      )
    } else {
      const parentWidth = childParent.baseWidth;
      const parentHeight = childParent.baseHeight;
      const widthRatio = (parentWidth * child.resizeData.portrait.scale.x) / child.baseWidth;
      const heightRatio = (parentHeight * child.resizeData.portrait.scale.y) / child.baseHeight;

      let scaleX: number;
      let scaleY: number;
      if (child.resizeData.portrait.scale.fit === "min") {
        scaleX = scaleY = Math.min(widthRatio, heightRatio);
      } else if (child.resizeData.portrait.scale.fit === "max") {
        scaleX = scaleY = Math.max(widthRatio, heightRatio);
      } else {
        scaleX = widthRatio;
        scaleY = heightRatio;
      }

      child.scale.set(scaleX, scaleY);
    }
  }

  private locateChildWithResizeData(child: Container): void {
    const childParent = child.parent as Container;

    if (child.resizeData.portrait.location) {
      const parentWidth = childParent.baseWidth;
      const parentHeight = childParent.baseHeight;
      const childWidth = child.baseWidth * child.scale.x;
      const childHeight = child.baseHeight * child.scale.y;

      let x: number;
      let y: number;
      if (child.resizeData.portrait.location.x === "left") {
        x = 0
      } else if (child.resizeData.portrait.location.x === "center") {
        x = parentWidth * 0.5;
      } else {
        x = parentWidth;
      }

      if (child.resizeData.portrait.location.y === "top") {
        y = 0
      } else if (child.resizeData.portrait.location.y === "center") {
        y = parentHeight * 0.5;
      } else {
        y = parentHeight;
      }

      if (child.resizeData.portrait.offset.unit === "px") {
        x += child.resizeData.portrait.offset.x;
        y += child.resizeData.portrait.offset.y;
      } else if (child.resizeData.portrait.offset.unit === "pct") {
        x += parentWidth * child.resizeData.portrait.offset.x;
        y += parentHeight * child.resizeData.portrait.offset.y;
      } else {
        x += childWidth * child.resizeData.portrait.offset.x;
        y += childHeight * child.resizeData.portrait.offset.y;
      }

      child.position.set(x, y);
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
