import "../src/index";
import { Container } from "../src/index";

describe("HTMLContainer", () => {
  describe("initializeRootDiv", () => {
    it("should be added to prototype", () => {
      const htmlContainer = new Container({
        debug: {
          enabled: false,
          color1: 0xffffff,
          color2: 0xff0000,
        },
        html: "<div></div>",
        css: "div { width: 100px; height: 100px; }",
      });

      expect("initializeRootDiv" in htmlContainer).toBe(true);
    });
  });
});
