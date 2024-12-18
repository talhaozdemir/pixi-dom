# PIXI Responsive Plugin

<a href="https://pixi-dom.web.app/" target="_blank">LIVE DEMO</a>

The **PIXI Responsive Plugin** is a powerful utility designed for developers who want to create responsive and dynamic layouts in PixiJS using HTML and CSS. By integrating DOM layout strategies directly into the PixiJS rendering pipeline, this plugin allows for seamless use of grid systems, alignment, scaling, and responsive design features within a PixiJS stage.

## Features and Advantages

### Key Features

- **HTML and CSS Integration**: Use standard HTML and CSS to define layouts and styles, eliminating the need for complex manual positioning.
- **Responsive Design**: Handles resizing and orientation changes automatically, ensuring layouts adapt seamlessly to different screen sizes.
- **Debugging Tools**: Built-in debug mode for visualizing grid layouts and container boundaries.
- **Flexibility**: Supports both predefined resize behaviors and custom resize functions for fine-grained control.

### Advantages

1. **Ease of Use**: Simplifies layout design with familiar HTML and CSS concepts.
2. **Performance**: Leverages PixiJS’s GPU-accelerated rendering while maintaining lightweight, responsive designs.
3. **Extensibility**: Allows custom resize logic for advanced use cases.
4. **Scalability**: Ideal for building complex UI systems, including games, dashboards, and applications with dynamic layouts.

---

## Getting Started

### Installation

Include the following script files in your project:

```js
import * as PixiResponsive from "./pixi-responsive.js";
// import { Container, Responsive } from "./pixi-responsive"
```

Ensure that the `pixi-responsive.js` file is located in the correct path relative to your project directory.

---

### Basic Usage

#### 1. Initialize the PixiJS Application

```javascript
const app = new PIXI.Application();
await app.init({ resizeTo: window, preference: "webgl", backgroundColor: 0x2c3e50 });
document.body.appendChild(app.canvas);
const { stage, renderer } = app;
```

#### 2. Define the HTML and CSS Layout

```javascript
const htmlCont = new PixiResponsive.Container({
  debug: {
    enabled: true,
    color1: 0x92b7d1,
    color2: 0x2d86c4,
  },
  html: `
    <div class="grid">
        <div class="hud" style="grid-area: hud;">hud</div>
        <div class="game" style="grid-area: game;">game</div>
        <div class="ads" style="grid-area: ads;"></div>
    </div>`,
  css: `
    @media (orientation: portrait) {
      .grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-areas:
        "hud hud"
        "game game"
        "ads ads";
        grid-template-rows: 128px 1fr 64px;
        grid-template-columns: 1fr 6fr;
      }
    }

    @media (orientation: landscape) {
      .grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-areas:
        "hud game"
        "hud game"
        "hud ads";
        grid-template-rows: 128px 1fr 48px;
        grid-template-columns: 2fr 6fr;
      }
    }
  `,
});
stage.addChild(htmlCont);
```

#### 3. Add Game Objects

```javascript
const gameArea = htmlCont.getChildByLabel("game");
const bunnyTexture = await PIXI.Assets.load("https://pixijs.com/assets/bunny.png");

const redBunny = PIXI.Sprite.from(bunnyTexture);
redBunny.anchor.set(0.5);
redBunny.tint = 0xff0000;
redBunny.baseWidth = redBunny.texture.orig.width;
redBunny.baseHeight = redBunny.texture.orig.height;

redBunny.resizeData = {
  portrait: {
    align: {
      x: "center", // left, center, right
      y: "center", // top, center, bottom
    },
    offset: {
      unit: "self", // px, pct, self
      x: 0,
      y: 0,
    },
    scale: {
      type: "relative", // absolute, relative
      fit: "min", // min, max, stretch
      x: 0.25,
      y: 0.25,
    },
  },
  landscape: {
    align: { x: "left", y: "top" },
    offset: { unit: "self", x: 0.5, y: 0.5 },
    scale: { type: "relative", fit: "min", x: 0.25, y: 0.25 },
  },
};

gameArea.addChild(redBunny);
```

#### 4. Enable Responsive Behavior

```javascript
new PixiResponsive.Responsive(renderer, stage);
```

---

### Advanced Features

#### Custom Resize Functions

For complete control over resize behavior, you can define a custom resize function:

```javascript
blueBunny.resize = (w, h) => {
  const wRatio = (w * 0.4) / blueBunny.baseWidth;
  const hRatio = (h * 0.5) / blueBunny.baseHeight;
  blueBunny.scale.set(Math.min(wRatio, hRatio));
};
```

---

## Debugging and Optimization

### Debug Mode

Enable debug mode to visualize layout areas and verify alignment:

```javascript
htmlCont.debug = { enabled: true, color1: 0x92b7d1, color2: 0x2d86c4 };
```

### Performance Tips

- Minimize the complexity of HTML and CSS to improve rendering performance.
- Use the `baseWidth` and `baseHeight` properties for all game objects to ensure proper scaling.

---

### Important: Define baseWidth and baseHeight Properties

To ensure proper scaling and responsive behavior of game objects in your layout, it is crucial to define the baseWidth and baseHeight properties for each object. These properties determine the original dimensions of objects before any resizing or scaling occurs.

```javascript
// You can use texture.orig for objects that have texture
redBunny.baseWidth = redBunny.texture.orig.width;
redBunny.baseHeight = redBunny.texture.orig.height;
// or you can use localBounds
const lb = redBunny.getLocalBounds();
redBunny.baseWidth = lb.width;
redBunny.baseHeight = lb.height;
```

Without these properties, your objects might not scale correctly, leading to unexpected behavior and layout issues. Always define baseWidth and baseHeight to guarantee that your game objects resize properly in all scenarios.

## Conclusion

The PIXI Responsive Plugin bridges the gap between traditional web layout techniques and PixiJS’s rendering capabilities. By leveraging familiar HTML and CSS workflows, developers can focus on creating visually rich, responsive designs with minimal effort. Whether you're building a game UI or a data visualization dashboard, this plugin offers a robust and scalable solution.
