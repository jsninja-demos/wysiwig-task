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
import { getAllTopDecorators, getLastChild } from "./pathCopy";

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

        middleRange.selectNodeContents(node);
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

    debugger;

    const beforeRContent = beforeR.extractContents();
    const innerRContent = innerR.extractContents();
    const afterRContent = afterR.extractContents();

    const decoratorsInfo = Array.from(editor.decorators.values());

    if (middleDecorators.length) {
      const nestedDecTree = createNestedDecorators(
        middleDecorators.map(
          (dec) => decoratorsInfo.find((d) => d.decoratorName === dec)!
        )
      );

      const nodeForInject = getLastChild(nestedDecTree);
      nodeForInject.appendChild(beforeRContent);
      nodeForInject.appendChild(innerRContent);
      nodeForInject.appendChild(afterRContent);

      topSameDecorator.parentNode?.replaceChild(
        nestedDecTree,
        topSameDecorator
      );
    } else {
      topSameDecorator.after(beforeRContent, innerRContent, afterRContent);
      topSameDecorator.parentNode?.removeChild(topSameDecorator);
    }
  }

  highlight.removeAllRanges();
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

export function isElement(target: Node): target is Element {
  return target instanceof Element;
}

export function isDecorator(target: Element): target is Element {
  return target.hasAttribute(DECORATOR_NAME_ATTRIBUTE);
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
}

export function createNestedDecorators(decorators: IViewDecorator[]): Element {
  const [root, ...nested] = decorators;
  const rootDecorator = newDecorator(root);

  nested.forEach((dec) => {
    insertDecoratorToLast(rootDecorator, newDecorator(dec));
  });

  return rootDecorator;
}

function insertDecoratorToLast(target: Element, decorator: Element) {
  getLastChild(target).appendChild(decorator);
}
