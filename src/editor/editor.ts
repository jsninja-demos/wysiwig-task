import { applyDecorator } from "./applyDecorator";
import { IViewDecorator } from "./decorator";
import { createLine } from "./line";
import { createDefaultRange } from "./range";

export class Editor {
  private editorRef: HTMLDivElement;
  private decorators = new Map<Node, IViewDecorator>();
  private state = {
    selectstart: false,
  };

  constructor(editorRef: HTMLDivElement) {
    this.editorRef = editorRef;
    this.editorRef.setAttribute("contenteditable", "true");
    this.initEventListener();
  }

  addDecorator(
    ref: Node,
    decorator: IViewDecorator
  ): InstanceType<typeof Editor> {
    this.decorators.set(ref, decorator);
    this.regClickOnDecorator(ref, decorator);
    return this;
  }

  private initEventListener() {
    this.editorRef.addEventListener(
      "selectstart",
      () => (this.state.selectstart = true)
    );
    document.addEventListener(
      "selectionchange",
      () => {
        if (window.getSelection()!.isCollapsed) {
          this.state.selectstart = false;
        }
      },
      false
    );
    this.editorRef.addEventListener("focusin", function (this: HTMLDivElement) {
      if (Boolean(this.childElementCount === 0)) {
        const line = createLine();
        this.appendChild(line);

        const selection = window.getSelection();
        if (!selection) {
          return;
        }

        selection.removeAllRanges();
        selection.addRange(createDefaultRange(line));
      }
    });
  }

  private regClickOnDecorator(ref: Node, decorator: IViewDecorator) {
    ref.addEventListener("click", () =>
      applyDecorator(this.editorRef, decorator)
    );
  }
}
