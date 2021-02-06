import { getAllNodes } from "./converter";
import { DECORATOR_NAME_ATTRIBUTE } from "./decorator";

const supportedAttributes = ["class", DECORATOR_NAME_ATTRIBUTE];

export function sanitizeAttributes(node: Node) {
  const allDecorators = getAllNodes(Array.from([node])).filter(
    (n) => n instanceof Element
  );

  allDecorators.forEach((el) => (el as Element).setAttribute("style", ""));

  (allDecorators as Element[]).forEach((node) => {
    for (
      let i = 0, attributes = node.attributes, n = attributes.length;
      i < n;
      i++
    ) {
      let att = attributes[i].nodeName;
      if (!att) {
        return;
      }
      if (!supportedAttributes.includes(att)) {
        node.removeAttribute(att);
      }
    }
  });
}
