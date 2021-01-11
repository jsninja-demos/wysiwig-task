import {createTemplate} from "./template";

export function makeDecorator( editor:HTMLDivElement, decoratorName: string, style: string, tagName:string= "span") {
    const highlight = window.getSelection()!;




    if (!highlight.isCollapsed) {
        const range = highlight.getRangeAt(0);
        range.deleteContents();
        range.insertNode(createTemplate(tagName,decoratorName,style,highlight));
        highlight.collapseToEnd();
    }
}

