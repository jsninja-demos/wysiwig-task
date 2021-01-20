import { Decorator } from "./decorator";
import { isElement } from "./makeDecorator";

export const DecoratorsMerger = {
  mergeNear(
    rootNode: Node,
    templateWithoutInner: HTMLElement,
    userRange: Range
  ) {
    Array.from(rootNode.childNodes)
      .filter((v) => v.nodeValue !== "")
      .forEach((ch, index, array) => {
        const next = array[index + 1];

        if (!next) {
          return;
        }

        const canMerge = this.canMErgeDecorators(ch, next);

        // console.log("canMerge", canMerge);

        if (canMerge) {
          console.log(Decorator.getInner(ch as Element));
          console.log(next);
          const unwrap1 = Decorator.getInner(ch);
          const unwrap2 = Decorator.getInner(next);

          templateWithoutInner.innerHTML = unwrap1 + unwrap2;
          ch.parentNode!.removeChild(ch);
          next.parentNode!.removeChild(next);
          // userRange.insertNode(templateWithoutInner);
        }
      });
  },

  canMErgeDecorators(ch: ChildNode, next: ChildNode): boolean {
    const canMerge =
      isElement([ch, next]) &&
      Decorator.is([ch, next]) &&
      Decorator.eq(ch as Element, next as Element);
    return canMerge;
  },
  findParentNode() {},
};
