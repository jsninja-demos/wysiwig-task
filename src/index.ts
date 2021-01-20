import { makeDecorator } from "./old/makeDecorator";
import { createLine } from "./old/line";
import { isDecorator } from "./old/template";
import { createDecorator } from "./decorator";
import { applyDecorator } from "./applyDecorator";

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

document.addEventListener(
  "selectionchange",
  function () {
    if (window.getSelection()!.isCollapsed) {
      selectstart = false;
    }
  },
  false
);

editor.addEventListener("selectstart", function () {
  selectstart = true;
});

const controls = Array.from(document.querySelector(".toolkit")!.children);
const [hed1, hed2, bold, italic] = controls;

const italicDecorator = createDecorator("italic", "italic-text", "span");
const boldDecorator = createDecorator("bold", "bold-text", "span");
const hed1Decorator = createDecorator("header1-text", "header1-text", "span");
const hed2Decorator = createDecorator("header2-text", "header2-text", "span");

hed1.addEventListener("click", () => applyDecorator(editor, hed1Decorator));
hed2.addEventListener("click", () => applyDecorator(editor, hed2Decorator));
bold.addEventListener("click", () => applyDecorator(editor, boldDecorator));
italic.addEventListener("click", () => applyDecorator(editor, italicDecorator));

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
