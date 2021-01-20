type DecoratorInfo = {
    decoratorName: string;
    style: string;
    tagName:string;
}


export class Editor{
    private editorRef:Element;
    private decorators:Map<string,DecoratorInfo>;

    constructor(editorRef:Element) {
        this.editorRef = editorRef;
        this.decorators = new Map<string, DecoratorInfo>();
    }

    public init(){
        this.editorRef.setAttribute("contenteditable","true")
    }

    addDecoration(decoratorInfo :DecoratorInfo){
        if(this.decorators.has(decoratorInfo.decoratorName)){
            return this
        };

        this.decorators.set(decoratorInfo.decoratorName, decoratorInfo)
        return this;
    }

}