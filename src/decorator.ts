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

  if (!anchorNode || !focusNode) {
    return;
  }

  const range = highlight.getRangeAt(0);

  const commonContainer = range.commonAncestorContainer;
  const rootNode = isTextNode(commonContainer)
    ? commonContainer.parentNode!
    : commonContainer;

  const anParent = anchorNode.parentElement!;
  const fnParent = focusNode.parentElement!;

  deleteDecoratorsInElement(anParent, decoratorName);
  deleteDecoratorsInElement(fnParent, decoratorName);

  const template = createTemplate(
    tagName,
    decoratorName,
    style,
    highlight.toString()
  );

  range.deleteContents();
  range.insertNode(template);

  mergeNextDecorators(rootNode);
}

function unwrapDecorator(el: any): Text {
  const inner = el.innerHTML;
  el.remove();
  return document.createTextNode(inner);
}

export function isTextNode(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE;
}

function isElement(element: any): element is Element {
  return element instanceof Element || element instanceof HTMLDocument;
}

//

function getDecoratorsByName(element: Element, decoratorName: string) {
  return (
    Array.from(element!.childNodes)
      .filter((ch) => isElement(ch))
      // @ts-ignore
      .filter((ch) => ch.hasAttribute(`data-decorator=${decoratorName}`))
  );
}

function deleteDecoratorsInElement(element: Element, decoratorName: string) {
  const childElements = element
    ? []
    : getDecoratorsByName(element, decoratorName);

  console.log("childElements", childElements);

  if (!childElements.length) {
    return;
  }

  childElements.forEach((ch) => {
    element.replaceChild(unwrapDecorator(ch), ch);
  });
}

export function mergeNextDecorators(node: Node) {
  node.childNodes.forEach((n, index, array) => {
    const next = array[index + 1];

    const canMerge =
      Boolean(n) &&
      Boolean(next) &&
      isElement(n) &&
      isElement(next) &&
      decoratorsEq(n, next);

    if (canMerge) {
      n.appendChild(document.createTextNode((next as Element).innerHTML));
      next.parentElement!.removeChild(next);
    }
  });
}

export function decoratorsEq(t1: Element, t2: Element): boolean {
  return (
    t1.getAttribute("data-decorator") === t2.getAttribute("data-decorator")
  );
}

function detectStrategy(selection: Selection) {}
