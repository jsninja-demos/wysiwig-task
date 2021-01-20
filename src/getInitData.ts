export type InitDataType = ReturnType<typeof getInitData>;

export function getInitData() {
  const highlight = window.getSelection()!;

  if (highlight.isCollapsed) {
    return null;
  }

  const { anchorNode, anchorOffset, focusNode, focusOffset } = highlight;

  if (!anchorNode || !focusNode) {
    return null;
  }

  const range = highlight.getRangeAt(0);

  const commonContainer = range.commonAncestorContainer;

  return {
    highlight,
    anchor: {
      node: anchorNode,
      offset: anchorOffset,
    },
    focus: {
      node: focusNode,
      offset: focusOffset,
    },
    range,
    commonContainer,
  };
}
