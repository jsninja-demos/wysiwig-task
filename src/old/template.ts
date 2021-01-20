export function createTemplate(
  tagName: string,
  decoratorName: string,
  style: string,
  innerHTML: string
): HTMLElement {
  const t = document.createElement(tagName);

  t.setAttribute("data-decorator", decoratorName);
  t.setAttribute("style", style);
  t.style.display = "inline";
  t.innerHTML = innerHTML;

  return t;
}

// export function getInnerFromTemplate(el:HTMLElement){
//     return el.innerHTML
// }

export interface DataDecorator extends Element {}

export function isDecorator(node: unknown): node is DataDecorator {
  try {
    return (node as Element).hasAttribute("data-decorator");
  } catch {
    return false;
  }
}

export function cloneRangeContents(highlight: Selection): string {
  const cloned = document.createElement("div");
  for (let i = 0; i < highlight.rangeCount; i++) {
    cloned.append(highlight.getRangeAt(i).cloneContents());
  }

  return cloned.innerHTML;
}
