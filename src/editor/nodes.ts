export function getNodesBetweenNodes(
  common: Node,
  first: Node,
  second: Node
): Node[] {
  const result: Node[] = [];
  let canPush = false;

  common.childNodes.forEach((currentNode) => {
    if (currentNode.contains(first) || currentNode.contains(second)) {
      canPush = true;
      return;
    }

    if (currentNode.contains(second) || currentNode.contains(first)) {
      canPush = false;
      return;
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

  console.log("getLineChildren", result);

  return result;
}
