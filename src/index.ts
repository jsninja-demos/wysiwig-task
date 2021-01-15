import { makeDecorator } from "./decorator";
import { createLine } from "./line";
import { isDecorator } from "./template";

const editor: HTMLDivElement = document.querySelector<HTMLDivElement>(
  ".edit-area"
)!;

editor.setAttribute("contenteditable", "true");

let selectstart = false;

editor.addEventListener("focusin", function (this: HTMLDivElement) {
  if (Boolean(this.childElementCount === 0)) {
    this.appendChild(createLine());
  }
});

editor.addEventListener(
  "dblclick",
  function (this, ev) {
    console.log(2, this, ev, window.getSelection());

    console.log(ev.currentTarget);
    const path = getPath(ev);
    console.log("path", path);

    path.forEach((p) => {
      if (isDecorator(p)) {
        const range = new Range();
        range.setStart(p, 0);
        range.setEnd(p, 0);
        window.getSelection()!.removeAllRanges();
        window.getSelection()!.addRange(range);
        debugger;
        return;
      }
    });
    return;
  },
  { capture: false, passive: true }
);

document.addEventListener(
  "selectionchange",
  function () {
    if (window.getSelection()!.isCollapsed) {
      selectstart = false;
    }
  },
  false
);

editor.addEventListener(
  "selectstart",
  function (this: HTMLDivElement, ev: Event) {
    selectstart = true;
  }
);

const controls = Array.from(document.querySelector(".toolkit")!.children);
const [hed1, hed2, bold, italic] = controls;

hed1.addEventListener("click", () => makeDecorator(editor, "italic", "", "h1"));
hed2.addEventListener("click", () => makeDecorator(editor, "italic", "", "h2"));
bold.addEventListener("click", () =>
  makeDecorator(editor, "bold", "font-weight:bold;", "b")
);
italic.addEventListener("click", () =>
  makeDecorator(editor, "italic", "font-style:italic;", "i")
);

function getPath(ev: MouseEvent) {
  const path = [];
  let currentElem: EventTarget | null = ev.target;
  while (currentElem) {
    path.push(currentElem);
    // @ts-ignore
    currentElem = currentElem.parentElement ?? null;
  }
  if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
    path.push(document);
  if (path.indexOf(window) === -1) path.push(window);
  return path;
}
