import { applyDecorator } from "./applyDecorator";
import { Cleaner } from "./cleaner";
import { IViewDecorator } from "./decorator";
import { createLine } from "./line";
import { pathCopy } from "./pathCopy";

import { createDefaultRange } from "./range";
import { sanitizeAttributes } from "./sanitizeHtml";

export class Editor {
  public readonly editorRef: HTMLDivElement;
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
    this.editorRef.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        const line = createLine();
        this.editorRef.appendChild(line);

        const selection = window.getSelection();
        if (!selection) {
          return;
        }

        selection.removeAllRanges();
        selection.addRange(createDefaultRange(line));
        ev.preventDefault();
      } else {
        this.addLIne();
      }
    });

    this.editorRef.addEventListener("copy", (ev: ClipboardEvent) => {
      pathCopy(ev, this);
    });

    this.editorRef.addEventListener("cut", (ev: ClipboardEvent) => {
      pathCopy(ev, this, true);

      sanitizeAttributes(this.editorRef);
      Cleaner.clear(this.editorRef);
    });

    this.editorRef.addEventListener("paste", (event: ClipboardEvent) => {
      // event.clipboardData.setData("text/html", (wrapped as Element).innerHTML);
      console.log("event", event);

      const result = event.clipboardData?.getData("text/html");

      if (result) {
        const div = document.createElement("div");
        div.append(result);
        console.log("div", div);
      }
      // event.preventDefault();
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

  private addLIne() {
    console.log(this.editorRef.childNodes.length);
    if (Boolean(this.editorRef.childNodes.length === 0)) {
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
