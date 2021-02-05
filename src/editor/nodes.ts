import { isLine } from "./line";

export function getNodesBetweenNodes(
  rootNode: Node,
  node1: Node,
  node2: Node
): Node[] {
  let resultNodes = [];
  let isBetweenNodes = false;

  if (rootNode.isSameNode(node1) && node1.isSameNode(node2)) {
    return [];
  }

  for (let i = 0; i < rootNode.childNodes.length; i++) {
    const currentChild = rootNode.childNodes[i];

    if (
      isDescendant(currentChild, node1) ||
      isDescendant(currentChild, node2)
    ) {
      isBetweenNodes = resultNodes.length === 0;
      resultNodes.push(currentChild);
    } else if (isBetweenNodes) {
      resultNodes.push(currentChild);
    }
  }

  return resultNodes.slice(1, -1);
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
