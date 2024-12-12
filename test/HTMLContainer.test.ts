import "../src/index";
import { HTMLContainer } from "../src/index";

describe("HTMLContainer", () => {
  describe("initializeRootDiv", () => {
    it("should be added to prototype", () => {
      const htmlContainer = new HTMLContainer({
        htmlContent: "<div></div>",
        cssContent: "div { color: red; }",
      });

      expect("initializeRootDiv" in htmlContainer).toBe(true);
    });
  });
});
