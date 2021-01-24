export function createDefaultRange(node: Node): Range {
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, 0);
  return range;
}
