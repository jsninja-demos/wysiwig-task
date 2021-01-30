import { getAllNodes } from "./converter";

export const Cleaner = {
  clear(target: Node) {
    clearEmptyDecorators(target);
  },
};

function clearEmptyDecorators(target: Node) {
  getAllNodes(Array.from(target.childNodes))
    .filter((n) => n instanceof Element)
    .filter((element) => !Boolean((element as Element).innerHTML))
    .forEach((element) => element.parentNode?.removeChild(element));
}
