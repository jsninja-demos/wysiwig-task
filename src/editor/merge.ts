import { getAllNodes } from "./converter";
import { DECORATOR_NAME_ATTRIBUTE, newDecorator } from "./decorator";
import { isLine } from "./line";

export const Merger = {
  merge(editorNode: Node) {
    editorNode.childNodes.forEach((ch) => mergeNearDecorators(ch));
    editorNode.childNodes.forEach((ch) => mergeNestedDecorators(ch));
  },
};

function mergeNearDecorators(targetNode: Node) {
  if (targetNode.hasChildNodes()) {
    targetNode.childNodes.forEach((chn) => mergeNearDecorators(chn));
    Array.from(targetNode.childNodes)
      .filter((v) => v.nodeValue !== "")
      .filter((v) => isLine(v))
      .forEach((ch, index, array) => {
        const next = array[index + 1];

        if (
          next instanceof Element &&
          ch instanceof Element &&
          Boolean(ch.getAttribute(DECORATOR_NAME_ATTRIBUTE)) &&
          Boolean(next.getAttribute(DECORATOR_NAME_ATTRIBUTE)) &&
          ch.getAttribute(DECORATOR_NAME_ATTRIBUTE) ==
            next.getAttribute(DECORATOR_NAME_ATTRIBUTE)
        ) {
          const innerCh = ch.innerHTML;
          const innerNext = next.innerHTML;

          const decoratorName = ch.getAttribute(DECORATOR_NAME_ATTRIBUTE)!;
          const decoratorClass = ch.classList.toString();
          const decoratorTag = ch.tagName;

          const newDec = newDecorator({
            className: decoratorClass,
            decoratorName,
            tagName: decoratorTag,
          });

          newDec.innerHTML = innerCh + innerNext;

          targetNode!.removeChild(ch);
          targetNode!.replaceChild(newDec, next);
        }
      });
  }
}

function mergeNestedDecorators(targetNode: Node) {
  if (targetNode.hasChildNodes()) {
    const decorators = Array.from(targetNode.childNodes)
      .filter((v) => v.nodeValue !== "")
      .filter((v) => v instanceof Element);

    decorators.forEach((d) => {
      const allDecoratorNodes = getAllNodes(Array.from(d.childNodes));

      const currentDecoratorNodes = allDecoratorNodes
        .filter((v) => v instanceof Element)
        .filter(
          (v) =>
            (v as Element).getAttribute(DECORATOR_NAME_ATTRIBUTE) ===
            (d as Element).getAttribute(DECORATOR_NAME_ATTRIBUTE)
        );

      currentDecoratorNodes.forEach((dn) => {
        const parent = dn.parentNode!;
        parent.replaceChild(
          document.createTextNode((dn as Element).textContent!),
          dn
        );
      });
    });
  }
}
