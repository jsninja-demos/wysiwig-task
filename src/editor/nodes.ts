export function getNodesBetweenNodes(
  common: Node,
  first: Node,
  second: Node
): Node[] {
  const result: Node[] = [];
  let canPush = false;

  common.childNodes.forEach((currentNode) => {
    if (currentNode.contains(first)) {
      canPush = true;
      return;
    }

    if (currentNode.contains(second)) {
      canPush = false;
    }

    if (canPush) {
      result.push(currentNode);
    }
  });

  return result;
}

export function getLineChildren(nodes: Node[]): Node[] {
  const result: Node[] = [];

  nodes.forEach((node) => {
    if (node instanceof Element && node.nodeName === "P") {
      return result.push(...Array.from(node.childNodes));
    }

    return result.push(node);
  });

  return result;
}
