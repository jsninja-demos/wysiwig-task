import { applyDecorator } from "./applyDecorator";
import { getAllNodes } from "./converter";
import { IViewDecorator } from "./decorator";
import { createLine } from "./line";
import { pathCopy } from "./pathCopy";

import { createDefaultRange } from "./range";

export class Editor {
  private readonly editorRef: HTMLDivElement;
  public readonly decorators = new Map<Node, IViewDecorator>();

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
    this.editorRef.addEventListener("focusin", () => this.addLIne());
    this.editorRef.addEventListener("keydown", () => this.addLIne());

    this.editorRef.addEventListener("copy", (ev: ClipboardEvent) =>
      pathCopy(ev, this)
    );

    this.editorRef.addEventListener("cut", (ev: ClipboardEvent) =>
      pathCopy(ev, this, true)
    );
  }

  private regClickOnDecorator(ref: Node, decorator: IViewDecorator) {
    ref.addEventListener("click", () => {
      if (!this.canApplyDecorator()) {
        return;
      }
      applyDecorator(this.editorRef, decorator);
    });
  }

  private addLIne() {
    if (Boolean(this.editorRef.childElementCount === 0)) {
      const line = createLine();
      this.editorRef.appendChild(line);

      const selection = window.getSelection();
      if (!selection) {
        return;
      }

      selection.removeAllRanges();
      selection.addRange(createDefaultRange(line));
    }
  }
}
