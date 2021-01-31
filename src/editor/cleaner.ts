import { getAllNodes } from "./converter";

export const Cleaner = {
  clear(target: Node) {
    clearEmptyDecorators(target);
  },
};

function clearEmptyDecorators(target: Node) {
  getAllNodes(Array.from(target.childNodes))
    .filter((n) => n instanceof Element)
    .filter((elem) => (elem as Element).innerHTML === "")
    .forEach((elem) => {
      (elem as Element).parentNode?.removeChild(elem);
      clearEmptyDecorators(target);
    });
}
