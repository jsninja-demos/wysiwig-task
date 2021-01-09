export function makeDecorator(decoratorName: string, style: string) {
    const highlight = window.getSelection()!;

    const template = `<span data-decorator=${decoratorName} style=${style}>${highlight}</span>`;

    const range = highlight.getRangeAt(0);


    if (highlight.rangeCount) {
        range.deleteContents();
        range.insertNode(createDiv(template));
    }

}

function createDiv(template:string) {
    const newDiv = document.createElement("span");
    newDiv.innerHTML = template;
    return newDiv
}


