import {
  decorateNodes,
  DecoratorActions,
  IViewDecorator,
  newDecorator,
  unDecorateNodes,
} from "./decorator";
import { getInitData, InitDataType } from "./getInitData";
import { Merger } from "./merge";

export function applyDecorator(
  editor: HTMLDivElement,
  decorator: IViewDecorator
) {
  insertDecorator(editor, decorator);
  Merger.merge(editor);
}

function insertDecorator(editor: HTMLDivElement, decorator: IViewDecorator) {
  const initData = getInitData();

  if (!initData) {
    return;
  }

  console.log("applyDecorator.initData", initData);
  const { anchor, focus, commonContainer, highlight, range } = initData;
  const editorLine = getEditorLine(editor, commonContainer);
  console.log("editorLine", editorLine);

  const anchorStrategy = getDecoratorStrategy(anchor.node, decorator);
  console.log("anchorStrategy", anchorStrategy);

  const focusStrategy = getDecoratorStrategy(focus.node, decorator);
  console.log("focusStrategy", focusStrategy);

  const betweenNodes = getNodesBetweenNodes(
    commonContainer,
    anchor.node,
    focus.node
  );
  console.log("betweenNodes", betweenNodes);

  const commonStrategy = [
    anchorStrategy,
    focusStrategy,
    ...betweenNodes.map((n) => getDecoratorStrategy(n, decorator)),
  ].includes(DecoratorActions.WRAP)
    ? DecoratorActions.WRAP
    : DecoratorActions.UNWRAP;
  console.log("commonStrategy", commonStrategy);

  // если все очень узко
  if (anchor.node === focus.node || betweenNodes.length === 0) {
    if (commonStrategy === DecoratorActions.WRAP) {
      console.log("если все очень узко");
      insertDecoratorByRange(decorator, range);
    } else {
      unDecorateByRange(decorator, initData);
    }
    return;
  }

  // highlight.removeAllRanges();

  if (commonStrategy === DecoratorActions.WRAP) {
    // if (anchor.node.nodeType ===  || focus.node.nodeType === "text") {
    //   insertByHighlight(highlight, decorator, range);
    // }
    decorateMiddleNodes(betweenNodes, decorator);
  } else {
    unDecorateMiddleNodes(betweenNodes, decorator);
  }
}
// END

function insertDecoratorByRange(decorator: IViewDecorator, range: Range) {
  const template = newDecorator(decorator);
  template.appendChild(range.cloneContents());
  range.deleteContents();
  range.insertNode(template);
}

function unDecorateByRange(decorator: IViewDecorator, data: InitDataType) {
  const beforeRange = new Range();
  beforeRange.setStart(data?.anchor.node!, 0);
  beforeRange.setEnd(data?.anchor.node!, data?.anchor.offset!);
  const beforeContent = beforeRange.cloneContents();
  const beforeDec = newDecorator(decorator);

  const afterRange = new Range();
  afterRange.setStart(data?.focus.node!, data?.focus.offset!);
  afterRange.setEndAfter(data?.focus.node!);
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

  const parent = data?.anchor.node!.parentElement!;

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

function unDecorateMiddleNodes(
  betweenNodes: Node[],
  decorator: IViewDecorator
) {
  const unDecInner = unDecorateNodes(betweenNodes, decorator);

  betweenNodes.forEach((bn, index, array) => {
    if (index === array.length - 1) {
      bn.parentNode!.replaceChild(document.createTextNode(unDecInner), bn);
      return;
    }
    bn.parentNode!.removeChild(bn);
  });
}

function getEditorLine(editor: Node, node: Node): Node {
  let parent = node.parentElement!;
  if (parent === editor) {
    return node;
  }
  return getEditorLine(editor, parent);
}

function getDecoratorStrategy(
  target: Node,
  decorator: IViewDecorator
): DecoratorActions {
  if (target.parentElement!) {
    const parentDecorator = target.parentElement!.getAttribute(
      "data-decorator"
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

function getAllNodes(targets: Node[]): Node[] {
  const result: Node[] = [];

  targets.forEach((n) => {
    if (n instanceof Element && n.hasChildNodes()) {
      const second = getAllNodes(Array.from(n.childNodes));
      console.log("second", second);
    }
    result.push(n);
  });
  console.log("result", result);
  return result;
}

function unwrapNodes(flatNodes: Node[], decoratorName: string) {
  const decorators = flatNodes
    .filter((n) => n instanceof Element)
    .filter(
      (n) => (n as Element).getAttribute("data-decorator") === decoratorName
    );
  (decorators as Element[]).forEach((dec) =>
    dec.parentNode!.replaceChild(document.createTextNode(dec.innerHTML), dec)
  );
}
