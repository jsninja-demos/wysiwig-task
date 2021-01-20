export interface IViewDecorator {
  decoratorName: string;
  className: string;
  tagName: string;
}

export function createDecorator(
  decoratorName: string,
  className: string,
  tagName: string
) {
  return {
    decoratorName,
    className,
    tagName,
  };
}

export enum DecoratorActions {
  WRAP = "WRAP",
  UNWRAP = "UNWRAP",
}

export function decorate(node: Node, decorator: IViewDecorator): Element {
  const t = document.createElement(decorator.tagName);

  t.setAttribute("data-decorator", decorator.decoratorName);
  t.className = decorator.className;
  // t.style.display = "inline";
  t.appendChild(node);
  return t;
}

export function newDecorator(decorator: IViewDecorator): Element {
  const t = document.createElement(decorator.tagName);

  t.setAttribute("data-decorator", decorator.decoratorName);
  t.className = decorator.className;
  // t.style.display = "inline";
  return t;
}

export function decorateNodes(
  nodes: Node[],
  decorator: IViewDecorator
): Element {
  const t = document.createElement(decorator.tagName);

  t.setAttribute("data-decorator", decorator.decoratorName);
  t.className = decorator.className;
  // t.style.display = "inline";
  nodes.forEach((n) => t.appendChild(n.cloneNode(true)));
  return t;
}

export function unDecorateNodes(
  nodes: Node[],
  decorator: IViewDecorator
): string {
  const node = document.createElement("div");

  nodes.forEach((n) => {
    if (
      n instanceof Element &&
      n.getAttribute("data-decorator") === decorator.decoratorName
    ) {
      node.appendChild(document.createTextNode(n.innerHTML));
    }
    node.appendChild(n);
  });

  return node.innerHTML;
}
