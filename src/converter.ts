function getAllNodes(targets: Node[]): Node[] {
  const result: Node[] = [];

  targets.forEach((n) => {
    if (n instanceof Element && n.hasChildNodes()) {
      const second = getAllNodes(Array.from(n.childNodes));
      second.forEach((c) => result.push(c));
    }
    result.push(n);
  });
  return result;
}
