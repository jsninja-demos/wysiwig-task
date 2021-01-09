// type TextDecorator = { name: string; template: string; text: string; }

export function makeDecorator(decoratorName: string, style: string, tagName?:string) {
    const highlight = window.getSelection()!;

    const template = createTemplate(tagName || "span",decoratorName,style,highlight)

    const range = highlight.getRangeAt(0);

    if (!highlight.isCollapsed) {
        range.deleteContents();
        range.insertNode(template);
    }
}
function createTemplate(tagName:string,decoratorName:string,style:string, highlight: Selection):HTMLElement{
    const t = document.createElement(tagName)

    t.setAttribute("data-decorator",decoratorName);
    t.setAttribute("style",style);
    t.style.display = "inline"
    t.innerText = highlight.toString();

    return t
}
