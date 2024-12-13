/**
 * PixiJS uses a special global type object called GlobalMixins
 * this can be used to add methods to existing PixiJS classes.
 */
declare global {
  namespace PixiMixins {
    interface Container {
      baseWidth: number;
      baseHeight: number;
      resizeData?: ResizeData;
      resize(width?: number, height?: number): void;
    }

    interface Sprite {
      resize(width?: number, height?: number): void;
    }
  }
}

export type ResizeData = {
  portrait: ResizeDataProps;
  landscape?: ResizeDataProps;
};

export type ResizeDataProps = {
  align?: {
    x: "left" | "center" | "right";
    y: "top" | "center" | "bottom";
  };
  offset?: {
    unit: "px" | "pct" | "self";
    x: number;
    y: number;
  };
  scale?: {
    type: "absolute" | "relative";
    fit: "min" | "max" | "stretch";
    x: number;
    y: number;
  };
};

export type HTMLContainerConfig = {
  debug: {
    enabled: boolean;
    color1: number;
    color2: number;
  };
  html: string;
  css: string;
};

export { };
