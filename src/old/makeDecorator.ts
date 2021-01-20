import { Decorator } from "./decorator";
import { DecoratorsMerger } from "./decoratorsMerger";
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
  console.log("anchorNode", anchorNode);
  console.log("anchorOffset", anchorOffset);
  console.log("focusNode", focusNode);
  console.log("focusOffset", focusOffset);

  const range = highlight.getRangeAt(0);

  const commonContainer = range.commonAncestorContainer;
  console.log(commonContainer, "commonContainer");

  const rootNode = isTextNode(commonContainer)
    ? commonContainer.parentNode!
    : commonContainer;
  console.log(rootNode, "rootNode");
  console.log("commonContainer=== rootNode", commonContainer === rootNode);

  const anParent = anchorNode.parentElement!;
  const fnParent = focusNode.parentElement!;

  if (anchorNode !== focusNode) {
    console.log(commonContainer);

    const t = Array.from(commonContainer.childNodes).filter((v) => {
      return (
        v.nodeValue !== "" ||
        Decorator.is(v) ||
        Decorator.hasType(v, decoratorName)
      );
    });
    const nodesForWrapp = t.slice(1, t.length - 1);

    nodesForWrapp.forEach((nfw) => {
      const template = createTemplate(
        tagName,
        decoratorName,
        style,
        nfw.textContent?.toString() ?? ""
      );
      commonContainer.replaceChild(template, nfw);
    });

    // first
    const deletedText = splitDecorator(
      Decorator.getDecorator(anchorNode),
      anchorOffset
    );

    const template = createTemplate(tagName, decoratorName, style, deletedText);
    // console.log("template", template);

    anParent.appendChild(template);

    // second

    const deletedText2 = splitDecorator(
      Decorator.getDecorator(focusNode),
      focusOffset,
      true
    );

    // console.log("deletedText2", deletedText2);

    const template2 = createTemplate(
      tagName,
      decoratorName,
      style,
      deletedText2
    );

    // console.log("template2", template2);
    fnParent.insertBefore(template2, fnParent.firstChild);

    // between
    const between = commonContainer;
    // console.log("commonContainer", commonContainer.childNodes);

    // const betweenRange = new Range();
    // betweenRange.setStart(commonContainer, anchorOffset);
    // betweenRange.setStart(commonContainer, focusOffset);
    // window.getSelection()!.removeAllRanges();
    // window.getSelection()!.removeAllRanges();
    // window.getSelection()!.addRange(betweenRange);

    DecoratorsMerger.mergeNear(rootNode, template, range);
    return;
  }

  const template = createTemplate(
    tagName,
    decoratorName,
    style,
    highlight.toString()
  );

  console.log("template", template);

  range.deleteContents();
  range.insertNode(template);

  DecoratorsMerger.mergeNear(rootNode, template, range);
}

function splitDecorator(
  target: Element,
  offest: number,
  revert = false
): string {
  let [f, s] = split_at_index(target.innerHTML, offest);
  if (revert) {
    [s, f] = [f, s];
  }
  target.innerHTML = f;

  return s;
}

function split_at_index(value: string, index: number): [string, string] {
  return [value.substring(0, index), value.substring(index)];
}

export function isTextNode(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE;
}

export function isElement(element: unknown | unknown[]): element is Element {
  return Array.isArray(element)
    ? element.every((v) => isElement(v))
    : element instanceof Element || element instanceof HTMLDocument;
}
