import { applyDecorator } from "./applyDecorator";
import { getAllNodes } from "./converter";
import { IViewDecorator } from "./decorator";
import { createLine } from "./line";
import { createDefaultRange } from "./range";

export class Editor {
  private editorRef: HTMLDivElement;
  private decorators = new Map<Node, IViewDecorator>();

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

  private canApplyDecorator(): boolean {
    const selection = window.getSelection();

    if (!selection) {
      return false;
    }

    return selection.containsNode(this.editorRef, true);
  }

  private initEventListener() {
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
    ref.addEventListener("click", () => {
      if (!this.canApplyDecorator()) {
        return;
      }
      applyDecorator(this.editorRef, decorator);
    });
  }
}
