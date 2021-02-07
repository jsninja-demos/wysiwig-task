import { isLine } from "./line";

export function getNodesBetweenNodes(
  rootNode: Node,
  first: Node,
  second: Node
): Node[] {
  let result: Node[] = [];
  let cahPush = false;

  if (rootNode.isSameNode(first) && first.isSameNode(second)) {
    return [];
  }

  rootNode.childNodes.forEach((node) => {
    if (node.contains(first) || node.contains(second)) {
      cahPush = result.length === 0;
      result.push(node);
    } else if (cahPush) {
      result.push(node);
    }
  });

  return result.slice(1, -1);
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
