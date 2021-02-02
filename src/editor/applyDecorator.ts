import {
  decorateAnchorNode,
  decorateFocusNode,
  DecoratorActions,
  DECORATOR_NAME_ATTRIBUTE,
  IViewDecorator,
  newDecorator,
  wrapNodes,
} from "./decorator";
import { getSelectionContext, SelectionContext } from "./getInitData";
import { sanitizeAttributes } from "./sanitizeHtml";
import { Cleaner } from "./cleaner";
import { getLineChildren, getNodesBetweenNodes } from "./nodes";

export function applyDecorator(editor: Node, decorator: IViewDecorator) {
  sanitizeAttributes(editor);
  insertDecorator(decorator);
  Cleaner.clear(editor);
}

function insertDecorator(decorator: IViewDecorator) {
  const selectionContext = getSelectionContext();

  if (!selectionContext) {
    return;
  }

  const { anchor, focus, commonContainer, range, highlight } = selectionContext;

  const middleNodes = getNodesBetweenNodes(
    commonContainer,
    anchor.node,
    focus.node
  );

  const commonStrategy = getCommonAction(
    selectionContext,
    decorator,
    middleNodes
  );

  highlight.removeAllRanges();

  if (commonStrategy === DecoratorActions.WRAP) {
    if (anchor.node === focus.node) {
      insertDecoratorByRange(decorator, range);
      return;
    }

    getLineChildren(middleNodes).forEach((node) => {
      const range = new Range();
      range.selectNode(node);
      insertDecoratorByRange(decorator, range);
    });

    const destination = getSelectionDestination(
      commonContainer,
      anchor.node,
      focus.node
    );

    if (destination === "right") {
      decorateAnchorNode(anchor.node, anchor.offset, decorator);
      decorateFocusNode(focus.node, focus.offset, decorator);
    } else {
      decorateAnchorNode(focus.node, focus.offset, decorator);
      decorateFocusNode(anchor.node, anchor.offset, decorator);
    }
  } else {
    unDecorateByRange(decorator, selectionContext);
  }
}
// END

export function insertDecoratorByRange(
  decorator: IViewDecorator,
  range: Range
) {
  const template = newDecorator(decorator);
  template.appendChild(range.cloneContents());
  range.deleteContents();
  range.insertNode(template);
}

function getCommonAction(
  ctx: SelectionContext,
  decorator: IViewDecorator,
  betweenNodes: Node[]
): DecoratorActions {
  const anchorStrategy = getDecoratorStrategy(ctx.anchor.node, decorator);

  const focusStrategy = getDecoratorStrategy(ctx.focus.node, decorator);

  const commonStrategy = [
    anchorStrategy,
    focusStrategy,
    ...betweenNodes.map((n) => getDecoratorStrategy(n, decorator)),
  ].includes(DecoratorActions.WRAP)
    ? DecoratorActions.WRAP
    : DecoratorActions.UNWRAP;

  return commonStrategy;
}

function unDecorateByRange(
  decorator: IViewDecorator,
  selectionContext: SelectionContext
) {
  // prepare
  const beforeRange = new Range();
  beforeRange.setStart(selectionContext.anchor.node, 0);
  beforeRange.setEnd(
    selectionContext.anchor.node,
    selectionContext.anchor.offset
  );
  const beforeContent = beforeRange.cloneContents();
  const beforeDec = newDecorator(decorator);

  const afterRange = new Range();
  afterRange.setStart(
    selectionContext.focus.node,
    selectionContext.focus.offset
  );
  afterRange.setEndAfter(selectionContext.focus.node);

  // action
  window.getSelection()!.removeAllRanges();

  window.getSelection()!.addRange(afterRange);
  const afterContent = afterRange.cloneContents();
  const afterDec = newDecorator(decorator);

  beforeDec.appendChild(beforeContent);
  beforeRange.deleteContents();
  beforeRange.insertNode(beforeDec);

  afterDec.appendChild(afterContent);
  afterRange.deleteContents();
  afterRange.insertNode(afterDec);

  const parent = selectionContext.anchor.node.parentElement!;

  parent.outerHTML = parent.innerHTML;
}

function getDecoratorStrategy(
  target: Node,
  decorator: IViewDecorator
): DecoratorActions {
  if (target.parentElement!) {
    const parentDecorator = target.parentElement!.getAttribute(
      DECORATOR_NAME_ATTRIBUTE
    );
    return parentDecorator === decorator.decoratorName
      ? DecoratorActions.UNWRAP
      : DecoratorActions.WRAP;
  }

  return DecoratorActions.WRAP;
}

function getSelectionDestination(common: Node, anchor: Node, focus: Node) {
  const anchorIndex = Array.from(common.childNodes).findIndex((node) =>
    node.contains(anchor)
  );

  const focusIndex = Array.from(common.childNodes).findIndex((node) =>
    node.contains(focus)
  );

  const result = anchorIndex < focusIndex ? "right" : "left";

  return result;
}
