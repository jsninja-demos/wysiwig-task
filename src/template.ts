export function createTemplate(tagName:string,decoratorName:string,style:string, highlight: Selection):HTMLElement{
    const t = document.createElement(tagName)

    t.setAttribute("data-decorator",decoratorName);
    t.setAttribute("style",style);
    t.style.display = "inline"
    t.innerText = highlight.toString();

    return t
}
