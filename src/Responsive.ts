import { Container, Point, Renderer } from "pixi.js";

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
    const orientedData = window.innerWidth > window.innerHeight && child.resizeData?.landscape ? child.resizeData?.landscape : child.resizeData?.portrait;

    if (!orientedData?.scale) return;

    const childParent = child.parent as Container;

    if (orientedData.scale.type === "absolute") {
      child.scale.set(orientedData.scale.x, orientedData.scale.y);
    } else {
      const parentWidth = childParent.baseWidth;
      const parentHeight = childParent.baseHeight;
      const widthRatio = (parentWidth * orientedData.scale.x) / child.baseWidth;
      const heightRatio = (parentHeight * orientedData.scale.y) / child.baseHeight;

      let scaleX: number;
      let scaleY: number;
      if (orientedData.scale.fit === "min") {
        scaleX = scaleY = Math.min(widthRatio, heightRatio);
      } else if (orientedData.scale.fit === "max") {
        scaleX = scaleY = Math.max(widthRatio, heightRatio);
      } else {
        scaleX = widthRatio;
        scaleY = heightRatio;
      }

      child.scale.set(scaleX, scaleY);
    }
  }

  private locateChildWithResizeData(child: Container): void {
    const orientedData = window.innerWidth > window.innerHeight && child.resizeData?.landscape ? child.resizeData?.landscape : child.resizeData?.portrait;

    const childParent = child.parent as Container;

    const position = new Point();
    const parentWidth = childParent.baseWidth;
    const parentHeight = childParent.baseHeight;
    const childWidth = child.baseWidth * child.scale.x;
    const childHeight = child.baseHeight * child.scale.y;

    if (orientedData?.location) {
      if (orientedData.location?.x === "left") {
        position.x = 0;
      } else if (orientedData.location?.x === "center") {
        position.x = parentWidth * 0.5;
      } else if (orientedData.location?.x === "right") {
        position.x = parentWidth;
      }

      if (orientedData.location?.y === "top") {
        position.y = 0;
      } else if (orientedData.location?.y === "center") {
        position.y = parentHeight * 0.5;
      } else if (orientedData.location?.y === "bottom") {
        position.y = parentHeight;
      }
    }

    if (orientedData?.offset) {
      if (orientedData.offset?.unit === "px") {
        position.x += orientedData.offset.x;
        position.y += orientedData.offset.y;
      } else if (orientedData.offset?.unit === "pct") {
        position.x += parentWidth * orientedData.offset.x;
        position.y += parentHeight * orientedData.offset.y;
      } else if (orientedData.offset?.unit === "self") {
        position.x += childWidth * orientedData.offset.x;
        position.y += childHeight * orientedData.offset.y;
      }
    }

    child.position.set(position.x, position.y);
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
