import { Cleaner } from "./cleaner";
import { getAllNodes } from "./converter";
import { inlineDecoratorClasses } from "./cssRules";
import { DECORATOR_NAME_ATTRIBUTE, newDecorator } from "./decorator";

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

  const topLevelDecorators = getAllTopDecorators(
    selection!.anchorNode as Node,
    editor.editorRef
  );

  const decorators = topLevelDecorators.reverse().map((decoratorName) => {
    const decoratorInfo = Array.from(editor.decorators.values()).find(
      (d) => d.decoratorName === decoratorName
    );
    if (!decoratorInfo) {
      return;
    }
    return newDecorator(decoratorInfo);
  });

  decorators.forEach((dec, index, array) => {
    const nextDec = array[index + 1];

    if (!nextDec) {
      return;
    }
    dec?.appendChild(nextDec);
  });

  const treeOfDecorators = decorators[0] || document.createElement("p");

  if (!treeOfDecorators) {
    return;
  }

  const allElements = getAllNodes(
    Array.from(selectionContent.childNodes)
  ).filter((v) => v instanceof Element);

  Array.from(editor.decorators.values()).forEach((decorator) =>
    inlineDecoratorClasses(allElements, decorator.decoratorName)
  );

  Array.from(editor.decorators.values()).forEach((decorator) =>
    inlineDecoratorClasses(
      getAllNodes([treeOfDecorators]),
      decorator.decoratorName
    )
  );

  getLastChild(treeOfDecorators).appendChild(selectionContent);

  const wrapped2 = document.createElement("p");
  wrapped2.appendChild(treeOfDecorators);

  event.clipboardData.setData("text/html", wrapped2.innerHTML);

  if (deleteSelection) {
    selection.deleteFromDocument();
  }

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

function getLastChild(target: Node): Node {
  if (target.lastChild) {
    return getLastChild(target.lastChild);
  }
  return target;
}
