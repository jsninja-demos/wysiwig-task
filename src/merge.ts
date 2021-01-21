import { DECORATOR_NAME_ATTRIBUTE, newDecorator } from "./decorator";

export const Merger = {
  merge(editorNode: Node) {
    editorNode.childNodes.forEach((ch) => mergeNearDecorators(ch));
  },
};

function mergeNearDecorators(targetNode: Node) {
  if (targetNode.hasChildNodes()) {
    targetNode.childNodes.forEach((chn) => mergeNearDecorators(chn));
    console.log("targetNode", targetNode);
    Array.from(targetNode.childNodes)
      .filter((v) => v.nodeValue !== "")
      .forEach((ch, index, array) => {
        const next = array[index + 1];

        if (
          next instanceof Element &&
          ch instanceof Element &&
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
