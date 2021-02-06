import { debug } from "webpack";
import { isLine } from "./line";

export function getNodesBetweenNodes(
  rootNode: Node,
  first: Node,
  second: Node
): Node[] {
  const result: Node[] = [];
  let canPush = false;

  if (rootNode.isSameNode(first) && first.isSameNode(second)) {
    return [];
  }

  rootNode.childNodes.forEach((node) => {
    if (canPush && !result.length) {
      result.push(node);
    }
    if (node.contains(first) || node.contains(second)) {
      canPush = !canPush;
    }
  });

  return result;
}

function isDescendant(parent: Node, child: Node) {
  return parent.contains(child);
}

export function getLineChildren(nodes: Node[]): Node[] {
  const result: Node[] = [];

  nodes.forEach((node) => {
    if (node instanceof Element && isLine(node)) {
      return result.push(...Array.from(node.childNodes));
    }

    return result.push(node);
  });

  return result;
}
