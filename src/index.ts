import { createDecorator } from "./decorator";
import { Editor } from "./editor";

const editorRef: HTMLDivElement = document.querySelector<HTMLDivElement>(
  ".edit-area"
)!;

const controls = Array.from(document.querySelector(".toolkit")!.children);
const [hed1, hed2, bold, italic] = controls;

const italicDecorator = createDecorator("italic", "italic-text", "span");
const boldDecorator = createDecorator("bold", "bold-text", "span");
const hed1Decorator = createDecorator("header1", "header1-text", "span");
const hed2Decorator = createDecorator("header2", "header2-text", "span");

new Editor(editorRef)
  .addDecorator(hed1, hed1Decorator)
  .addDecorator(hed2, hed2Decorator)
  .addDecorator(bold, boldDecorator)
  .addDecorator(italic, italicDecorator);
