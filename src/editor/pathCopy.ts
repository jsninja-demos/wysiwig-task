import { getAllNodes } from "./converter";
import { getCss, inliningClassesInDecorator } from "./cssRules";
import {
  DECORATOR_NAME_ATTRIBUTE,
  IViewDecorator,
  newDecorator,
} from "./decorator";

import { Editor } from "./editor";

export function pathCopy(
  event: ClipboardEvent,
  editor: Editor,
  deleteSelection?: boolean
) {
  if (!event || !event.clipboardData) {
    return;
  }

  const selection = document.getSelection();

  if (!selection) {
    return;
  }

  const selectionContent = selection.getRangeAt(0).cloneContents();
  const userRange = selection.getRangeAt(0);

  const cssRules = getCss();

  const wrapped = createWrappedDecorator(userRange, editor, cssRules);

  const decoratorsInSelection = getAllNodes(
    Array.from(selectionContent.childNodes)
  ).filter((node) => node instanceof Element);

  decoratorsInSelection.forEach((dec) => {
    inliningClassesInDecorator(
      dec as Element,
      Array.from((dec as Element).classList),
      cssRules
    );
  });

  getLastChild(wrapped).appendChild(selectionContent);

  if (deleteSelection) {
    selection.deleteFromDocument();
  }

  const div = document.createElement("div");
  div.appendChild(wrapped);

  event.clipboardData.setData("text/html", div.innerHTML);

  event.preventDefault();
}

function getAllTopDecorators(target: Node, editorRef: Node): string[] {
  const result: string[] = [];
  const decorator = target.parentElement;

  if (!decorator) {
    return result;
  }

  if (decorator === editorRef) {
    return result;
  }

  const decoratorName = decorator.getAttribute(DECORATOR_NAME_ATTRIBUTE);

  if (decoratorName) {
    result.push(decoratorName);
  }

  const otherDecorators = getAllTopDecorators(decorator, editorRef);

  result.push(...otherDecorators);

  return result;
}

function getClassesByDecorators(
  decoratorsName: string[],
  decorators: IViewDecorator[]
): string[] {
  const result: string[] = [];

  decoratorsName.forEach((decName) => {
    const fDec = decorators.find((d) => d.decoratorName === decName);
    if (!fDec) {
      return;
    }
    result.push(fDec.className);
  });

  return result;
}

function getLastChild(target: Node): Node {
  if (target.lastChild) {
    return getLastChild(target.lastChild);
  }
  return target;
}

function createTopLevelDecorators(
  decoratorsName: string[],
  decorators: IViewDecorator[],
  rules: CSSStyleRule[]
): Element {
  const nestedDecorators = decoratorsName.map((name) => {
    const decInfo = decorators.find((d) => d.decoratorName === name);
    return newDecorator(decInfo!);
  });

  nestedDecorators.forEach((dec, index, array) => {
    const nextDec = array[index + 1];

    inliningClassesInDecorator(dec, Array.from(dec.classList), rules);

    if (!nextDec) {
      return;
    }
    dec?.appendChild(nextDec);
  });

  return nestedDecorators[0];
}

function createWrappedDecorator(
  userRange: Range,
  editor: Editor,
  rules: CSSStyleRule[]
): Element {
  const topLevelDecorators = getAllTopDecorators(
    userRange.commonAncestorContainer!,
    editor.editorRef
  );

  const wrapped =
    createTopLevelDecorators(
      topLevelDecorators,
      Array.from(editor.decorators.values()),
      rules
    ) || document.createElement("div");

  const decoratorClasses = getClassesByDecorators(
    topLevelDecorators,
    Array.from(editor.decorators.values())
  );

  inliningClassesInDecorator(wrapped, decoratorClasses, rules);

  return wrapped;
}
