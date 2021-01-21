import {
  decorateNodes,
  DecoratorActions,
  DECORATOR_NAME_ATTRIBUTE,
  IViewDecorator,
  newDecorator,
  unDecorateNodes,
} from "./decorator";
import { getSelectionContext, SelectionContext } from "./getInitData";
import { Merger } from "./merge";

export function applyDecorator(editor: Node, decorator: IViewDecorator) {
  insertDecorator(decorator);
  Merger.merge(editor);
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

  if (anchor.node === focus.node || middleNodes.length === 0) {
    if (commonStrategy === DecoratorActions.WRAP) {
      insertDecoratorByRange(decorator, range);
    } else {
      unDecorateByRange(decorator, selectionContext);
    }
    return;
  }

  if (commonStrategy === DecoratorActions.WRAP) {
    decorateMiddleNodes(middleNodes, decorator);
  } else {
    unDecorateMiddleNodes(middleNodes, decorator.decoratorName);
  }
}
// END

function insertDecoratorByRange(decorator: IViewDecorator, range: Range) {
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
  console.log("anchorStrategy", anchorStrategy);

  const focusStrategy = getDecoratorStrategy(ctx.focus.node, decorator);
  console.log("focusStrategy", focusStrategy);

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

function decorateMiddleNodes(betweenNodes: Node[], decorator: IViewDecorator) {
  const betweenCommonDecorator = decorateNodes(betweenNodes, decorator);

  betweenNodes.forEach((bn, index, array) => {
    if (index === array.length - 1) {
      bn.parentNode!.replaceChild(betweenCommonDecorator, bn);
      return;
    }
    bn.parentNode!.removeChild(bn);
  });
}

export function unDecorateMiddleNodes(
  betweenNodes: Node[],
  decoratorName: string
) {
  const unDecInner = unDecorateNodes(betweenNodes, decoratorName);

  betweenNodes.forEach((bn, index, array) => {
    if (index === array.length - 1) {
      bn.parentNode!.replaceChild(document.createTextNode(unDecInner), bn);
      return;
    }
    bn.parentNode!.removeChild(bn);
  });
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

function getNodesBetweenNodes(common: Node, first: Node, second: Node): Node[] {
  const result: Node[] = [];
  let canPush = false;
  common.childNodes.forEach((childNode) => {
    if (childNode === second.parentElement!) {
      canPush = false;
    }
    if (canPush && childNode !== second) {
      result.push(childNode);
    }
    if (childNode === first.parentElement!) {
      canPush = true;
    }
  });

  return result;
}
