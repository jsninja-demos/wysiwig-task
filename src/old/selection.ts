export function getSelectionText():string{
    return window.getSelection()!.toString()
}
export function getSelection(): Selection | null{
    return window.getSelection()
}

export function hasSelection():boolean{
    return  Boolean(getSelectionText())
}