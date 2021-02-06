import { Editor } from ".";
import { getDecoratorStrategy } from "./applyDecorator";
import {
  decorateAnchorNode,
  decorateFocusNode,
  DecoratorActions,
  DECORATOR_NAME_ATTRIBUTE,
  IViewDecorator,
  newDecorator,
} from "./decorator";
import { getSelectionContext } from "./getInitData";
import { getNodesBetweenNodes } from "./nodes";
import { getAllTopDecorators } from "./pathCopy";

export function applyDecorator(editor: Editor, decorator: IViewDecorator) {
  const selectionContext = getSelectionContext();

  if (!selectionContext) {
    return;
  }

  const { anchor, focus, commonContainer, range, highlight } = selectionContext;

  const anchorDecorators = getAllTopDecorators(anchor.node, editor.editorRef);
  const focusDecorators = getAllTopDecorators(focus.node, editor.editorRef);

  const canWrapAnchor = !anchorDecorators.includes(decorator.decoratorName);
  const canWrapFocus = !focusDecorators.includes(decorator.decoratorName);

  const middleNodes = getNodesBetweenNodes(
    commonContainer,
    anchor.node,
    focus.node
  );

  const middleDecorators = middleNodes.map((d) =>
    getDecoratorStrategy(d, decorator)
  );

  const canWrapMiddle = middleDecorators.includes(DecoratorActions.WRAP);

  const strategyWrapEnable = canWrapAnchor || canWrapFocus || canWrapMiddle;

  // debugger;
  console.log("a");

  if (strategyWrapEnable) {
    if (middleNodes.length) {
      if (canWrapAnchor) {
        decorateAnchorNode(anchor.node, anchor.offset, decorator);
      }
      if (canWrapFocus) {
        decorateFocusNode(focus.node, focus.offset, decorator);
      }

      middleNodes.forEach((node) => {
        const middleRange = new Range();

        console.log("middleNodes", node);
        middleRange.selectNode(node);
        createDecoratorByRange(decorator, middleRange);
      });

      return;
    }

    createDecoratorByRange(decorator, range);
  } else {
    const topSameDecorator = getTopSameDecorator(commonContainer, decorator);

    const middleDecorators = getDecoratorsBetweenDecorators(
      commonContainer,
      topSameDecorator
    ).map((dec) => dec.getAttribute(DECORATOR_NAME_ATTRIBUTE));

    const needSaveDecorators = focusDecorators.filter(
      (dec) => dec !== decorator.decoratorName
    );
    console.log("needSaveDecorators", needSaveDecorators);

    const beforeR = new Range();
    beforeR.setStartBefore(topSameDecorator);
    beforeR.setEnd(
      selectionContext.anchor.node,
      selectionContext.anchor.offset
    );

    const afterR = new Range();
    afterR.setStart(selectionContext.focus.node, selectionContext.focus.offset);
    afterR.setEndAfter(topSameDecorator);

    const innerR = new Range();
    innerR.setStart(
      selectionContext.anchor.node,
      selectionContext.anchor.offset
    );
    innerR.setEnd(selectionContext.focus.node, selectionContext.focus.offset);

    const beforeRContent = beforeR.extractContents();
    const innerRContent = innerR.extractContents();
    const afterRContent = afterR.extractContents();

    debugger;

    middleDecorators.forEach((dec) => {
      const decInfo = Array.from(editor.decorators.values()).find(
        (d) => d.decoratorName === dec
      );
      const range = new Range();
      range.selectNodeContents(innerRContent);
      createDecoratorByRange(decInfo!, range);
    });

    topSameDecorator.after(beforeRContent, innerRContent, afterRContent);

    topSameDecorator.parentNode?.removeChild(topSameDecorator);
  }
}

function createDecoratorByRange(decorator: IViewDecorator, range: Range) {
  const template = newDecorator(decorator);
  template.appendChild(range.cloneContents());
  range.deleteContents();
  range.insertNode(template);
}

function getTopSameDecorator(node: Node, decorator: IViewDecorator): Element {
  if (!isElement(node)) {
    return getTopSameDecorator(node.parentElement!, decorator);
  }

  const topDecoratorName = (node as Element).getAttribute(
    DECORATOR_NAME_ATTRIBUTE
  );

  if (topDecoratorName === decorator.decoratorName) {
    return node as Element;
  }

  return getTopSameDecorator(node.parentElement!, decorator);
}

function isElement(target: Node): target is Element {
  return target instanceof Element;
}

function getDecoratorsBetweenDecorators(
  bottomDecorator: Node,
  topDecorator: Element
): Element[] {
  const result: Element[] = [];

  if (bottomDecorator === topDecorator) {
    return result;
  }

  if (
    bottomDecorator instanceof Element &&
    bottomDecorator.getAttribute(DECORATOR_NAME_ATTRIBUTE)
  ) {
    result.push(bottomDecorator);
  }

  const res = getDecoratorsBetweenDecorators(
    bottomDecorator.parentElement!,
    topDecorator
  );

  result.push(...res);

  return result;

  // if (!isElement(node)) {
  //   return getTopSameDecorator(node.parentElement!, decorator);
  // }

  // const topDecoratorName = (node as Element).getAttribute(
  //   DECORATOR_NAME_ATTRIBUTE
  // );

  // if (topDecoratorName === decorator.decoratorName) {
  //   return node as Element;
  // }

  // return getTopSameDecorator(node.parentElement!, decorator);
}
