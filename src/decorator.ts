import {createTemplate, isDecorator} from "./template";

export function makeDecorator( editor:HTMLDivElement, decoratorName: string, style: string, tagName:string= "span") {
    const highlight = window.getSelection()!;

    if(highlight.isCollapsed){
        return;
    }

    const {anchorNode,focusNode} = highlight;

    const range = highlight.getRangeAt(0);



    // если нода одинаковая
    if(anchorNode===focusNode){
        const parent =anchorNode!.parentNode as Element;

        if(isDecorator(anchorNode!.parentNode)){
            const inner = parent.innerHTML;
            parent.remove()
            console.log(parent)
            range.insertNode(document.createTextNode(inner));
            return;
        }

    }
    const template = createTemplate(tagName,decoratorName,style,highlight.toString());
    range.deleteContents()
    range.insertNode(template);

}
