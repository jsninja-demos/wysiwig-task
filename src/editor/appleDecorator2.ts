import { Editor } from ".";
import { IViewDecorator } from "./decorator";
import { getSelectionContext } from "./getInitData";

export function applyDecorator(editor: Editor, decorator: IViewDecorator) {
  const selectionContext = getSelectionContext();

  if (!selectionContext) {
    return;
  }

  const { anchor, focus, commonContainer, range, highlight } = selectionContext;
}
