import { getAllNodes } from "./converter";
import { inlineDecoratorClasses } from "./cssRules";

import { Editor } from "./editor";

export function pathCopy(event: ClipboardEvent, editor: Editor) {
  if (!event || !event.clipboardData) {
    return;
  }

  const selection = document.getSelection();

  if (!selection) {
    return;
  }

  const selectionContent = selection.getRangeAt(0).cloneContents();

  const allElements = getAllNodes(
    Array.from(selectionContent.childNodes)
  ).filter((v) => v instanceof Element);

  Array.from(editor.decorators.values()).forEach((decorator) =>
    inlineDecoratorClasses(allElements, decorator.decoratorName)
  );

  const wrapped = document.createElement("div");
  wrapped.append(selectionContent);

  event.clipboardData.setData("text/html", wrapped.innerHTML);

  event.preventDefault();
}
