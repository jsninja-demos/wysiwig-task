import { createNestedDecorators, isDecorator } from "./applyDecorator2";
import { getAllNodes } from "./converter";
import { getCss, inliningClassesInDecorator } from "./cssRules";
import { DECORATOR_NAME_ATTRIBUTE, IViewDecorator } from "./decorator";

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

  const decoratorsInfo = Array.from(editor.decorators.values());

  const topDec = getAllElements(
    userRange.commonAncestorContainer,
    editor.editorRef
  )
    .filter((el) => isDecorator(el as Element))
    .map((el) => el.getAttribute(DECORATOR_NAME_ATTRIBUTE))
    .map((dec) => decoratorsInfo.find((d) => d.decoratorName === dec));

  if (topDec.length) {
    const nestedDecTree = createNestedDecorators(
      topDec.filter((v) => Boolean(v)) as IViewDecorator[]
    );

    getLastChild(nestedDecTree).appendChild(selectionContent);

    getAllNodes(Array.from([nestedDecTree]))
      .filter((node) => node instanceof Element)
      .filter((el) => (el as Element).hasAttribute(DECORATOR_NAME_ATTRIBUTE))
      .forEach((dec) => {
        inliningClassesInDecorator(
          dec as Element,
          Array.from((dec as Element).classList),
          cssRules
        );
      });

    const div = document.createElement("div");
    div.appendChild(nestedDecTree);

    if (deleteSelection) {
      selection.deleteFromDocument();
    }

    event.clipboardData.setData("text/html", div.innerHTML);

    event.preventDefault();
  } else {
    const div = document.createElement("div");
    div.appendChild(selectionContent);

    getAllNodes(Array.from([div]))
      .filter((node) => node instanceof Element)
      .filter((el) => (el as Element).hasAttribute(DECORATOR_NAME_ATTRIBUTE))
      .forEach((dec) => {
        inliningClassesInDecorator(
          dec as Element,
          Array.from((dec as Element).classList),
          cssRules
        );
      });

    if (deleteSelection) {
      selection.deleteFromDocument();
    }

    event.clipboardData.setData("text/html", div.innerHTML);

    event.preventDefault();
  }
}

export function getAllTopDecorators(target: Node, editorRef: Node): string[] {
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

export function getAllElements(from: Node, to: Element): Element[] {
  const result: Element[] = [];

  if (from === to) {
    return result;
  }

  if (from instanceof Element) {
    result.push(from);
  }

  if (from.parentElement) {
    result.push(...getAllElements(from.parentElement, to));
  }

  return result;
}

// function getClassesByDecorators(
//   decoratorsName: string[],
//   decorators: IViewDecorator[]
// ): string[] {
//   const result: string[] = [];

//   decoratorsName.forEach((decName) => {
//     const fDec = decorators.find((d) => d.decoratorName === decName);
//     if (!fDec) {
//       return;
//     }
//     result.push(fDec.className);
//   });

//   return result;
// }

export function getLastChild(target: Node): Node {
  if (target.lastChild) {
    return getLastChild(target.lastChild);
  }
  return target;
}

// function createTopLevelDecorators(
//   decoratorsName: string[],
//   decorators: IViewDecorator[],
//   rules: CSSStyleRule[]
// ): Element {
//   const nestedDecorators = decoratorsName.map((name) => {
//     const decInfo = decorators.find((d) => d.decoratorName === name);
//     return newDecorator(decInfo!);
//   });

//   nestedDecorators.forEach((dec, index, array) => {
//     const nextDec = array[index + 1];

//     inliningClassesInDecorator(dec, Array.from(dec.classList), rules);

//     if (!nextDec) {
//       return;
//     }
//     dec?.appendChild(nextDec);
//   });

//   return nestedDecorators[0];
// }

// function createWrappedDecorator(
//   userRange: Range,
//   editor: Editor,
//   rules: CSSStyleRule[]
// ): Element {
//   const topLevelDecorators = getAllTopDecorators(
//     userRange.commonAncestorContainer!,
//     editor.editorRef
//   );

//   const wrapped = createTopLevelDecorators(
//     topLevelDecorators,
//     Array.from(editor.decorators.values()),
//     rules
//   );

//   const decoratorClasses = getClassesByDecorators(
//     topLevelDecorators,
//     Array.from(editor.decorators.values())
//   );

//   inliningClassesInDecorator(wrapped, decoratorClasses, rules);

//   return wrapped;
// }
