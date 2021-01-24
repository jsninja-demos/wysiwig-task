import { Editor, createDecorator } from "./editor";

const editorRef: HTMLDivElement = document.querySelector<HTMLDivElement>(
  ".edit-area"
)!;

const controls = Array.from(document.querySelector(".toolkit")!.children);
const [hed1, hed2, bold, italic] = controls;

const italicDecorator = createDecorator("italic", { className: "italic-text" });
const boldDecorator = createDecorator("bold", { className: "bold-text" });

const hed1Decorator = createDecorator("header1", {
  className: "header1-text",
  tagName: "h1",
});

const hed2Decorator = createDecorator("header2", {
  className: "header2-text",
  tagName: "h2",
});

new Editor(editorRef)
  .addDecorator(hed1, hed1Decorator)
  .addDecorator(hed2, hed2Decorator)
  .addDecorator(bold, boldDecorator)
  .addDecorator(italic, italicDecorator);
