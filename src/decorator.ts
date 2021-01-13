import { createTemplate, isDecorator } from "./template";

export function makeDecorator(
  editor: HTMLDivElement,
  decoratorName: string,
  style: string,
  tagName: string = "span"
) {
  const highlight = window.getSelection()!;

  if (highlight.isCollapsed) {
    return;
  }

  const { anchorNode, anchorOffset, focusNode, focusOffset } = highlight;

  const range = highlight.getRangeAt(0);

  // если нода одинаковая
  if (anchorNode === focusNode) {
    // если выделена вся нода
    if (anchorOffset === 0 && focusOffset === 0) {
      const parent = anchorNode!.parentNode as Element;

      const decorator = isDecorator(anchorNode!.parentNode);
      console.log(decorator);

      if (decorator) {
        range.insertNode(unwrapDecorator(parent));
        return;
      }
    }
  }

  const template = createTemplate(
    tagName,
    decoratorName,
    style,
    highlight.toString()
  );

  range.deleteContents();
  range.insertNode(template);
}

function unwrapDecorator(el: Element): Text {
  const inner = el.innerHTML;
  el.remove();
  return document.createTextNode(inner);
}
