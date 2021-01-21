export type SelectionContext = {
  highlight: Selection;
  anchor: {
    node: Node;
    offset: number;
  };
  focus: {
    node: Node;
    offset: number;
  };
  range: Range;
  commonContainer: Node;
};

export function getSelectionContext(): SelectionContext | null {
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
