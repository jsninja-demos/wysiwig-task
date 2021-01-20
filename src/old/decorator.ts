import { isElement } from "./makeDecorator";
import { isDecorator } from "./template";

export const Decorator = {
  is(node: unknown | unknown[]): node is Element {
    try {
      return Array.isArray(node)
        ? node.every((v) => this.is(v))
        : (node as Element).hasAttribute("data-decorator");
    } catch {
      return false;
    }
  },

  eq(t1: Element, t2: Element): boolean {
    return (
      t1.getAttribute("data-decorator") === t2.getAttribute("data-decorator")
    );
  },

  hasType(targetNode: unknown, decoratorName: string): boolean {
    const isDecor = this.is(targetNode);
    return isDecor
      ? (targetNode as Element).hasAttribute(`data-decorator=${decoratorName}`)
      : false;
  },

  getInner(target: Node): string {
    return (target as Element).innerHTML;
  },

  getDecorator(targetNode: Node): Element {
    let copy = targetNode.parentElement;
    while (!isDecorator(copy)) {
      // @ts-ignore
      copy = copy?.parentElement!;
    }
    return copy;
  },
};
